"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/use-cart";
import CartSidebar from "@/components/cart/CartSidebar";

function FreeShippingBadge() {
  return (
    <>
      <style>{`
        @keyframes wumpus-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes wumpus-truck {
          0%   { transform: translateX(0px); }
          50%  { transform: translateX(2px); }
          100% { transform: translateX(0px); }
        }
        .wumpus-text {
          background: linear-gradient(
            90deg,
            #5865F2 0%,
            #EB459E 28%,
            #FEE75C 56%,
            #57F287 84%,
            #5865F2 100%
          );
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: wumpus-shift 5s ease-in-out infinite;
        }
        .wumpus-truck {
          animation: wumpus-truck 2s ease-in-out infinite;
        }
      `}</style>
      <div
        className="hidden md:flex items-center gap-1.5"
        style={{
          border: "1px solid rgba(255,255,255,0.2)",
          padding: "4px 14px",
          cursor: "default",
          userSelect: "none",
        }}
        aria-label="Free US Shipping"
        title="Free US Shipping on every order"
      >
        <svg
          className="wumpus-truck"
          width="13"
          height="11"
          viewBox="0 0 24 20"
          fill="none"
          stroke="url(#ship-grad)"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <defs>
            <linearGradient id="ship-grad" x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#5865F2" />
              <stop offset="50%" stopColor="#EB459E" />
              <stop offset="100%" stopColor="#57F287" />
            </linearGradient>
          </defs>
          <rect x="1" y="5" width="13" height="9" rx="0.5" />
          <path d="M14 8h4l3 3v3h-7z" />
          <circle cx="6" cy="16" r="2" />
          <circle cx="17" cy="16" r="2" />
          <path d="M0 8h1.5M0 11h2.5" opacity="0.5" />
        </svg>
        <span
          className="wumpus-text"
          style={{
            fontFamily: "var(--font-medieval)",
            fontWeight: 400,
            fontSize: "11px",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
          }}
        >
          Free US Shipping
        </span>
      </div>
    </>
  );
}

function SocialCrossfade() {
  const [showDiscord, setShowDiscord] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setShowDiscord((v) => !v), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-5 h-5" style={{ flexShrink: 0 }}>
      {/* Discord icon */}
      <a
        href="https://discord.gg/obliveyon"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Discord"
        className="absolute inset-0 flex items-center justify-center text-white/70 hover:text-white transition-opacity duration-700"
        style={{ opacity: showDiscord ? 1 : 0, pointerEvents: showDiscord ? "auto" : "none" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.055a19.928 19.928 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      </a>
      {/* Instagram icon */}
      <a
        href="https://www.instagram.com/obliveyon/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="absolute inset-0 flex items-center justify-center text-white/70 hover:text-white transition-opacity duration-700"
        style={{ opacity: showDiscord ? 0 : 1, pointerEvents: showDiscord ? "none" : "auto" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      </a>
    </div>
  );
}

const borderStyle = {
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "4px 14px",
};

export default function Navbar() {
  const { totalItems } = useCart();
  const { status } = useSession();
  const pathname = usePathname();
  const [cartOpen, setCartOpen] = useState(false);
  const [prevTotal, setPrevTotal] = useState(totalItems);

  useEffect(() => {
    if (totalItems > prevTotal) setCartOpen(true);
    setPrevTotal(totalItems);
  }, [totalItems, prevTotal]);

  const isAuthed = status === "authenticated";
  // Pages where "← Return" should go to /shop instead of /
  const SHOP_SUBPAGES = ["/faq", "/privacy", "/profile", "/settings", "/account"];
  const goesToShop =
    !!pathname && (SHOP_SUBPAGES.some((p) => pathname.startsWith(p)) || pathname.startsWith("/product"));
  const returnHref = goesToShop ? "/shop" : "/";
  const returnLabel = goesToShop ? "← Collection" : "← Return";

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
      {/* Left — Return + Profile + Settings */}
      <div className="flex items-center gap-4">
        <Link
          href={returnHref}
          className="text-[11px] tracking-[0.5em] uppercase text-white/40 hover:text-white transition-colors duration-300"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
        >
          {returnLabel}
        </Link>
        <Link
          href={isAuthed ? "/profile" : "/account"}
          aria-label={isAuthed ? "Profile" : "Sign in or sign up"}
          className="flex items-center justify-center text-white/70 hover:text-white transition-colors duration-300"
          style={{ ...borderStyle, padding: "6px 10px" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
          </svg>
        </Link>
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

      {/* Right — Free Shipping badge + Social + Cart */}
      <div className="flex items-center gap-4">
        <FreeShippingBadge />
        <div className="flex items-center justify-center" style={borderStyle}>
          <SocialCrossfade />
        </div>

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

      </div>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </nav>
  );
}
