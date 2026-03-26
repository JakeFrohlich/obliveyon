export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/profile/:path*",
    "/admin/:path*",
    "/checkout/:path*",
    "/api/orders/:path*",
    "/api/checkout/:path*",
  ],
};
