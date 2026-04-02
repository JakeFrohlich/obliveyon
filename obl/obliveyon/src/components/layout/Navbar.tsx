"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [cartCount] = useState(0);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10"
      style={{
        height: "56px",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Left — Shop + Cart */}
      <div className="flex items-center gap-8">
        <Link
          href="/shop"
          className="text-[11px] tracking-[0.5em] uppercase text-white hover:text-white/60 transition-colors duration-300"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 400 }}
        >
          Shop
        </Link>

        <button
          className="relative flex items-center gap-2 text-[11px] tracking-[0.5em] uppercase text-white hover:text-white/60 transition-colors duration-300 cursor-pointer"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 400 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
          Cart
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

      {/* Center — Logo */}
      <Link
        href="/"
        className="absolute left-1/2 -translate-x-1/2 text-white hover:text-white/70 transition-colors duration-300"
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
    </nav>
  );
}
