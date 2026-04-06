import { NextResponse } from "next/server";

// Checkout is handled client-side via Shopify cart URL redirect.
// This route is no longer used.
export async function POST() {
  return NextResponse.json({ error: "Use Shopify checkout" }, { status: 410 });
}
