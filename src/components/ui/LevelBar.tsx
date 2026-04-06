"use client";

import { useEffect, useState } from "react";

const RANKS = [
  { tier: 1, title: "The Forgotten",  threshold: 0,   perk: "Early access to drops",                  discount: 0  },
  { tier: 2, title: "The Wanderer",   threshold: 100,  perk: "5% off all orders",                       discount: 5  },
  { tier: 3, title: "The Initiate",   threshold: 250,  perk: "10% off + free shipping",                 discount: 10 },
  { tier: 4, title: "The Marked",     threshold: 500,  perk: "15% off + exclusive colorways",           discount: 15 },
  { tier: 5, title: "The Obliveyon",  threshold: 1000, perk: "20% off + limited pieces + name in lore", discount: 20 },
];

function getRank(spent: number) {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (spent >= rank.threshold) current = rank;
  }
  return current;
}

function getNextRank(current: typeof RANKS[0]) {
  return RANKS.find((r) => r.tier === current.tier + 1) || null;
}

function getProgress(spent: number, current: typeof RANKS[0], next: typeof RANKS[0] | null) {
  if (!next) return 100;
  const range = next.threshold - current.threshold;
  const progress = spent - current.threshold;
  return Math.min(100, Math.round((progress / range) * 100));
}

export default function LevelBar() {
  const [spent, setSpent] = useState(0);
  const [visible, setVisible] = useState(true);
  const [leveled, setLeveled] = useState(false);

  // Load from localStorage — will be replaced with real Shopify data later
  useEffect(() => {
    const stored = localStorage.getItem("obliveyon-spent");
    if (stored) setSpent(parseFloat(stored));
  }, []);

  const current = getRank(spent);
  const next = getNextRank(current);
  const progress = getProgress(spent, current, next);

  if (!visible) return null;

  return (
    <div
      className="fixed top-[56px] left-0 right-0 z-40 px-4 sm:px-10 py-4"
      style={{
        background: "rgba(0,0,0,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
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
            className="text-sm sm:text-base tracking-[0.15em] uppercase text-white leading-tight"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, letterSpacing: "0.12em" }}
          >
            {current.title}
          </span>
        </div>

        {/* XP Bar */}
        <div className="w-[320px] sm:w-[420px] flex flex-col gap-2">
          {/* Bar track */}
          <div
            className="relative w-full h-[5px]"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            {/* Fill */}
            <div
              className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out"
              style={{
                width: `${progress}%`,
                background: leveled ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.85)",
                boxShadow: leveled ? "0 0 16px rgba(255,255,255,0.9)" : "0 0 8px rgba(255,255,255,0.5)",
              }}
            />
            {/* Tick marks every 25% */}
            {[25, 50, 75].map((tick) => (
              <div
                key={tick}
                className="absolute top-0 h-full w-px"
                style={{ left: `${tick}%`, background: "rgba(255,255,255,0.15)" }}
              />
            ))}
          </div>

          {/* Progress label */}
          <div className="flex items-center justify-center">
            <span
              className="text-sm sm:text-base text-white"
              style={{ fontFamily: "var(--font-medieval)", letterSpacing: "0.08em" }}
            >
              {next ? `$${next.threshold - spent} until next rank` : "Max Rank Achieved"}
            </span>
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
                className="text-sm sm:text-base text-white leading-tight text-right"
                style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, letterSpacing: "0.12em" }}
              >
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

        {/* Dismiss */}
        <button
          onClick={() => setVisible(false)}
          className="ml-2 cursor-pointer opacity-20 hover:opacity-60 transition-opacity"
          style={{ color: "white" }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
            <line x1="1" y1="1" x2="9" y2="9" />
            <line x1="9" y1="1" x2="1" y2="9" />
          </svg>
        </button>
      </div>
    </div>
  );
}
