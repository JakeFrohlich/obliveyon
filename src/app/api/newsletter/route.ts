import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().max(254).refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
    message: "Valid email is required",
  }),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // 5 signups per hour per IP
  const rl = rateLimit(`newsletter:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    const { email } = parsed.data;

    // Forward to Klaviyo if configured
    const klaviyoKey = process.env.KLAVIYO_PRIVATE_API_KEY;
    const klaviyoList = process.env.KLAVIYO_LIST_ID;

    if (klaviyoKey && klaviyoList) {
      const res = await fetch(`https://a.klaviyo.com/api/v2/list/${klaviyoList}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": klaviyoKey,
        },
        body: JSON.stringify({ profiles: [{ email }] }),
      });
      if (!res.ok) {
        return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
