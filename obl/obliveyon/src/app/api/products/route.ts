import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Products managed via Shopify" }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({ error: "Products managed via Shopify" }, { status: 410 });
}
