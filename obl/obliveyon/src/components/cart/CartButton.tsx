"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/hooks/use-cart";
import CartSidebar from "./CartSidebar";

export default function CartButton() {
  const [cartOpen, setCartOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { totalItems } = useCart();
  const prevTotalRef = useRef(totalItems);

  useEffect(() => {
    if (totalItems > prevTotalRef.current) {
      setCartOpen(true);
    }
    prevTotalRef.current = totalItems;
  }, [totalItems]);

  return (
    <>
      <button
        onClick={() => setCartOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Open cart"
        className="fixed top-5 right-5 z-40 cursor-pointer"
        style={{
          width: "52px",
          height: "52px",
          background: hovered ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.6)",
          transition: "background 0.3s",
          position: "fixed",
        }}
      >
        {/* Ornate corner border — matches collection page style but brighter */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 52 52"
          fill="none"
        >
          {/* Corner accents — brighter than collection page */}
          <line x1="0" y1="0" x2="14" y2="0" stroke={hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)"} strokeWidth="1.2" />
          <line x1="0" y1="0" x2="0" y2="14" stroke={hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)"} strokeWidth="1.2" />
          <line x1="52" y1="0" x2="38" y2="0" stroke={hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)"} strokeWidth="1.2" />
          <line x1="52" y1="0" x2="52" y2="14" stroke={hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)"} strokeWidth="1.2" />
          <line x1="0" y1="52" x2="14" y2="52" stroke={hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)"} strokeWidth="1.2" />
          <line x1="0" y1="52" x2="0" y2="38" stroke={hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)"} strokeWidth="1.2" />
          <line x1="52" y1="52" x2="38" y2="52" stroke={hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)"} strokeWidth="1.2" />
          <line x1="52" y1="52" x2="52" y2="38" stroke={hovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)"} strokeWidth="1.2" />
          {/* Top center diamond */}
          <polygon points="26,0 28,2 26,4 24,2" fill={hovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)"} />
          {/* Bottom center diamond */}
          <polygon points="26,48 28,50 26,52 24,50" fill={hovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)"} />
        </svg>

        {/* Cart icon — bright white */}
        <svg
          className="absolute"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          width="22"
          height="22"
          fill="none"
          stroke={hovered ? "#ffffff" : "rgba(255,255,255,0.85)"}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>

        {/* Item count badge */}
        {totalItems > 0 && (
          <span
            className="absolute flex items-center justify-center text-[10px] font-bold"
            style={{
              top: "2px",
              right: "2px",
              minWidth: "18px",
              height: "18px",
              padding: "0 3px",
              fontFamily: "var(--font-medieval)",
              fontWeight: 600,
              background: "#ffffff",
              color: "#000000",
              lineHeight: 1,
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
