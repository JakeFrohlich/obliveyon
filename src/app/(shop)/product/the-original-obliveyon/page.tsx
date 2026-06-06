"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/shop/Footer";
import { useCart } from "@/hooks/use-cart";

// Shopify variant IDs keyed by "color|size" — kept for later wire-up.
const SHOPIFY_VARIANTS: Record<string, number> = {
  "Acid Wash|S":  50142432887085,
  "Acid Wash|M":  50142432985389,
  "Acid Wash|L":  50142433083693,
  "Acid Wash|XL": 50142433181997,
  "White|S":      50142432854317,
  "White|M":      50142432952621,
  "White|L":      50142433050925,
  "White|XL":     50142433149229,
  "Black|S":      50142432919853,
  "Black|M":      50142433018157,
  "Black|L":      50142433116461,
  "Black|XL":     50142433214765,
};
// Suppress unused-warning until wired into checkout.
void SHOPIFY_VARIANTS;

type Slide = { type: "image" | "video"; src: string };

const COLORS: {
  label: string;
  short: string;
  swatch: string;
  image: string; // hero (used for cart line item)
  slides: Slide[];
}[] = [
  {
    label: "Acid Wash",
    short: "A",
    swatch: "#5a5a5a",
    image: "/try 2.png",
    slides: [
      { type: "video", src: "/acid wash video.mp4" },
      { type: "image", src: "/try 2.png" },
      { type: "image", src: "/acid wash save 2.png" },
      { type: "image", src: "/3rd acid wash.png" },
    ],
  },
  {
    label: "White",
    short: "W",
    swatch: "#f0ede8",
    image: "/White 1.png",
    slides: [
      { type: "video", src: "/white hoodie.mp4" },
      { type: "image", src: "/White 1.png" },
      { type: "image", src: "/2nd white.png" },
      { type: "image", src: "/3rd white.png" },
    ],
  },
  {
    label: "Black",
    short: "B",
    swatch: "#0a0908",
    image: "/black 1st.png",
    slides: [
      { type: "video", src: "/black hoodie.mp4" },
      { type: "image", src: "/black 1st.png" },
      { type: "image", src: "/Black 2.png" },
      { type: "image", src: "/black 3.png" },
    ],
  },
];

const SIZES = ["S", "M", "L", "XL"];

// Zip Up size chart (cm). Manual measurement ±1–3cm tolerance.
const SIZE_CHART = [
  { size: "S",  shoulder: "64", chest: "118", sleeve: "56",   length: "70", cuffThread: "5", hoodHeight: "39", cuff: "10"   },
  { size: "M",  shoulder: "66", chest: "124", sleeve: "57.5", length: "72", cuffThread: "5", hoodHeight: "39", cuff: "10"   },
  { size: "L",  shoulder: "68", chest: "130", sleeve: "59",   length: "74", cuffThread: "5", hoodHeight: "40", cuff: "10.5" },
  { size: "XL", shoulder: "70", chest: "136", sleeve: "60.5", length: "76", cuffThread: "5", hoodHeight: "40", cuff: "10.5" },
];
// Convert a cm string to inches, rounded to 1 decimal (strip trailing .0).
function cmToIn(cm: string): string {
  const n = parseFloat(cm);
  if (Number.isNaN(n)) return cm;
  return (n * 0.393701).toFixed(1).replace(/\.0$/, "");
}

const SIZE_CHART_COLS: { key: keyof (typeof SIZE_CHART)[number]; label: string }[] = [
  { key: "size",       label: "Size" },
  { key: "shoulder",   label: "Shoulder" },
  { key: "chest",      label: "Chest" },
  { key: "sleeve",     label: "Sleeve" },
  { key: "length",     label: "Length" },
  { key: "cuffThread", label: "Cuff Thread" },
  { key: "hoodHeight", label: "Hood Height" },
  { key: "cuff",       label: "Cuff" },
];

function OriginalObliveyonInner() {
  const searchParams = useSearchParams();
  const colorParam = searchParams.get("color");
  const isOverview = colorParam === null;
  const rawColor = parseInt(colorParam || "0", 10);
  const initialColor = Number.isFinite(rawColor)
    ? Math.min(Math.max(rawColor, 0), COLORS.length - 1)
    : 0;
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [sizeUnit, setSizeUnit] = useState<"in" | "cm">("in");
  const [slideIndex, setSlideIndex] = useState(0);
  const router = useRouter();
  const { addItem } = useCart();

  const currentSlides = COLORS[selectedColor].slides;
  const currentSlide = currentSlides[slideIndex] || currentSlides[0];

  function changeColor(i: number) {
    setSelectedColor(i);
    setSlideIndex(0);
  }

  // Overview → click swatch routes to per-color detail page.
  function pickColor(i: number) {
    router.push(`/product/the-original-obliveyon?color=${i}`);
  }

  function prevSlide() {
    setSlideIndex((idx) => (idx - 1 + currentSlides.length) % currentSlides.length);
  }
  function nextSlide() {
    setSlideIndex((idx) => (idx + 1) % currentSlides.length);
  }

  function handleAddToCart() {
    if (!selectedSize) return;
    addItem({
      productId: "the-original-obliveyon",
      name: `The Original Obliveyon — ${COLORS[selectedColor].label}`,
      price: 70,
      size: selectedSize,
      quantity,
      image: COLORS[selectedColor].image,
      color: COLORS[selectedColor].label,
      collection: "The Original Obliveyon Zip Ups",
    });
    setAdded(true);
    setQuantity(1);
    setTimeout(() => setAdded(false), 2000);
  }

  // ── Size chart sub-tree (shared between overview + detail). ──
  const sizeChartBlock = (
    <>
      <button
        onClick={() => setSizeChartOpen((o) => !o)}
        className="text-[10px] sm:text-[11px] tracking-[0.45em] uppercase cursor-pointer transition-colors duration-300 mb-6 inline-flex items-center gap-3 group"
        style={{ fontFamily: "var(--font-medieval)", fontWeight: 300, color: "rgba(255,255,255,0.5)" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.95)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
      >
        <span className="h-px w-6 bg-current opacity-50" />
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
        <span className="h-px w-6 bg-current opacity-50" />
      </button>

      {sizeChartOpen && (
        <div className="relative w-full max-w-2xl mb-10">
          {/* Ornate border */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 600 320"
            preserveAspectRatio="none"
            style={{ overflow: "visible" }}
          >
            <rect x="1" y="1" width="598" height="318" rx="1" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
            <line x1="-4" y1="0" x2="36" y2="0" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
            <line x1="0" y1="-4" x2="0" y2="36" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
            <line x1="604" y1="0" x2="564" y2="0" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
            <line x1="600" y1="-4" x2="600" y2="36" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
            <line x1="-4" y1="320" x2="36" y2="320" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
            <line x1="0" y1="324" x2="0" y2="284" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
            <line x1="604" y1="320" x2="564" y2="320" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
            <line x1="600" y1="324" x2="600" y2="284" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
            <polygon points="300,-4 304,0 300,4 296,0" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" />
            <polygon points="300,316 304,320 300,324 296,320" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" />
          </svg>

          <div className="relative px-5 sm:px-8 py-7 sm:py-9">
            {/* Header */}
            <div className="text-center mb-6">
              <p
                className="text-[10px] tracking-[0.5em] uppercase text-white/40 mb-3"
                style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
              >
                Zip Up
              </p>
              <h2
                className="text-xl sm:text-2xl tracking-[0.2em] uppercase text-white mb-3"
                style={{ fontFamily: "var(--font-gothic)", fontWeight: 300 }}
              >
                Size Chart
              </h2>

              {/* In / Cm toggle — underline-only active state */}
              <div className="inline-flex items-center gap-6 sm:gap-8">
                {(["in", "cm"] as const).map((u) => {
                  const active = sizeUnit === u;
                  return (
                    <button
                      key={u}
                      onClick={() => setSizeUnit(u)}
                      className="pb-1.5 text-[10px] tracking-[0.4em] uppercase cursor-pointer transition-colors duration-300"
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
            <div className="overflow-x-auto -mx-2 px-2">
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
                        className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-white/55 px-2 sm:px-3 py-3 font-normal whitespace-nowrap"
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
                            className={`px-2 sm:px-3 py-3 text-[11px] sm:text-[12px] tabular-nums tracking-[0.18em] whitespace-nowrap ${
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
            <div className="flex items-center justify-center gap-3 mt-6 opacity-50">
              <div className="h-px w-6" style={{ background: "rgba(255,255,255,0.2)" }} />
              <p
                className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-white/45 text-center"
                style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
              >
                Hand-measured · Tolerance ±{sizeUnit === "in" ? "0.5–1 in" : "1–3 cm"}
              </p>
              <div className="h-px w-6" style={{ background: "rgba(255,255,255,0.2)" }} />
            </div>
          </div>
        </div>
      )}
    </>
  );

  // ── Description + sizing note (shared between overview + detail). ──
  const descriptionBlock = (
    <>
      <p
        className="text-sm sm:text-base leading-relaxed text-white/65 max-w-md mb-3"
        style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
      >
        Heavyweight zip-up hoodie. Hand-finished embroidered logo. Custom zipper. Baggy oversized fit.
      </p>
      <p
        className="max-w-md mb-9"
        style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
      >
        <span
          className="text-[12px] sm:text-[13px] tracking-[0.35em] uppercase text-white/85"
          style={{ fontWeight: 500 }}
        >
          <span className="opacity-50">— </span>Baggy.
        </span>
        <span className="text-[13px] sm:text-sm tracking-[0.05em] text-white/55 ml-2">
          Make sure to read the size chart.
        </span>
      </p>
    </>
  );

  // ─────────────────────────────────────────────────────────────────────
  // OVERVIEW MODE — centered single-column layout with 3-card chooser.
  // ─────────────────────────────────────────────────────────────────────
  if (isOverview) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#000000" }}>
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
            Collection
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
            Zip Up
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
          <div className="flex items-center justify-center gap-4 mt-7 mb-10">
            <div className="h-px w-10" style={{ background: "rgba(255,255,255,0.15)" }} />
            <p
              className="text-xl sm:text-2xl tracking-[0.1em] text-white/90 tabular-nums"
              style={{ fontFamily: "var(--font-medieval)", fontWeight: 500 }}
            >
              $70
            </p>
            <div className="h-px w-10" style={{ background: "rgba(255,255,255,0.15)" }} />
          </div>

          {/* 3 colorway cards side by side, each clickable */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 w-full max-w-3xl mb-14">
            {COLORS.map((color, i) => (
              <button
                key={color.label}
                onClick={() => pickColor(i)}
                className="group block cursor-pointer text-center"
                aria-label={`View ${color.label} detail`}
              >
                {/* Card sizes to the image's intrinsic aspect — border hugs the image. */}
                <div
                  className="relative overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <img
                    src={color.image}
                    alt={color.label}
                    className="block w-full h-auto transition-transform duration-700 group-hover:scale-[1.04]"
                    style={{ filter: "brightness(0.92)" }}
                  />
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
                </div>

                <p
                  className="mt-3 sm:mt-4 text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-white/65 group-hover:text-white transition-colors duration-300"
                  style={{ fontFamily: "var(--font-medieval)", fontWeight: 400 }}
                >
                  {color.label}
                </p>
              </button>
            ))}
          </div>

          {/* Description + sizing note */}
          {descriptionBlock}

          {/* Size chart */}
          {sizeChartBlock}

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

  // ─────────────────────────────────────────────────────────────────────
  // DETAIL MODE — two-panel layout (image left, info right) like hoodie page.
  // ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#000000" }}>
      <div
        className="relative flex flex-col lg:flex-row lg:min-h-screen"
        style={{ paddingTop: "84px" }}
      >
        {/* ── LEFT PANEL — image + carousel ── */}
        <div className="relative flex flex-col w-full lg:w-[55%] px-6 lg:px-10 pt-6 lg:pt-10 pb-10 lg:pb-10">
          {/* Image with carousel arrows + dots */}
          <div className="flex-1 flex items-center justify-center">
            <div
              className="relative w-full max-w-xs sm:max-w-sm aspect-[9/16]"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {/* Inside corner ticks + tiny diamond ornaments */}
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

              {/* The slide — video or image */}
              {currentSlide?.type === "video" ? (
                <video
                  key={`${COLORS[selectedColor].label}-${slideIndex}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain transition-opacity duration-500"
                  style={{ filter: "brightness(0.92)" }}
                >
                  <source src={currentSlide.src} type="video/mp4" />
                </video>
              ) : (
                <img
                  key={`${COLORS[selectedColor].label}-${slideIndex}`}
                  src={currentSlide?.src || COLORS[selectedColor].image}
                  alt={`${COLORS[selectedColor].label} colorway`}
                  className="w-full h-full object-contain transition-opacity duration-500"
                  style={{ filter: "brightness(0.92)" }}
                />
              )}

              {/* Prev slide — sits outside the image */}
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

              {/* Next slide — sits outside the image */}
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

              {/* Slide dots — one per slide of current colorway */}
              {currentSlides.length > 1 && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {currentSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlideIndex(i)}
                      className="w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-300"
                      style={{
                        background:
                          slideIndex === i ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.2)",
                        boxShadow:
                          slideIndex === i ? "0 0 8px rgba(255,255,255,0.4)" : "none",
                      }}
                      aria-label={`Image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — all product info, centered ── */}
        <div className="relative flex flex-col items-center text-center w-full lg:w-[45%] px-8 lg:px-16 pt-4 lg:pt-16 pb-12 lg:pb-16 justify-start lg:justify-center">
          {/* Category */}
          <p
            className="text-[11px] sm:text-[13px] tracking-[0.6em] uppercase text-white/35 mb-5"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
          >
            Zip Up
          </p>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl tracking-[0.04em] uppercase text-white leading-tight mb-5"
            style={{
              fontFamily: "var(--font-gothic)",
              fontWeight: 300,
              textShadow: "0 0 30px rgba(255,255,255,0.12)",
            }}
          >
            The Obliveyon
            <br />
            Zip Ups
          </h1>

          {/* Price */}
          <p
            className="text-2xl sm:text-3xl tracking-[0.1em] text-white/90 tabular-nums mb-9"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 500 }}
          >
            $70
          </p>

          {/* Description + sizing */}
          {descriptionBlock}

          {/* ── Colorway swatches ── */}
          <p
            className="text-[11px] sm:text-[13px] tracking-[0.5em] uppercase text-white/55 mb-5"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
          >
            Colorway — {COLORS[selectedColor].label}
          </p>
          <div className="flex flex-wrap gap-5 sm:gap-6 mb-11">
            {COLORS.map((color, i) => {
              const selected = selectedColor === i;
              return (
                <button
                  key={color.label}
                  onClick={() => changeColor(i)}
                  className="flex flex-col items-center gap-2.5 cursor-pointer group"
                >
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition-all duration-300"
                    style={{
                      background: color.swatch,
                      border: selected
                        ? "1px solid rgba(255,255,255,0.85)"
                        : "1px solid rgba(255,255,255,0.15)",
                      boxShadow: selected ? "0 0 24px rgba(255,255,255,0.18)" : "none",
                    }}
                  >
                    <span
                      className="text-[11px] tracking-[0.25em] uppercase"
                      style={{
                        fontFamily: "var(--font-medieval)",
                        color: color.swatch === "#f0ede8" ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.55)",
                      }}
                    >
                      {color.short}
                    </span>
                  </div>
                  <span
                    className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase transition-colors duration-300"
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
            className="text-[11px] sm:text-[13px] tracking-[0.5em] uppercase text-white/55 mb-4"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
          >
            Size {selectedSize && `— ${selectedSize}`}
          </p>
          <div className="flex flex-wrap gap-3 mb-9">
            {SIZES.map((size) => {
              const selected = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className="px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base tracking-[0.3em] uppercase cursor-pointer transition-all duration-300"
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

          {/* Size chart */}
          {sizeChartBlock}

          {/* ── Quantity ── */}
          <p
            className="text-[11px] sm:text-[13px] tracking-[0.5em] uppercase text-white/55 mb-4"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
          >
            Quantity
          </p>
          <div className="flex items-center gap-4 mb-9">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300"
              style={{
                fontFamily: "var(--font-medieval)",
                fontSize: "18px",
                color: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
            >
              −
            </button>
            <span
              className="text-xl w-12 text-center tabular-nums"
              style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.85)" }}
            >
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300"
              style={{
                fontFamily: "var(--font-medieval)",
                fontSize: "18px",
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
            className="w-full max-w-sm py-5 text-sm sm:text-base tracking-[0.5em] uppercase transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
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
