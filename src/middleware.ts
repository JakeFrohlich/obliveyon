import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DROP_DATE = new Date("2026-05-21T00:00:00Z");

const ALLOWED_PATHS = [
  "/signup",
  "/login",
  "/api/auth",
  "/api/klaviyo",
  "/_next",
  "/favicon",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static assets and allowed paths always
  if (ALLOWED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // If drop date has passed, allow everything
  if (Date.now() >= DROP_DATE.getTime()) {
    return NextResponse.next();
  }

  // Otherwise redirect to signup
  const url = req.nextUrl.clone();
  url.pathname = "/signup";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
