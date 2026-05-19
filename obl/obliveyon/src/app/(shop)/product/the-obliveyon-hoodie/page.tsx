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

export default function ObliveyonHoodiePage() {
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
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
      price: 65,
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
    <div className="min-h-screen" style={{ background: "#000000" }}>
      <div
        className="relative z-50 flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden"
        style={{ background: "#000000" }}
      >
        {/* ── LEFT PANEL ── */}
        <div className="relative flex flex-col w-full lg:w-[58%] h-[65vh] lg:h-full px-6 lg:px-10 pt-8 lg:pt-10 pb-4 lg:pb-8">
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

          {/* Image — hanging with ornate border */}
          <div className="relative flex-1 flex items-start justify-center overflow-hidden" style={{ marginTop: "-8px" }}>
            <div className="relative w-full max-w-lg h-full">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 600" preserveAspectRatio="none" style={{ overflow: "visible", zIndex: 10, pointerEvents: "none" }}>
                <defs>
                  <filter id="glow-hoodie">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <g filter="url(#glow-hoodie)">
                  <rect x="1" y="1" width="338" height="598" rx="1" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
                  <line x1="-4" y1="0" x2="50" y2="0" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                  <line x1="0" y1="-4" x2="0" y2="50" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                  <line x1="344" y1="0" x2="290" y2="0" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                  <line x1="340" y1="-4" x2="340" y2="50" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                  <line x1="-4" y1="600" x2="50" y2="600" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                  <line x1="0" y1="604" x2="0" y2="550" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                  <line x1="344" y1="600" x2="290" y2="600" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                  <line x1="340" y1="604" x2="340" y2="550" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                  <line x1="170" y1="-8" x2="170" y2="8" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                  <line x1="162" y1="0" x2="178" y2="0" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                  <line x1="170" y1="592" x2="170" y2="608" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                  <line x1="162" y1="600" x2="178" y2="600" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                </g>
              </svg>

              {currentSlide?.type === "video" ? (
                <video
                  key={slideIndex}
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
                  key={slideIndex}
                  src={currentSlide?.src || "/hoodie-front.jpg"}
                  alt="The Obliveyon Hoodie"
                  className="w-full h-full object-contain transition-opacity duration-500"
                  style={{ objectPosition: "top", filter: "brightness(0.88)" }}
                />
              )}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: "linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 30%)",
              }} />

              {/* Slide arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white transition-colors text-2xl cursor-pointer"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white transition-colors text-2xl cursor-pointer"
                aria-label="Next image"
              >
                ›
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

        {/* ── RIGHT PANEL ── */}
        <div className="relative flex flex-col justify-center w-full lg:w-[42%] px-8 lg:px-14 py-10 lg:py-0">
          <h1
            className="text-3xl sm:text-4xl tracking-[0.15em] uppercase text-white"
            style={{ fontFamily: "var(--font-gothic)", fontWeight: 300 }}
          >
            The Obliveyon Hoodie
          </h1>

          <p
            className="mt-3 text-sm tracking-[0.2em] text-white/50"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
          >
            $65.00
          </p>

          <p
            className="mt-6 text-[13px] leading-relaxed text-white/60 max-w-sm"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
          >
            Heavyweight acid-wash pullover hoodie. Hand-finished gothic emblem.
            Be the light in the darkness.
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
