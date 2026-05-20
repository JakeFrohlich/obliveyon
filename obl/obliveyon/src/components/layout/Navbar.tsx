"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import CartSidebar from "@/components/cart/CartSidebar";

// Chip border used by Shop / Cart.
const chipBorder = {
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "3px 10px",
};

export default function Navbar() {
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 sm:px-10"
        style={{
          height: "56px",
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {/* Left — Return only (Sign In / Sign Up removed for drop launch — accounts disabled) */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="text-[10px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.5em] uppercase text-white/55 hover:text-white transition-colors duration-300"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
          >
            ← Return
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

        {/* Right — Free shipping pill (lg+) + Shop + Cart */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Free US Shipping pill — sits right in the right group, breathes gently. */}
          <span
            className="hidden lg:inline-flex items-center gap-2 mr-2 px-4 py-1.5 nav-shipping-breathe whitespace-nowrap"
            style={{
              fontFamily: "var(--font-medieval)",
              fontWeight: 500,
              fontSize: "12px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.95)",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <svg width="6" height="6" viewBox="0 0 6 6" className="opacity-80">
              <polygon points="3,0 6,3 3,6 0,3" fill="currentColor" />
            </svg>
            Free US Shipping
            <svg width="6" height="6" viewBox="0 0 6 6" className="opacity-80">
              <polygon points="3,0 6,3 3,6 0,3" fill="currentColor" />
            </svg>
          </span>

          <Link
            href="/shop"
            className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.5em] uppercase text-white/70 hover:text-white transition-colors duration-300"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, ...chipBorder }}
          >
            Shop
          </Link>

          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.5em] uppercase text-white/70 hover:text-white transition-colors duration-300 cursor-pointer"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, ...chipBorder }}
            aria-label="Open cart"
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
            {totalItems > 0 && (
              <span
                className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[9px] tabular-nums"
                style={{
                  fontFamily: "var(--font-medieval)",
                  fontWeight: 500,
                  background: "rgba(255,255,255,0.95)",
                  color: "#000",
                  borderRadius: "9px",
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <style jsx>{`
          @keyframes navShippingBreathe {
            0%, 100% {
              box-shadow: 0 0 8px rgba(255, 255, 255, 0.04);
              background: rgba(255, 255, 255, 0.05);
              border-color: rgba(255, 255, 255, 0.15);
            }
            50% {
              box-shadow: 0 0 20px rgba(255, 255, 255, 0.22), 0 0 40px rgba(255, 255, 255, 0.08);
              background: rgba(255, 255, 255, 0.1);
              border-color: rgba(255, 255, 255, 0.4);
            }
          }
          .nav-shipping-breathe {
            animation: navShippingBreathe 4s ease-in-out infinite;
          }
        `}</style>
      </nav>

      {/* Cart drawer — opens when nav cart icon is clicked */}
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
