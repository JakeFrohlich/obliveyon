import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

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
