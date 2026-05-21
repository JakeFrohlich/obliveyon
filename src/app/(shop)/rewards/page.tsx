"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { RANKS, type Rank } from "@/lib/ranks";

type RankResponse = {
  pieces: number;
  current: Rank;
  next: Rank | null;
  progress: number;
};

export default function RewardsPage() {
  const { status } = useSession();
  const [rankData, setRankData] = useState<RankResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRank = useCallback(async () => {
    try {
      const res = await fetch("/api/rank", { cache: "no-store" });
      if (res.ok) setRankData(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }
    loadRank().finally(() => setLoading(false));
  }, [status, loadRank]);

  const pieces = rankData?.pieces ?? 0;
  const currentTier = rankData?.current.tier ?? 0;

  return (
    <div className="min-h-screen" style={{ background: "#000000" }}>
      <div
        className="w-full mx-auto px-6 sm:px-10 pb-24"
        style={{ paddingTop: "140px", maxWidth: "960px" }}
      >
        {/* Header */}
        <div className="text-center mb-14">
          <p
            className="text-[10px] tracking-[0.55em] uppercase text-white/40 mb-4"
            style={{ fontFamily: "var(--font-medieval)" }}
          >
            The Order
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl tracking-[0.2em] uppercase text-white"
            style={{
              fontFamily: "var(--font-gothic)",
              fontWeight: 300,
              textShadow: "0 0 40px rgba(255,255,255,0.08)",
            }}
          >
            Ranks &amp; Rewards
          </h1>
          <p
            className="text-sm sm:text-base text-white/55 italic max-w-xl mx-auto mt-6"
            style={{ fontFamily: "var(--font-gothic)", fontWeight: 300, lineHeight: 1.7 }}
          >
            Every piece you carry deepens your standing. The more you wear, the
            more is given in return.
          </p>
          <div
            className="h-px mx-auto mt-10"
            style={{ background: "rgba(255,255,255,0.08)", maxWidth: "440px" }}
          />
        </div>

        {/* Current standing summary if signed in */}
        {!loading && rankData && status === "authenticated" && (
          <div
            className="mb-12 px-6 sm:px-8 py-6 sm:py-7 text-center"
            style={{
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.025)",
              boxShadow: "0 0 40px rgba(255,255,255,0.04)",
            }}
          >
            <p
              className="text-[10px] tracking-[0.5em] uppercase text-white/40 mb-3"
              style={{ fontFamily: "var(--font-medieval)" }}
            >
              Your Standing
            </p>
            <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
              <span style={{ fontSize: "44px", lineHeight: 1 }}>{rankData.current.emoji}</span>
              <span
                className="text-2xl sm:text-3xl tracking-[0.08em] uppercase text-white"
                style={{ fontFamily: "var(--font-gothic)", fontWeight: 300 }}
              >
                {rankData.current.title}
              </span>
            </div>
            <p
              className="text-[11px] tracking-[0.3em] uppercase text-white/55"
              style={{ fontFamily: "var(--font-medieval)" }}
            >
              {pieces} {pieces === 1 ? "piece" : "pieces"} acquired
              {rankData.next &&
                ` · ${rankData.next.threshold - pieces} until ${rankData.next.title}`}
            </p>
          </div>
        )}

        {/* Ladder */}
        <div className="flex flex-col gap-3">
          {RANKS.map((r) => {
            const reached = pieces >= r.threshold;
            const isCurrent = currentTier === r.tier;
            return (
              <div
                key={r.tier}
                className="relative grid grid-cols-[auto_1fr_auto] items-center gap-6 px-6 sm:px-8 py-6 transition-all duration-300"
                style={{
                  border: isCurrent
                    ? "1px solid rgba(255,255,255,0.32)"
                    : "1px solid rgba(255,255,255,0.06)",
                  background: isCurrent ? "rgba(255,255,255,0.03)" : "transparent",
                  opacity: reached || status !== "authenticated" ? 1 : 0.45,
                  boxShadow: isCurrent ? "0 0 30px rgba(255,255,255,0.06)" : "none",
                }}
              >
                <span
                  style={{
                    fontSize: "44px",
                    lineHeight: 1,
                    filter: isCurrent ? "drop-shadow(0 0 14px rgba(255,255,255,0.25))" : "none",
                  }}
                >
                  {r.emoji}
                </span>
                <div className="min-w-0">
                  <p
                    className="text-[10px] tracking-[0.45em] uppercase text-white/40 mb-1"
                    style={{ fontFamily: "var(--font-medieval)" }}
                  >
                    Rank {r.tier}
                  </p>
                  <h2
                    className="text-xl sm:text-2xl tracking-[0.1em] uppercase text-white mb-2"
                    style={{ fontFamily: "var(--font-gothic)", fontWeight: 300 }}
                  >
                    {r.title}
                  </h2>
                  <p
                    className="text-sm text-white/70"
                    style={{ fontFamily: "var(--font-medieval)", letterSpacing: "0.04em" }}
                  >
                    {r.perk}
                  </p>
                </div>
                <p
                  className="text-right text-[11px] tracking-[0.3em] uppercase text-white/55 whitespace-nowrap"
                  style={{ fontFamily: "var(--font-medieval)" }}
                >
                  {r.threshold} {r.threshold === 1 ? "piece" : "pieces"}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <Link
            href="/shop"
            className="px-7 py-3.5 text-[11px] tracking-[0.45em] uppercase transition-all duration-300"
            style={{
              fontFamily: "var(--font-medieval)",
              background: "rgba(255,255,255,0.94)",
              color: "#080808",
              boxShadow: "0 0 24px rgba(255,255,255,0.08)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.94)"; }}
          >
            Shop the Collection
          </Link>
          {status === "authenticated" && (
            <Link
              href="/profile"
              className="px-7 py-3.5 text-[11px] tracking-[0.45em] uppercase text-white/80 hover:text-white transition-colors duration-300"
              style={{
                fontFamily: "var(--font-medieval)",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Back to Profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
