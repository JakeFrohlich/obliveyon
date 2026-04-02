import { NextResponse } from "next/server";

// Stripe webhooks are no longer used — payments handled by Shopify.
export async function POST() {
  return NextResponse.json({ received: true });
}
