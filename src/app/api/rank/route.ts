import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPieceCountForEmail } from "@/lib/shopify";
import { getRank, getNextRank, getProgress } from "@/lib/ranks";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pieces = await getPieceCountForEmail(session.user.email);
  const current = getRank(pieces);
  const next = getNextRank(current);
  const progress = getProgress(pieces, current, next);

  return NextResponse.json({
    pieces,
    current,
    next,
    progress,
  });
}
