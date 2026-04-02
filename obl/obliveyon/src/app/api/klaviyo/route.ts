import { NextRequest, NextResponse } from "next/server";

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY;
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID;

export async function POST(req: NextRequest) {
  if (!KLAVIYO_API_KEY || !KLAVIYO_LIST_ID) {
    return NextResponse.json({ error: "Klaviyo not configured" }, { status: 500 });
  }

  let email: string, phone: string | undefined;
  try {
    ({ email, phone } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

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

  // Step 1: Subscribe profile to the list (creates or updates profile + subscribes)
  const subscribeRes = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
    method: "POST",
    headers: {
      accept: "application/vnd.api+json",
      revision: "2024-10-15",
      "content-type": "application/vnd.api+json",
      Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: "profile-subscription-bulk-create-job",
        attributes: {
          list_id: KLAVIYO_LIST_ID,
          subscriptions: [
            {
              channels: {
                email: ["MARKETING"],
                ...(normalizedPhone ? { sms: ["MARKETING"] } : {}),
              },
              email,
              ...(normalizedPhone ? { phone_number: normalizedPhone } : {}),
            },
          ],
        },
      },
    }),
  });

  if (!subscribeRes.ok) {
    const errBody = await subscribeRes.text();
    console.error("Klaviyo subscribe error:", subscribeRes.status, errBody);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
