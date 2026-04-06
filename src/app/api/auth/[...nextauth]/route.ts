import { handlers } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

const { GET, POST: authPOST } = handlers;
export { GET };

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // 10 login attempts per 15 minutes per IP
  const result = rateLimit(`auth:${ip}`, 10, 15 * 60 * 1000);

  if (!result.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  return authPOST(req);
}
