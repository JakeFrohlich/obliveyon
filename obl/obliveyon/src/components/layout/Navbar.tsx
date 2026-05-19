"use client";

import Link from "next/link";
import { useState } from "react";

// Chip border used by Sign In / Sign Up / Shop / Cart.
// Smaller padding on mobile, expanded by browser at the inline tracking utility.
const chipBorder = {
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "3px 10px",
};

export default function Navbar() {
  const [cartCount] = useState(0);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 sm:px-10"
      style={{
        height: "56px",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Left — Return (desktop) + Sign In + Join */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href="/"
          className="hidden sm:inline-block text-[11px] tracking-[0.5em] uppercase text-white/40 hover:text-white transition-colors duration-300"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
        >
          ← Return
        </Link>
        <Link
          href="/login"
          className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.5em] uppercase text-white/70 hover:text-white transition-colors duration-300"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 300, ...chipBorder }}
        >
          Sign In
        </Link>
        <Link
          href="/create-account"
          className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.5em] uppercase text-white hover:text-white/60 transition-colors duration-300"
          style={{
            fontFamily: "var(--font-medieval)",
            fontWeight: 400,
            ...chipBorder,
            border: "1px solid rgba(255,255,255,0.5)",
          }}
        >
          Sign Up
        </Link>
      </div>

      {/* Center — Logo (hidden on small phones to prevent overlap) */}
      <Link
        href="/"
        className="hidden md:block absolute left-1/2 -translate-x-1/2 text-white hover:text-white/70 transition-colors duration-300"
        style={{
          fontFamily: "var(--font-gothic)",
          fontWeight: 400,
          fontSize: "1.1rem",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          textShadow: "0 0 30px rgba(255,255,255,0.15)",
        }}
      >
        Obliveyon
      </Link>

      {/* Right — Shop + Cart */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href="/shop"
          className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.5em] uppercase text-white/70 hover:text-white transition-colors duration-300"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, ...chipBorder }}
        >
          Shop
        </Link>

        <button
          className="relative flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.5em] uppercase text-white/70 hover:text-white transition-colors duration-300 cursor-pointer"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, ...chipBorder }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M1 1h2l2.5 8h7L14 4H4"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="7" cy="13.5" r="0.8" fill="currentColor" />
            <circle cx="11" cy="13.5" r="0.8" fill="currentColor" />
          </svg>
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <span
              className="absolute -top-1 -right-2 w-4 h-4 flex items-center justify-center text-[9px]"
              style={{
                fontFamily: "var(--font-medieval)",
                background: "rgba(255,255,255,0.9)",
                color: "#000",
              }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>

    </nav>
  );
}
