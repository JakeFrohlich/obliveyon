"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getRank, getNextRank } from "@/lib/ranks";

export default function MobileRankCard() {
  const { status } = useSession();
  const [pieces, setPieces] = useState(0);

  useEffect(() => {
    if (status !== "authenticated") {
      if (status === "unauthenticated") setPieces(0);
      return;
    }
    let cancelled = false;
    fetch("/api/rank", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.pieces === "number") {
          setPieces(data.pieces);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [status]);

  const current = getRank(pieces);
  const next = getNextRank(current);

  return (
    <div
      className="sm:hidden w-full px-6 pt-10"
      style={{ background: "#000000" }}
    >
      <div
        className="flex items-center justify-center gap-6"
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "14px 16px",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        {/* Current rank */}
        <div className="flex flex-col items-start flex-1 min-w-0">
          <span
            className="text-[9px] uppercase"
            style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.5)", letterSpacing: "0.3em" }}
          >
            Rank {current.tier}
          </span>
          <span
            className="text-[13px] uppercase text-white leading-tight flex items-center gap-1.5 mt-0.5"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, letterSpacing: "0.1em" }}
          >
            <span style={{ fontSize: "14px" }}>{current.emoji}</span>
            <span className="truncate">{current.title}</span>
          </span>
        </div>

        {/* Divider */}
        <div className="h-8 w-px" style={{ background: "rgba(255,255,255,0.1)" }} />

        {/* Next rank */}
        <div className="flex flex-col items-end flex-1 min-w-0">
          {next ? (
            <>
              <span
                className="text-[9px] uppercase"
                style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.5)", letterSpacing: "0.3em" }}
              >
                Next
              </span>
              <span
                className="text-[13px] uppercase text-white leading-tight flex items-center gap-1.5 mt-0.5 text-right"
                style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, letterSpacing: "0.1em" }}
              >
                <span style={{ fontSize: "14px" }}>{next.emoji}</span>
                <span className="truncate">{next.title}</span>
              </span>
            </>
          ) : (
            <span
              className="text-[11px] text-white uppercase"
              style={{ fontFamily: "var(--font-medieval)", letterSpacing: "0.18em" }}
            >
              Legendary
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
