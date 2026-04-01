"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/shop/Footer";

const COLORS = [
  { label: "Original", short: "O", swatch: "#2a2420" },
  { label: "Acid Wash", short: "A", swatch: "#5a5a5a" },
  { label: "White",    short: "W", swatch: "#f0ede8" },
  { label: "Black",   short: "B", swatch: "#0a0908" },
];

const SIZES = ["S", "M", "L", "XL"];

// Slides per colorway — add images/videos as you get them
// type: "video" | "image"
const COLOR_SLIDES: Record<string, { type: string; src: string }[]> = {
  Original: [
    { type: "image", src: "/The orginal Obliveyon.png" },
    // Add more slides: { type: "image", src: "/acid-wash-front.png" },
  ],
  White: [
    { type: "video", src: "/white hoodie.mp4" },
    { type: "image", src: "/White 1.png" },
    { type: "image", src: "/2nd white.png" },
    { type: "image", src: "/3rd white.png" },
  ],
  Black: [
    { type: "video", src: "/black hoodie.mp4" },
    { type: "image", src: "/black 1st.png" },
    { type: "image", src: "/Black 2.png" },
    { type: "image", src: "/black 3.png" },
  ],
  "Acid Wash": [
    { type: "video", src: "/acid wash video.mp4" },
    { type: "image", src: "/try 2.png" },
    { type: "image", src: "/acid wash save 2.png" },
    { type: "image", src: "/3rd acid wash.png" },
  ],
};

export default function OriginalObliveyon() {
  const searchParams = useSearchParams();
  const initialColor = parseInt(searchParams.get("color") || "0", 10);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const router = useRouter();

  const currentSlides = COLOR_SLIDES[COLORS[selectedColor].label] || [];
  const currentSlide = currentSlides[slideIndex] || currentSlides[0];
  const hasMultipleSlides = currentSlides.length > 1;

  function handleColorChange(i: number) {
    setSelectedColor(i);
    setSlideIndex(0);
  }

  function prevSlide() {
    setSlideIndex((prev) => (prev - 1 + currentSlides.length) % currentSlides.length);
  }

  function nextSlide() {
    setSlideIndex((prev) => (prev + 1) % currentSlides.length);
  }

  function handleAddToCart() {
    if (!selectedSize) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="min-h-screen" style={{ background: "#000000" }}>
    <div
      className="relative z-50 flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Ambient candle glow — removed to keep pure black */}

      {/* ── LEFT PANEL ── */}
      <div className="relative flex flex-col w-full lg:w-[58%] h-[65vh] lg:h-full px-6 lg:px-10 pt-8 lg:pt-10 pb-4 lg:pb-8">

        {/* Back */}
        <button
          onClick={() => router.push("/shop")}
          className="self-start text-[10px] tracking-[0.4em] uppercase text-white/25 hover:text-white/50 transition-colors duration-300 cursor-pointer mb-6"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
        >
          ← Collection
        </button>

        {/* Chandelier hook */}
        <div className="flex justify-center mb-0">
          <svg width="120" height="60" viewBox="0 0 120 60" style={{ overflow: "visible" }}>
            {/* Ceiling bar */}
            <line x1="0" y1="4" x2="120" y2="4" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
            {/* Drop chain */}
            <line x1="60" y1="4" x2="60" y2="44" stroke="rgba(255,255,255,0.2)" strokeWidth="1"
              strokeDasharray="3 3" />
            {/* Hook circle */}
            <circle cx="60" cy="48" r="4" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            {/* Hook curve */}
            <path d="M60 52 Q60 62 52 62 Q44 62 44 54" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
            {/* Side ornament dots */}
            <circle cx="20" cy="4" r="1.5" fill="rgba(255,255,255,0.15)" />
            <circle cx="100" cy="4" r="1.5" fill="rgba(255,255,255,0.15)" />
            <line x1="0" y1="4" x2="0" y2="14" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="120" y1="4" x2="120" y2="14" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          </svg>
        </div>

        {/* Clothing image/video — hanging with Press Play border */}
        <div className="relative flex-1 flex items-start justify-center overflow-hidden" style={{ marginTop: "-8px" }}>
          <div className="relative w-full max-w-lg h-full">

            {/* Ornate border — same as Press Play */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 600" preserveAspectRatio="none" style={{ overflow: "visible", zIndex: 10, pointerEvents: "none" }}>
              <defs>
                <filter id="glow-product">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#glow-product)">
                {/* Full border */}
                <rect x="1" y="1" width="338" height="598" rx="1" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
                {/* Outer accent corners */}
                <line x1="-4" y1="0" x2="50" y2="0" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                <line x1="0" y1="-4" x2="0" y2="50" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                <line x1="344" y1="0" x2="290" y2="0" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                <line x1="340" y1="-4" x2="340" y2="50" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                <line x1="-4" y1="600" x2="50" y2="600" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                <line x1="0" y1="604" x2="0" y2="550" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                <line x1="344" y1="600" x2="290" y2="600" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                <line x1="340" y1="604" x2="340" y2="550" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                {/* Inner corner details */}
                <line x1="8" y1="8" x2="28" y2="8" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <line x1="8" y1="8" x2="8" y2="28" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <line x1="332" y1="8" x2="312" y2="8" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <line x1="332" y1="8" x2="332" y2="28" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <line x1="8" y1="592" x2="28" y2="592" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <line x1="8" y1="592" x2="8" y2="572" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <line x1="332" y1="592" x2="312" y2="592" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <line x1="332" y1="592" x2="332" y2="572" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                {/* Top center sword cross */}
                <line x1="170" y1="-8" x2="170" y2="8" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                <line x1="162" y1="0" x2="178" y2="0" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                <circle cx="170" cy="0" r="2" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
                {/* Bottom center sword cross */}
                <line x1="170" y1="592" x2="170" y2="608" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                <line x1="162" y1="600" x2="178" y2="600" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                <circle cx="170" cy="600" r="2" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
                {/* Side diamonds */}
                <polygon points="0,300 -4,304 0,308 4,304" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
                <polygon points="340,300 336,304 340,308 344,304" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
                {/* Filigree lines */}
                <line x1="55" y1="0" x2="155" y2="0" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
                <line x1="185" y1="0" x2="285" y2="0" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
                <line x1="55" y1="600" x2="155" y2="600" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
                <line x1="185" y1="600" x2="285" y2="600" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
              </g>
            </svg>

            {/* Current slide */}
            {currentSlide?.type === "video" ? (
              <video
                key={`${COLORS[selectedColor].label}-${slideIndex}`}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain transition-opacity duration-500"
                style={{ objectPosition: "top", filter: "brightness(0.88)" }}
              >
                <source src={currentSlide.src} type="video/mp4" />
              </video>
            ) : (
              <img
                key={`${COLORS[selectedColor].label}-${slideIndex}`}
                src={currentSlide?.src || "/The orginal Obliveyon.png"}
                alt="The Original Obliveyon"
                className="w-full h-full object-contain transition-opacity duration-500"
                style={{ objectPosition: "top", filter: "brightness(0.88)" }}
              />
            )}
            {/* Bottom fade */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 30%)",
            }} />
          </div>

          {/* Left arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-2 lg:left-[calc(50%-310px)] top-1/2 -translate-y-1/2 z-20 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.4))" }}>
              {/* Outer diamond frame */}
              <polygon points="14,1 27,14 14,27 1,14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              {/* Inner diamond */}
              <polygon points="14,5 23,14 14,23 5,14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
              {/* Arrow */}
              <path d="M16 9L11 14L16 19" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              {/* Center dot */}
              <circle cx="14" cy="14" r="0.8" fill="rgba(255,255,255,0.4)" />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-2 lg:right-[calc(50%-310px)] top-1/2 -translate-y-1/2 z-20 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.4))" }}>
              {/* Outer diamond frame */}
              <polygon points="14,1 27,14 14,27 1,14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              {/* Inner diamond */}
              <polygon points="14,5 23,14 14,23 5,14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
              {/* Arrow */}
              <path d="M12 9L17 14L12 19" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              {/* Center dot */}
              <circle cx="14" cy="14" r="0.8" fill="rgba(255,255,255,0.2)" />
            </svg>
          </button>

          {/* Slide dots */}
          {hasMultipleSlides && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {currentSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className="w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-300"
                  style={{
                    background: slideIndex === i ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Color swatches — bottom left */}
        <div className="flex gap-3 -mt-8">
          {COLORS.map((color, i) => (
            <button
              key={color.value || i}
              onClick={() => handleColorChange(i)}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div
                className="w-12 h-12 transition-all duration-300 flex items-center justify-center"
                style={{
                  background: color.swatch,
                  border: selectedColor === i
                    ? "1px solid rgba(255,255,255,0.6)"
                    : "1px solid rgba(255,255,255,0.12)",
                  boxShadow: selectedColor === i ? "0 0 16px rgba(255,255,255,0.1)" : "none",
                }}
              >
                <span
                  className="text-[10px] tracking-widest uppercase"
                  style={{
                    fontFamily: "var(--font-medieval)",
                    color: color.swatch === "#f0ede8" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {color.short}
                </span>
              </div>
              <span
                className="text-[8px] tracking-[0.3em] uppercase transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-medieval)",
                  color: selectedColor === i ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)",
                }}
              >
                {color.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Right edge fade — desktop only */}
      <div className="hidden lg:block absolute top-0 bottom-0 pointer-events-none" style={{
        left: "calc(58% - 80px)",
        width: "80px",
        background: "linear-gradient(to right, transparent, #000000)",
      }} />

      {/* ── RIGHT PANEL ── */}
      <div
        className="relative w-full lg:w-[42%] lg:h-full flex flex-col justify-center items-center px-6 lg:px-14 overflow-y-auto text-center"
        style={{ background: "#000000" }}
      >
        <div className="py-12 relative w-full">

          {/* Ornate panel border */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 700" preserveAspectRatio="none" style={{ overflow: "visible" }}>
            <defs>
              <filter id="panel-glow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g filter="url(#panel-glow)">
              {/* Corner accents */}
              <line x1="0" y1="0" x2="40" y2="0" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
              <line x1="0" y1="0" x2="0" y2="40" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
              <line x1="400" y1="0" x2="360" y2="0" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
              <line x1="400" y1="0" x2="400" y2="40" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
              <line x1="0" y1="700" x2="40" y2="700" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
              <line x1="0" y1="700" x2="0" y2="660" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
              <line x1="400" y1="700" x2="360" y2="700" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
              <line x1="400" y1="700" x2="400" y2="660" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
              {/* Top center diamond */}
              <polygon points="200,-4 204,0 200,4 196,0" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
              {/* Bottom center diamond */}
              <polygon points="200,696 204,700 200,704 196,700" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
              {/* Side diamonds */}
              <polygon points="-4,350 0,354 4,350 0,346" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />
              <polygon points="396,350 400,354 404,350 400,346" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />
              {/* Thin connecting lines */}
              <line x1="45" y1="0" x2="190" y2="0" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
              <line x1="210" y1="0" x2="355" y2="0" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
              <line x1="45" y1="700" x2="190" y2="700" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
              <line x1="210" y1="700" x2="355" y2="700" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
            </g>
          </svg>

          <div className="px-4">
            {/* Category */}
            <p className="text-[11px] tracking-[0.6em] uppercase text-white/20 mb-4"
              style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}>
              Hoodie
            </p>

            {/* Name */}
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl tracking-[0.06em] uppercase text-white mb-2 leading-tight"
              style={{
                fontFamily: "var(--font-gothic)",
                fontWeight: 300,
                textShadow: "0 0 20px rgba(255,255,255,0.1), 0 0 60px rgba(255,255,255,0.04)",
              }}
            >
              The Original Obliveyon
            </h1>

            {/* Price with ornament */}
            <div className="flex items-center justify-center gap-3 mb-6 mt-4">
              <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.1)" }} />
              <p className="text-lg tracking-[0.35em] text-white/50"
                style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}>
                $65+
              </p>
              <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.1)" }} />
            </div>

            {/* Divider with cross */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <line x1="6" y1="0" x2="6" y2="12" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
                <line x1="0" y1="6" x2="12" y2="6" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
                <circle cx="6" cy="6" r="2" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />
              </svg>
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Description */}
            <p className="text-base leading-loose text-white/35 mb-10 px-4"
              style={{ fontFamily: "var(--font-medieval)", fontWeight: 300, letterSpacing: "0.04em", textAlign: "center" }}>
              The Original Obliveyon Zip Up. Heavyweight zip hoodie. Hand-embroidered Obliveyon logo. Custom zipper. Four colorways. The piece that started it all.
            </p>

            {/* Color & Size labels */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <p className="text-[11px] tracking-[0.5em] uppercase text-white/30"
                style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}>
                Color — {COLORS[selectedColor].label}
              </p>
              <div className="w-px h-3" style={{ background: "rgba(255,255,255,0.1)" }} />
              <p className="text-[11px] tracking-[0.5em] uppercase text-white/30"
                style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}>
                Size {selectedSize ? `— ${selectedSize}` : ""}
              </p>
            </div>

            {/* Size selector */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="relative px-6 py-3 text-sm tracking-[0.3em] uppercase cursor-pointer transition-all duration-300"
                    style={{
                      fontFamily: "var(--font-medieval)",
                      fontWeight: 300,
                      background: selectedSize === size ? "rgba(255,255,255,0.95)" : "transparent",
                      color: selectedSize === size ? "#060504" : "rgba(255,255,255,0.35)",
                      border: selectedSize === size
                        ? "1px solid rgba(255,255,255,0.9)"
                        : "1px solid rgba(255,255,255,0.1)",
                      boxShadow: selectedSize === size ? "0 0 12px rgba(255,255,255,0.1)" : "none",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider before cart */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.04)" }} />
              <div className="w-1 h-1 rotate-45" style={{ background: "rgba(255,255,255,0.12)" }} />
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.04)" }} />
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="relative w-full max-w-sm mx-auto py-4 text-sm tracking-[0.5em] uppercase transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden"
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
      </div>

      <style jsx>{`
        @keyframes candleFlicker {
          0% { opacity: 0.7; }
          33% { opacity: 1; }
          66% { opacity: 0.85; }
          100% { opacity: 0.9; }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-0.4deg); }
          50% { transform: rotate(0.4deg); }
        }
      `}</style>
    </div>

    <Footer />
    </div>
  );
}
