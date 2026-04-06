"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import CartSidebar from "./CartSidebar";

export default function CartButton() {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();
  const [prevTotal, setPrevTotal] = useState(totalItems);

  // Auto-open sidebar whenever item count increases
  useEffect(() => {
    if (totalItems > prevTotal) {
      setCartOpen(true);
    }
    setPrevTotal(totalItems);
  }, [totalItems, prevTotal]);

  return (
    <>
      <button
        onClick={() => setCartOpen(true)}
        className="fixed top-6 right-6 z-40 p-2 transition-colors duration-300 cursor-pointer"
        style={{ color: "rgba(255,255,255,0.7)" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,1)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
        aria-label="Open cart"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {totalItems > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px]"
            style={{
              fontFamily: "var(--font-medieval)",
              fontWeight: 400,
              background: "rgba(255,255,255,0.9)",
              color: "#060504",
            }}
          >
            {totalItems}
          </span>
        )}
      </button>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
