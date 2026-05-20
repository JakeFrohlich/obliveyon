"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "#000000", paddingTop: "120px", paddingBottom: "80px" }}
    >
      {/* Top flourish */}
      <div className="flex items-center gap-3 mb-6 opacity-70">
        <div className="h-px w-12 sm:w-20" style={{ background: "rgba(255,255,255,0.18)" }} />
        <svg width="10" height="10" viewBox="0 0 10 10">
          <polygon points="5,0 10,5 5,10 0,5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
        </svg>
        <div className="h-px w-12 sm:w-20" style={{ background: "rgba(255,255,255,0.18)" }} />
      </div>

      <p
        className="text-[10px] sm:text-[11px] tracking-[0.6em] uppercase text-white/30 mb-5"
        style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
      >
        Something Broke
      </p>

      <h1
        className="text-4xl sm:text-6xl tracking-[0.04em] uppercase text-white leading-none mb-4"
        style={{
          fontFamily: "var(--font-gothic)",
          fontWeight: 300,
          textShadow: "0 0 30px rgba(255,255,255,0.12)",
        }}
      >
        A Disturbance
        <br />
        in the Realm
      </h1>

      <p
        className="text-sm text-white/55 max-w-md mb-10 leading-relaxed"
        style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
      >
        An unexpected error has occurred. Try again, or return to safer ground.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={reset}
          className="inline-block px-10 py-3.5 text-xs tracking-[0.5em] uppercase transition-all duration-300 cursor-pointer"
          style={{
            fontFamily: "var(--font-medieval)",
            fontWeight: 400,
            background: "rgba(255,255,255,0.92)",
            color: "#060504",
            border: "1px solid rgba(255,255,255,0.9)",
          }}
        >
          Try Again
        </button>
        <a
          href="/"
          className="inline-block px-10 py-3.5 text-xs tracking-[0.5em] uppercase transition-all duration-300"
          style={{
            fontFamily: "var(--font-medieval)",
            fontWeight: 400,
            background: "transparent",
            color: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(255,255,255,0.4)",
          }}
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
