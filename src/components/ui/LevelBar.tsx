"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { RANKS, getRank, getNextRank, getProgress } from "@/lib/ranks";

export default function LevelBar() {
  const { status } = useSession();
  const [pieces, setPieces] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [leveled] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      if (status === "unauthenticated") setPieces(0);
      return;
    }

    let cancelled = false;
    const load = () => {
      fetch("/api/rank", { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!cancelled && data && typeof data.pieces === "number") {
            setPieces(data.pieces);
          }
        })
        .catch(() => {});
    };

    load();

    const onFocus = () => load();
    window.addEventListener("focus", onFocus);

    const interval = setInterval(() => {
      if (!document.hidden) load();
    }, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [status]);

  const current = getRank(pieces);
  const next = getNextRank(current);
  const progress = getProgress(pieces, current, next);

  void RANKS;

  return (
    <div
      className="hidden sm:block fixed top-[56px] left-0 right-0 z-40"
      style={{
        background: "rgba(0,0,0,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: collapsed ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(255,255,255,0.08)",
        transition: "border-color 0.4s ease",
      }}
    >
      {/* Animated body — height and opacity transition together */}
      <div
        style={{
          maxHeight: collapsed ? "0px" : "240px",
          opacity: collapsed ? 0 : 1,
          overflow: "hidden",
          transition: "max-height 0.45s ease, opacity 0.35s ease",
        }}
      >
        <div className="px-4 sm:px-10 py-4 relative">
          {/* Ornate top border line */}
          <div className="absolute top-0 left-0 right-0 flex items-center px-4">
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.04)" }} />
            <svg width="8" height="8" viewBox="0 0 8 8" className="mx-2">
              <polygon points="4,0 8,4 4,8 0,4" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />
            </svg>
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>

          <div className="flex items-center gap-4 justify-center w-full">
            {/* Current rank */}
            <div className="flex flex-col items-start min-w-[120px] sm:min-w-[160px]">
              <span
                className="text-[10px] tracking-[0.4em] uppercase"
                style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.5)", letterSpacing: "0.3em" }}
              >
                Rank {current.tier}
              </span>
              <span
                className="text-sm sm:text-base tracking-[0.15em] uppercase text-white leading-tight flex items-center gap-2"
                style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, letterSpacing: "0.12em" }}
              >
                <span style={{ fontSize: "14px" }}>{current.emoji}</span>
                {current.title}
              </span>
            </div>

            {/* XP Bar */}
            <div className="w-[320px] sm:w-[420px] flex flex-col gap-2">
              <div className="relative w-full h-[5px]" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div
                  className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${progress}%`,
                    background: leveled ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.85)",
                    boxShadow: leveled ? "0 0 16px rgba(255,255,255,0.9)" : "0 0 8px rgba(255,255,255,0.5)",
                  }}
                />
                {[25, 50, 75].map((tick) => (
                  <div
                    key={tick}
                    className="absolute top-0 h-full w-px"
                    style={{ left: `${tick}%`, background: "rgba(255,255,255,0.15)" }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center" style={{ position: "relative", height: "1.5em" }}>
                {status === "unauthenticated" ? (
                  <>
                    <style>{`
                      @keyframes lb-fade-a {
                        0%,40%   { opacity: 1; }
                        55%,95%  { opacity: 0; }
                        100%     { opacity: 1; }
                      }
                      @keyframes lb-fade-b {
                        0%,40%   { opacity: 0; }
                        55%,95%  { opacity: 1; }
                        100%     { opacity: 0; }
                      }
                    `}</style>
                    <span
                      className="absolute text-sm sm:text-base text-white"
                      style={{ fontFamily: "var(--font-medieval)", letterSpacing: "0.08em", animation: "lb-fade-a 5s ease-in-out infinite" }}
                    >
                      {next ? `${next.threshold - pieces} ${next.threshold - pieces === 1 ? "piece" : "pieces"} until next rank` : "Max Rank Achieved"}
                    </span>
                    <span
                      className="absolute text-sm sm:text-base text-white/70"
                      style={{ fontFamily: "var(--font-medieval)", letterSpacing: "0.08em", animation: "lb-fade-b 5s ease-in-out infinite" }}
                    >
                      Sign in to track your rank
                    </span>
                  </>
                ) : (
                  <span
                    className="text-sm sm:text-base text-white"
                    style={{ fontFamily: "var(--font-medieval)", letterSpacing: "0.08em" }}
                  >
                    {next ? `${next.threshold - pieces} ${next.threshold - pieces === 1 ? "piece" : "pieces"} until next rank` : "Max Rank Achieved"}
                  </span>
                )}
              </div>
            </div>

            {/* Next rank */}
            <div className="flex flex-col items-end min-w-[120px] sm:min-w-[160px]">
              {next ? (
                <>
                  <span
                    className="text-[10px] tracking-[0.3em] uppercase"
                    style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.5)" }}
                  >
                    Next
                  </span>
                  <span
                    className="text-sm sm:text-base text-white leading-tight text-right flex items-center gap-2"
                    style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, letterSpacing: "0.12em" }}
                  >
                    <span style={{ fontSize: "14px" }}>{next.emoji}</span>
                    {next.title}
                  </span>
                </>
              ) : (
                <span
                  className="text-[11px] text-white"
                  style={{ fontFamily: "var(--font-medieval)", letterSpacing: "0.08em" }}
                >
                  Legendary
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Collapse/expand toggle — sticks below the bar, flips direction */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        aria-label={collapsed ? "Show rank" : "Hide rank"}
        className="absolute left-1/2 -translate-x-1/2 cursor-pointer transition-all duration-300"
        style={{
          bottom: "-20px",
          width: "44px",
          height: "20px",
          background: "rgba(0,0,0,0.9)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderTop: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(12px)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
      >
        <svg
          width="14"
          height="8"
          viewBox="0 0 14 8"
          fill="none"
          style={{
            color: "rgba(255,255,255,0.55)",
            transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.4s ease",
          }}
        >
          <polyline points="1 1 7 7 13 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
