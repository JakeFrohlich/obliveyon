"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/shop/Footer";
import { useCart } from "@/hooks/use-cart";

// Shopify variant IDs keyed by "color|size" — kept for later wire-up.
const SHOPIFY_VARIANTS: Record<string, number> = {
  "White|S":      50142432854317,
  "White|M":      50142432952621,
  "White|L":      50142433050925,
  "White|XL":     50142433149229,
  "Acid Wash|S":  50142432887085,
  "Acid Wash|M":  50142432985389,
  "Acid Wash|L":  50142433083693,
  "Acid Wash|XL": 50142433181997,
  "Black|S":      50142432919853,
  "Black|M":      50142433018157,
  "Black|L":      50142433116461,
  "Black|XL":     50142433214765,
  "Original|S":   50142432919853,
  "Original|M":   50142433018157,
  "Original|L":   50142433116461,
  "Original|XL":  50142433214765,
};
// Suppress unused-warning until wired into checkout.
void SHOPIFY_VARIANTS;

const COLORS = [
  { label: "Original",  short: "O", swatch: "#2a2420" },
  { label: "Acid Wash", short: "A", swatch: "#5a5a5a" },
  { label: "White",     short: "W", swatch: "#f0ede8" },
  { label: "Black",     short: "B", swatch: "#0a0908" },
];

const SIZES = ["S", "M", "L", "XL"];

function OriginalObliveyonInner() {
  const searchParams = useSearchParams();
  const initialColor = parseInt(searchParams.get("color") || "0", 10);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addItem } = useCart();

  function handleAddToCart() {
    if (!selectedSize) return;
    addItem({
      productId: "the-original-obliveyon",
      name: `The Original Obliveyon — ${COLORS[selectedColor].label}`,
      price: 65,
      size: selectedSize,
      quantity,
      image: "/The orginal Obliveyon.png",
      color: COLORS[selectedColor].label,
    });
    setAdded(true);
    setQuantity(1);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#000000" }}>

      {/* ── Centered hero ── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 text-center"
        style={{ paddingTop: "120px", paddingBottom: "80px" }}
      >
        {/* Back */}
        <button
          onClick={() => router.push("/shop")}
          className="text-[11px] tracking-[0.4em] uppercase transition-colors duration-300 cursor-pointer mb-12"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, color: "rgba(255,255,255,0.5)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
        >
          ← Collection
        </button>

        {/* Top flourish */}
        <div className="flex items-center gap-3 mb-6 opacity-70">
          <div className="h-px w-12 sm:w-20" style={{ background: "rgba(255,255,255,0.18)" }} />
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="5,0 10,5 5,10 0,5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
          </svg>
          <div className="h-px w-12 sm:w-20" style={{ background: "rgba(255,255,255,0.18)" }} />
        </div>

        {/* Category */}
        <p
          className="text-[10px] sm:text-[11px] tracking-[0.6em] uppercase text-white/30 mb-5"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
        >
          Hoodie
        </p>

        {/* Title */}
        <h1
          className="text-4xl sm:text-6xl lg:text-7xl tracking-[0.04em] uppercase text-white leading-none"
          style={{
            fontFamily: "var(--font-gothic)",
            fontWeight: 300,
            textShadow: "0 0 30px rgba(255,255,255,0.12), 0 0 80px rgba(255,255,255,0.04)",
          }}
        >
          The Obliveyon
          <br />
          Zip Ups
        </h1>

        {/* Price with rule */}
        <div className="flex items-center justify-center gap-4 mt-7 mb-12">
          <div className="h-px w-10" style={{ background: "rgba(255,255,255,0.15)" }} />
          <p
            className="text-base sm:text-lg tracking-[0.35em] text-white/55"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
          >
            $65+
          </p>
          <div className="h-px w-10" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* ── Colorways ── */}
        <p
          className="text-[10px] sm:text-[11px] tracking-[0.5em] uppercase text-white/55 mb-5"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
        >
          Colorway — {COLORS[selectedColor].label}
        </p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-5 mb-12">
          {COLORS.map((color, i) => {
            const selected = selectedColor === i;
            return (
              <button
                key={color.label}
                onClick={() => setSelectedColor(i)}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-all duration-300"
                  style={{
                    background: color.swatch,
                    border: selected
                      ? "1px solid rgba(255,255,255,0.85)"
                      : "1px solid rgba(255,255,255,0.15)",
                    boxShadow: selected ? "0 0 24px rgba(255,255,255,0.18)" : "none",
                  }}
                >
                  <span
                    className="text-[10px] tracking-[0.25em] uppercase"
                    style={{
                      fontFamily: "var(--font-medieval)",
                      color: color.swatch === "#f0ede8" ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.55)",
                    }}
                  >
                    {color.short}
                  </span>
                </div>
                <span
                  className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-medieval)",
                    color: selected ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)",
                  }}
                >
                  {color.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Size ── */}
        <p
          className="text-[10px] sm:text-[11px] tracking-[0.5em] uppercase text-white/55 mb-4"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
        >
          Size {selectedSize && `— ${selectedSize}`}
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {SIZES.map((size) => {
            const selected = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className="px-5 sm:px-7 py-3 text-xs sm:text-sm tracking-[0.3em] uppercase cursor-pointer transition-all duration-300"
                style={{
                  fontFamily: "var(--font-medieval)",
                  fontWeight: 300,
                  background: selected ? "rgba(255,255,255,0.95)" : "transparent",
                  color: selected ? "#060504" : "rgba(255,255,255,0.4)",
                  border: selected
                    ? "1px solid rgba(255,255,255,0.9)"
                    : "1px solid rgba(255,255,255,0.12)",
                }}
              >
                {size}
              </button>
            );
          })}
        </div>

        {/* ── Quantity ── */}
        <p
          className="text-[10px] sm:text-[11px] tracking-[0.5em] uppercase text-white/55 mb-4"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
        >
          Quantity
        </p>
        <div className="flex items-center justify-center gap-4 mb-10">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-sm cursor-pointer transition-all duration-300"
            style={{
              fontFamily: "var(--font-medieval)",
              color: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
          >
            −
          </button>
          <span
            className="text-lg w-10 text-center tabular-nums"
            style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.85)" }}
          >
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-10 flex items-center justify-center text-sm cursor-pointer transition-all duration-300"
            style={{
              fontFamily: "var(--font-medieval)",
              color: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
          >
            +
          </button>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize}
          className="w-full max-w-sm py-4 text-xs sm:text-sm tracking-[0.5em] uppercase transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            fontFamily: "var(--font-medieval)",
            fontWeight: 400,
            background: added ? "transparent" : "rgba(255,255,255,0.92)",
            color: added ? "rgba(255,255,255,0.5)" : "#060504",
            border: added ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.9)",
            boxShadow: added ? "none" : "0 0 20px rgba(255,255,255,0.06)",
          }}
        >
          {added ? "Added" : !selectedSize ? "Select a Size" : "Add to Cart"}
        </button>

        {/* Bottom flourish */}
        <div className="flex items-center gap-3 mt-14 opacity-40">
          <div className="h-px w-12 sm:w-20" style={{ background: "rgba(255,255,255,0.15)" }} />
          <svg width="8" height="8" viewBox="0 0 8 8">
            <polygon points="4,0 8,4 4,8 0,4" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
          </svg>
          <div className="h-px w-12 sm:w-20" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function OriginalObliveyon() {
  return (
    <Suspense>
      <OriginalObliveyonInner />
    </Suspense>
  );
}
