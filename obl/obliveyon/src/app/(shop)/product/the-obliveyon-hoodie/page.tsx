"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/shop/Footer";
import { useCart } from "@/hooks/use-cart";

const SLIDES = [
  { type: "video", src: "/intro.mp4" },
  { type: "image", src: "/hoodie-front.jpg" },
  { type: "image", src: "/hoodie-back.jpg" },
];

const SIZES = ["S", "M", "L", "XL"];

// Hoodie size chart (cm). Manual measurement ±1–3cm tolerance.
const SIZE_CHART = [
  { size: "S",  shoulder: "60.5", chest: "131", sleeve: "50", length: "65.5", cuffRibLength: "6.5", crownHeight: "37", cuffRibWidth: "10.5" },
  { size: "M",  shoulder: "62.5", chest: "136", sleeve: "52", length: "68",   cuffRibLength: "6.5", crownHeight: "37", cuffRibWidth: "10.5" },
  { size: "L",  shoulder: "64.5", chest: "141", sleeve: "54", length: "70.5", cuffRibLength: "6.5", crownHeight: "37", cuffRibWidth: "11.5" },
  { size: "XL", shoulder: "66.5", chest: "146", sleeve: "56", length: "73",   cuffRibLength: "6.5", crownHeight: "37", cuffRibWidth: "11.5" },
];
// Convert a cm string to inches, rounded to 1 decimal (strip trailing .0).
function cmToIn(cm: string): string {
  const n = parseFloat(cm);
  if (Number.isNaN(n)) return cm;
  return (n * 0.393701).toFixed(1).replace(/\.0$/, "");
}

const SIZE_CHART_COLS: { key: keyof (typeof SIZE_CHART)[number]; label: string }[] = [
  { key: "size",          label: "Size" },
  { key: "shoulder",      label: "Shoulder" },
  { key: "chest",         label: "Chest" },
  { key: "sleeve",        label: "Sleeve" },
  { key: "length",        label: "Length" },
  { key: "cuffRibLength", label: "Cuff Rib L" },
  { key: "crownHeight",   label: "Crown" },
  { key: "cuffRibWidth",  label: "Cuff Rib W" },
];

export default function ObliveyonHoodiePage() {
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [sizeUnit, setSizeUnit] = useState<"in" | "cm">("in");
  const router = useRouter();
  const { addItem } = useCart();

  const currentSlide = SLIDES[slideIndex] || SLIDES[0];

  function prevSlide() {
    setSlideIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }

  function nextSlide() {
    setSlideIndex((prev) => (prev + 1) % SLIDES.length);
  }

  function handleAddToCart() {
    if (!selectedSize) return;
    addItem({
      productId: "the-obliveyon-hoodie",
      name: "The Obliveyon Hoodie",
      price: 70,
      size: selectedSize,
      quantity,
      image: "/hoodie-front.jpg",
      color: "Black",
    });
    setAdded(true);
    setQuantity(1);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="min-h-screen" style={{ background: "#000000" }} >
      <div
        className="relative flex flex-col lg:flex-row lg:min-h-screen pt-[56px]"
        style={{ background: "#000000" }}
      >
        {/* ── LEFT PANEL ── */}
        <div className="relative flex flex-col w-full lg:w-[58%] lg:h-full px-6 lg:px-10 pt-8 lg:pt-10 pb-10 lg:pb-8">
          {/* Back */}
          <button
            onClick={() => router.push("/shop")}
            className="self-start text-[11px] tracking-[0.4em] uppercase transition-colors duration-300 cursor-pointer mb-6"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, color: "rgba(255,255,255,0.85)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
          >
            ← Collection
          </button>

          {/* Chandelier hook */}
          <div className="flex justify-center mb-0">
            <svg width="120" height="60" viewBox="0 0 120 60" style={{ overflow: "visible" }}>
              <line x1="0" y1="4" x2="120" y2="4" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
              <line x1="60" y1="4" x2="60" y2="44" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="60" cy="48" r="4" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <path d="M60 52 Q60 62 52 62 Q44 62 44 54" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
              <circle cx="20" cy="4" r="1.5" fill="rgba(255,255,255,0.15)" />
              <circle cx="100" cy="4" r="1.5" fill="rgba(255,255,255,0.15)" />
            </svg>
          </div>

          {/* Image — hanging with subtle border (matches shop cards + original page) */}
          <div className="relative flex-1 flex items-start justify-center overflow-hidden" style={{ marginTop: "-8px" }}>
            <div
              className="relative w-full max-w-xs sm:max-w-sm aspect-[9/16] mx-auto"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {/* Inside corner ticks + tiny diamonds — same aesthetic as shop cards */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <line x1="0" y1="0" x2="12" y2="0" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <line x1="100" y1="0" x2="88" y2="0" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <line x1="100" y1="0" x2="100" y2="12" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <line x1="0" y1="100" x2="12" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <line x1="0" y1="100" x2="0" y2="88" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <line x1="100" y1="100" x2="88" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <line x1="100" y1="100" x2="100" y2="88" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <polygon points="50,2 52,4 50,6 48,4" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
                <polygon points="50,94 52,96 50,98 48,96" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
              </svg>

              {currentSlide?.type === "video" ? (
                <video
                  key={slideIndex}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain transition-opacity duration-500"
                  style={{ filter: "brightness(0.88)" }}
                >
                  <source src={currentSlide.src} type="video/mp4" />
                </video>
              ) : (
                <img
                  key={slideIndex}
                  src={currentSlide?.src || "/hoodie-front.jpg"}
                  alt="The Obliveyon Hoodie"
                  className="w-full h-full object-contain transition-opacity duration-500"
                  style={{ filter: "brightness(0.88)" }}
                />
              )}

              {/* Slide arrows — diamond-style, sit outside the image (matches zip-up page) */}
              <button
                onClick={prevSlide}
                className="absolute -left-6 sm:-left-12 lg:-left-16 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110"
                aria-label="Previous image"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 28 28"
                  fill="none"
                  style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.4))" }}
                >
                  <polygon points="14,1 27,14 14,27 1,14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                  <polygon points="14,5 23,14 14,23 5,14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
                  <path d="M16 9L11 14L16 19" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="14" cy="14" r="0.8" fill="rgba(255,255,255,0.4)" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute -right-6 sm:-right-12 lg:-right-16 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110"
                aria-label="Next image"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 28 28"
                  fill="none"
                  style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.4))" }}
                >
                  <polygon points="14,1 27,14 14,27 1,14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                  <polygon points="14,5 23,14 14,23 5,14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
                  <path d="M12 9L17 14L12 19" stroke="rgba(255,255,255,0.9)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="14" cy="14" r="0.8" fill="rgba(255,255,255,0.4)" />
                </svg>
              </button>

              {/* Slide dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIndex(i)}
                    className="w-1.5 h-1.5 rounded-full transition-all"
                    style={{ background: i === slideIndex ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)" }}
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — centered text + items ── */}
        <div className="relative flex flex-col items-center text-center justify-center w-full lg:w-[42%] px-8 lg:px-14 py-10 lg:py-0">
          <h1
            className="text-3xl sm:text-4xl tracking-[0.15em] uppercase text-white"
            style={{ fontFamily: "var(--font-gothic)", fontWeight: 300 }}
          >
            The Obliveyon Hoodie
          </h1>

          <p
            className="mt-3 text-lg sm:text-xl tracking-[0.08em] text-white/90 tabular-nums"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 500 }}
          >
            $70.00
          </p>

          <p
            className="mt-6 text-[13px] leading-relaxed text-white/60 max-w-sm"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
          >
            Heavyweight acid-wash pullover hoodie. Hand-finished embroidered logo.
          </p>

          {/* Sizing note */}
          <p
            className="mt-3 max-w-sm"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
          >
            <span
              className="text-[11px] tracking-[0.35em] uppercase text-white/85"
              style={{ fontWeight: 500 }}
            >
              <span className="opacity-50">— </span>Size Up.
            </span>
            <span className="text-[12px] tracking-[0.05em] text-white/55 ml-2">
              Make sure to read the size chart.
            </span>
          </p>

          {/* Size */}
          <div className="mt-8">
            <p
              className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-3"
              style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
            >
              Size
            </p>
            <div className="flex gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className="w-12 h-12 text-xs tracking-wider transition-all duration-300 cursor-pointer"
                  style={{
                    fontFamily: "var(--font-medieval)",
                    border: selectedSize === size ? "1px solid rgba(255,255,255,0.9)" : "1px solid rgba(255,255,255,0.2)",
                    color: selectedSize === size ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.6)",
                    background: selectedSize === size ? "rgba(255,255,255,0.06)" : "transparent",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* ── Size chart trigger ── */}
          <button
            onClick={() => setSizeChartOpen((o) => !o)}
            className="mt-6 text-[10px] tracking-[0.4em] uppercase cursor-pointer transition-colors duration-300 inline-flex items-center gap-3 group"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300, color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.95)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
          >
            <span className="h-px w-5 bg-current opacity-50" />
            <span>{sizeChartOpen ? "Hide Size Chart" : "View Size Chart"}</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className="transition-transform duration-300"
              style={{ transform: sizeChartOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* ── Size chart panel ── */}
          {sizeChartOpen && (
            <div
              className="relative mt-5 w-full max-w-md"
              style={{ border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <div className="relative px-4 sm:px-6 py-6">
                {/* Header */}
                <div className="text-center mb-5">
                  <p
                    className="text-[9px] tracking-[0.5em] uppercase text-white/40 mb-2"
                    style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
                  >
                    Hoodie
                  </p>
                  <h3
                    className="text-base sm:text-lg tracking-[0.2em] uppercase text-white mb-3"
                    style={{ fontFamily: "var(--font-gothic)", fontWeight: 300 }}
                  >
                    Size Chart
                  </h3>

                  {/* In / Cm toggle — underline-only active state */}
                  <div className="inline-flex items-center gap-5 sm:gap-6">
                    {(["in", "cm"] as const).map((u) => {
                      const active = sizeUnit === u;
                      return (
                        <button
                          key={u}
                          onClick={() => setSizeUnit(u)}
                          className="pb-1 text-[9px] tracking-[0.4em] uppercase cursor-pointer transition-colors duration-300"
                          style={{
                            fontFamily: "var(--font-medieval)",
                            fontWeight: 400,
                            color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.35)",
                            borderBottom: active ? "1px solid rgba(255,255,255,0.6)" : "1px solid transparent",
                          }}
                        >
                          {u === "in" ? "Inches" : "Cm"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto -mx-1 px-1">
                  <table
                    className="w-full text-center"
                    style={{
                      fontFamily: "var(--font-medieval)",
                      borderCollapse: "separate",
                      borderSpacing: 0,
                    }}
                  >
                    <thead>
                      <tr>
                        {SIZE_CHART_COLS.map((col, i) => (
                          <th
                            key={col.key}
                            className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-white/55 px-1.5 sm:px-2 py-2 font-normal whitespace-nowrap"
                            style={{
                              borderBottom: "1px solid rgba(255,255,255,0.22)",
                              borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.04)",
                            }}
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SIZE_CHART.map((row, rowIdx) => (
                        <tr key={row.size}>
                          {SIZE_CHART_COLS.map((col, colIdx) => {
                            const isSize = col.key === "size";
                            return (
                              <td
                                key={col.key}
                                className={`px-1.5 sm:px-2 py-2 text-[10px] sm:text-[11px] tabular-nums tracking-[0.15em] whitespace-nowrap ${
                                  isSize ? "uppercase" : ""
                                }`}
                                style={{
                                  color: isSize ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.7)",
                                  fontWeight: isSize ? 400 : 300,
                                  borderBottom:
                                    rowIdx === SIZE_CHART.length - 1
                                      ? "none"
                                      : "1px solid rgba(255,255,255,0.06)",
                                  borderLeft: colIdx === 0 ? "none" : "1px solid rgba(255,255,255,0.04)",
                                }}
                              >
                                {isSize || sizeUnit === "cm" ? row[col.key] : cmToIn(row[col.key])}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footnote */}
                <div className="flex items-center justify-center gap-3 mt-5 opacity-50">
                  <div className="h-px w-5" style={{ background: "rgba(255,255,255,0.2)" }} />
                  <p
                    className="text-[8px] sm:text-[9px] tracking-[0.3em] uppercase text-white/45 text-center"
                    style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
                  >
                    Hand-measured · Tolerance ±{sizeUnit === "in" ? "0.5–1 in" : "1–3 cm"}
                  </p>
                  <div className="h-px w-5" style={{ background: "rgba(255,255,255,0.2)" }} />
                </div>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6 flex items-center gap-4">
            <p
              className="text-[11px] tracking-[0.3em] uppercase text-white/50"
              style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
            >
              Qty
            </p>
            <div className="flex items-center" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                −
              </button>
              <span className="w-10 text-center text-sm text-white/80" style={{ fontFamily: "var(--font-medieval)" }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className="mt-8 w-full max-w-sm py-4 text-[12px] tracking-[0.35em] uppercase transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
            style={{
              fontFamily: "var(--font-medieval)",
              fontWeight: 400,
              border: "1px solid rgba(255,255,255,0.4)",
              color: selectedSize ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.3)",
              background: added ? "rgba(255,255,255,0.1)" : "transparent",
            }}
          >
            {added ? "Added ✓" : selectedSize ? "Add to Cart" : "Select a Size"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
