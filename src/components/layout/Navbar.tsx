"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import CartSidebar from "@/components/cart/CartSidebar";

const borderStyle = {
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "4px 14px",
};

export default function Navbar() {
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [prevTotal, setPrevTotal] = useState(totalItems);

  useEffect(() => {
    if (totalItems > prevTotal) setCartOpen(true);
    setPrevTotal(totalItems);
  }, [totalItems, prevTotal]);

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
      {/* Left — Return + Sign In + Join */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-[11px] tracking-[0.5em] uppercase text-white/40 hover:text-white transition-colors duration-300"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
        >
          ← Return
        </Link>
        <Link
          href="/login"
          className="text-[11px] tracking-[0.5em] uppercase text-white/70 hover:text-white transition-colors duration-300"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 300, ...borderStyle }}
        >
          Sign In
        </Link>
        <Link
          href="/create-account"
          className="text-[11px] tracking-[0.5em] uppercase text-white hover:text-white/60 transition-colors duration-300"
          style={{
            fontFamily: "var(--font-medieval)",
            fontWeight: 400,
            ...borderStyle,
            border: "1px solid rgba(255,255,255,0.5)",
          }}
        >
          Sign Up
        </Link>
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

      {/* Right — Shop + Cart */}
      <div className="flex items-center gap-4">
        <Link
          href="/shop"
          className="text-[11px] tracking-[0.5em] uppercase text-white/70 hover:text-white transition-colors duration-300"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, ...borderStyle }}
        >
          Shop
        </Link>

        <button
          onClick={() => setCartOpen(true)}
          aria-label="Open cart"
          className="relative flex items-center gap-2 text-[11px] tracking-[0.5em] uppercase text-white/70 hover:text-white transition-colors duration-300 cursor-pointer"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, ...borderStyle }}
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
          Cart
          {totalItems > 0 && (
            <span
              className="absolute -top-1 -right-2 w-4 h-4 flex items-center justify-center text-[9px]"
              style={{
                fontFamily: "var(--font-medieval)",
                background: "rgba(255,255,255,0.9)",
                color: "#000",
              }}
            >
              {totalItems}
            </span>
          )}
        </button>

        <Link
          href="/settings"
          aria-label="Settings"
          className="flex items-center justify-center text-white/70 hover:text-white transition-colors duration-300"
          style={{ ...borderStyle, padding: "6px 10px" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Link>
      </div>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </nav>
  );
}
