import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Orders managed via Shopify" }, { status: 410 });
}

export async function PUT() {
  return NextResponse.json({ error: "Orders managed via Shopify" }, { status: 410 });
}
