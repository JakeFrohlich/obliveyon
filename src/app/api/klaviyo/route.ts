import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY;
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID;

// E.164 format: + followed by 7–15 digits
const E164_REGEX = /^\+[1-9]\d{6,14}$/;

const bodySchema = z
  .object({
    email: z
      .string()
      .max(254)
      .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
        message: "Valid email is required",
      })
      .optional(),
    phone: z
      .string()
      .max(20)
      .refine((v) => E164_REGEX.test(v), {
        message: "Phone must be in E.164 format (e.g. +14155550100)",
      })
      .optional(),
    ref: z
      .string()
      .max(64)
      .regex(/^[a-zA-Z0-9_-]+$/)
      .optional(),
  })
  .refine((d) => d.email || d.phone, {
    message: "At least one of email or phone is required",
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

  const email = parsed.data.email ? sanitize(parsed.data.email, 254) : undefined;
  const normalizedPhone = parsed.data.phone ? sanitize(parsed.data.phone, 20) : undefined;
  const ref = parsed.data.ref ? sanitize(parsed.data.ref, 64) : undefined;

  // Step 1: Upsert profile with custom properties (source + ad_ref)
  // This runs FIRST so the profile exists with attribution data before any subscription job
  const profileProperties: Record<string, string> = { source: "drop_waitlist" };
  if (ref) profileProperties.ad_ref = ref;

  const importRes = await fetch("https://a.klaviyo.com/api/profile-import/", {
    method: "POST",
    headers: {
      accept: "application/vnd.api+json",
      revision: "2025-01-15",
      "content-type": "application/vnd.api+json",
      Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: "profile",
        attributes: {
          ...(email ? { email } : {}),
          ...(normalizedPhone ? { phone_number: normalizedPhone } : {}),
          properties: profileProperties,
        },
      },
    }),
  });

  if (!importRes.ok) {
    const errBody = await importRes.text();
    console.error("Klaviyo profile-import failed:", importRes.status, errBody);
    // Continue — we still want to subscribe them even if property upsert failed
  }

  // Step 2: Subscribe profile to the list
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
                  ...(email ? { email } : {}),
                  ...(normalizedPhone ? { phone_number: normalizedPhone } : {}),
                  subscriptions: {
                    ...(email ? { email: { marketing: { consent: "SUBSCRIBED" } } } : {}),
                    ...(normalizedPhone
                      ? {
                          sms: {
                            marketing: { consent: "SUBSCRIBED" },
                            transactional: { consent: "SUBSCRIBED" },
                          },
                        }
                      : {}),
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
    console.error("Klaviyo subscribe failed:", subscribeRes.status, errBody);
    return NextResponse.json({ error: `Klaviyo error ${subscribeRes.status}` }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
