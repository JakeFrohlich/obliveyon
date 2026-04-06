import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY;
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID;

const bodySchema = z.object({
  email: z.string().max(254).refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
    message: "Valid email is required",
  }),
  phone: z.string().max(20).optional(),
});

function sanitize(str: unknown, maxLength: number): string {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim().slice(0, maxLength);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // 5 requests per 15 minutes per IP
  const rl = rateLimit(`klaviyo:${ip}`, 5, 15 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": "100",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  if (!KLAVIYO_API_KEY || !KLAVIYO_LIST_ID) {
    console.error("Klaviyo not configured — missing:", !KLAVIYO_API_KEY ? "API_KEY" : "LIST_ID");
    return NextResponse.json({ error: "Klaviyo not configured" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const email = sanitize(parsed.data.email, 254);
  const phone = parsed.data.phone ? sanitize(parsed.data.phone, 20) : undefined;

  // Normalize phone to E.164 if provided (Klaviyo requires +1XXXXXXXXXX format for US)
  let normalizedPhone: string | undefined;
  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) normalizedPhone = `+1${digits}`;
    else if (digits.length === 11 && digits.startsWith("1")) normalizedPhone = `+${digits}`;
    else normalizedPhone = `+${digits}`;
  }

  // Build profile attributes
  const profileAttributes: Record<string, unknown> = {
    email,
    properties: { source: "drop_waitlist" },
  };
  if (normalizedPhone) {
    profileAttributes.phone_number = normalizedPhone;
    // Consent for SMS marketing
    profileAttributes.sms_marketing = {
      consent: "SUBSCRIBED",
      consented_at: new Date().toISOString(),
    };
  }

  // Subscribe profile to the list using current Klaviyo API format
  const subscribeRes = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
    method: "POST",
    headers: {
      accept: "application/vnd.api+json",
      revision: "2025-01-15",
      "content-type": "application/vnd.api+json",
      Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: "profile-subscription-bulk-create-job",
        attributes: {
          profiles: {
            data: [
              {
                type: "profile",
                attributes: {
                  email,
                  ...(normalizedPhone ? { phone_number: normalizedPhone } : {}),
                  subscriptions: {
                    email: { marketing: { consent: "SUBSCRIBED" } },
                  },
                },
              },
            ],
          },
        },
        relationships: {
          list: {
            data: { type: "list", id: KLAVIYO_LIST_ID },
          },
        },
      },
    }),
  });

  if (!subscribeRes.ok) {
    const errBody = await subscribeRes.text();
    console.error("Klaviyo error:", subscribeRes.status, errBody);
    return NextResponse.json({ error: `Klaviyo error ${subscribeRes.status}` }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
