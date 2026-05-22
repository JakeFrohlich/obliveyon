import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DROP_DATE = new Date("2026-05-22T20:00:00Z"); // 3pm EST (UTC-5)

const ALLOWED_PATHS = [
  "/signup",
  "/login",
  "/api/auth",
  "/api/klaviyo",
  "/_next",
  "/favicon",
];

// Admin pages are local-dev only. Always return 404 in production.
const ADMIN_PATHS = ["/admin", "/api/admin"];

const PREVIEW_COOKIE = "obliveyon_preview";
const PREVIEW_KEY = process.env.PREVIEW_KEY;

// Attribution cookie: stores the video/ad ref for up to 30 days
const REF_COOKIE = "obliveyon_ref";
// Ref values: alphanumeric + hyphens/underscores, max 64 chars
const REF_RE = /^[a-zA-Z0-9_-]{1,64}$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin pages: 404 in production, allow through in dev
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    if (process.env.NODE_ENV === "production") {
      return new NextResponse(null, { status: 404 });
    }
    return NextResponse.next();
  }

  // Capture ?ref=VIDEO_ID on any request and store it as a cookie
  const refParam = req.nextUrl.searchParams.get("ref");
  let refToSet: string | null = null;
  if (refParam && REF_RE.test(refParam)) {
    refToSet = refParam;
  }

  // Allow static assets and always-on paths
  if (ALLOWED_PATHS.some((p) => pathname.startsWith(p))) {
    const res = NextResponse.next();
    if (refToSet) {
      res.cookies.set(REF_COOKIE, refToSet, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
    }
    return res;
  }

  // If drop date has passed, allow everything
  if (Date.now() >= DROP_DATE.getTime()) {
    const res = NextResponse.next();
    if (refToSet) {
      res.cookies.set(REF_COOKIE, refToSet, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
    }
    return res;
  }

  // Check for preview cookie (already unlocked) — only if key is configured
  if (PREVIEW_KEY && req.cookies.get(PREVIEW_COOKIE)?.value === PREVIEW_KEY) {
    const res = NextResponse.next();
    if (refToSet) {
      res.cookies.set(REF_COOKIE, refToSet, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
    }
    return res;
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
    if (refToSet) {
      res.cookies.set(REF_COOKIE, refToSet, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
    }
    return res;
  }

  // Redirect to /signup — forward the ref so Klaviyo can record it on signup
  const url = req.nextUrl.clone();
  url.pathname = "/signup";
  if (refToSet || req.cookies.get(REF_COOKIE)?.value) {
    url.searchParams.set("ref", refToSet ?? req.cookies.get(REF_COOKIE)!.value);
  }
  const res = NextResponse.redirect(url);
  if (refToSet) {
    res.cookies.set(REF_COOKIE, refToSet, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
