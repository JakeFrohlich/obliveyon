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

const PREVIEW_COOKIE = "obliveyon_preview";
const PREVIEW_KEY = process.env.PREVIEW_KEY;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static assets and always-on paths
  if (ALLOWED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // If drop date has passed, allow everything
  if (Date.now() >= DROP_DATE.getTime()) {
    return NextResponse.next();
  }

  // Check for preview cookie (already unlocked)
  if (req.cookies.get(PREVIEW_COOKIE)?.value === PREVIEW_KEY) {
    return NextResponse.next();
  }

  // Check for ?preview=KEY in the URL — set cookie and redirect to clean URL
  const paramKey = req.nextUrl.searchParams.get("preview");
  if (PREVIEW_KEY && paramKey === PREVIEW_KEY) {
    const url = req.nextUrl.clone();
    url.searchParams.delete("preview");
    const res = NextResponse.redirect(url);
    res.cookies.set(PREVIEW_COOKIE, PREVIEW_KEY, {
      httpOnly: true,
      sameSite: "lax",
      // Cookie lasts 7 days — enough for a recruiter session
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  }

  // Otherwise redirect to signup
  const url = req.nextUrl.clone();
  url.pathname = "/signup";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
