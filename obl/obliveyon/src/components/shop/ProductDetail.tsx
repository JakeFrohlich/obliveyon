"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes: string[];
  stock: number;
}

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  function handleAddToCart() {
    if (!selectedSize) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity: 1,
      image: product.images[0] || "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden" style={{ background: "#060504" }}>

      {/* Ambient candle glow — left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 20% 60%, rgba(180,120,40,0.06) 0%, transparent 55%)",
          animation: "candleFlicker 6s ease-in-out infinite alternate",
        }}
      />
      {/* Ambient candle glow — right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 80% 40%, rgba(160,100,30,0.04) 0%, transparent 50%)",
          animation: "candleFlicker 8s ease-in-out infinite alternate-reverse",
        }}
      />

      {/* Left — Image */}
      <div className="relative w-full lg:w-[58%] h-full flex flex-col">

        {/* Main image */}
        <div className="relative flex-1 overflow-hidden">
          {product.images[selectedImage] ? (
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.92)" }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <span
                className="text-xs tracking-[0.4em] uppercase text-white/20"
                style={{ fontFamily: "var(--font-medieval)" }}
              >
                {product.name}
              </span>
            </div>
          )}

          {/* Bottom vignette on image */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(6,5,4,0.7) 0%, transparent 40%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to right, transparent 70%, rgba(6,5,4,0.9) 100%)",
            }}
          />
        </div>

        {/* Thumbnail row */}
        {product.images.length > 1 && (
          <div className="absolute bottom-6 left-6 flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className="w-14 h-18 overflow-hidden transition-all duration-300 cursor-pointer"
                style={{
                  border: selectedImage === i
                    ? "1px solid rgba(255,255,255,0.5)"
                    : "1px solid rgba(255,255,255,0.1)",
                  opacity: selectedImage === i ? 1 : 0.5,
                }}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right — Product info */}
      <div
        className="relative w-full lg:w-[42%] h-full flex flex-col justify-center px-10 lg:px-14 overflow-y-auto"
        style={{ background: "rgba(6,5,4,0.97)" }}
      >

        {/* Back */}
        <button
          onClick={() => router.push("/shop")}
          className="absolute top-8 left-10 text-[10px] tracking-[0.4em] uppercase text-white/25 hover:text-white/50 transition-colors duration-300 cursor-pointer"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
        >
          ← Collection
        </button>

        <div className="pt-20 pb-12">

          {/* Category */}
          <p
            className="text-[9px] tracking-[0.6em] uppercase text-white/25 mb-4"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
          >
            {product.category}
          </p>

          {/* Name */}
          <h1
            className="text-3xl sm:text-4xl tracking-[0.08em] uppercase text-white mb-3 leading-tight"
            style={{
              fontFamily: "var(--font-gothic)",
              fontWeight: 300,
              textShadow: "0 0 40px rgba(255,255,255,0.08)",
            }}
          >
            {product.name}
          </h1>

          {/* Price */}
          <p
            className="text-lg tracking-[0.3em] text-white/60 mb-8"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
          >
            {formatPrice(product.price)}
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="w-1 h-1 rotate-45" style={{ background: "rgba(255,255,255,0.15)" }} />
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Description */}
          <p
            className="text-sm leading-loose text-white/40 mb-10"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300, letterSpacing: "0.04em" }}
          >
            {product.description}
          </p>

          {/* Color swatches — if multiple images treat as color variants */}
          {product.images.length > 1 && (
            <div className="mb-8">
              <p
                className="text-[9px] tracking-[0.5em] uppercase text-white/25 mb-3"
                style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
              >
                Color
              </p>
              <div className="flex gap-2">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className="w-7 h-7 cursor-pointer transition-all duration-300"
                    style={{
                      background: i === 0 ? "#2a2420" : i === 1 ? "#f0ede8" : "#0a0908",
                      border: selectedImage === i
                        ? "1px solid rgba(255,255,255,0.5)"
                        : "1px solid rgba(255,255,255,0.1)",
                      boxShadow: selectedImage === i ? "0 0 10px rgba(255,255,255,0.1)" : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          <div className="mb-8">
            <p
              className="text-[9px] tracking-[0.5em] uppercase text-white/25 mb-3"
              style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
            >
              Size {selectedSize && `— ${selectedSize}`}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className="px-5 py-2.5 text-xs tracking-[0.3em] uppercase cursor-pointer transition-all duration-300"
                  style={{
                    fontFamily: "var(--font-medieval)",
                    fontWeight: 300,
                    background: selectedSize === size ? "rgba(255,255,255,0.95)" : "transparent",
                    color: selectedSize === size ? "#060504" : "rgba(255,255,255,0.4)",
                    border: selectedSize === size
                      ? "1px solid rgba(255,255,255,0.9)"
                      : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || product.stock === 0}
            className="w-full py-4 text-xs tracking-[0.5em] uppercase transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              fontFamily: "var(--font-medieval)",
              fontWeight: 400,
              background: added
                ? "rgba(255,255,255,0.15)"
                : product.stock === 0
                  ? "transparent"
                  : "rgba(255,255,255,0.92)",
              color: added || product.stock === 0 ? "rgba(255,255,255,0.6)" : "#060504",
              border: added || product.stock === 0
                ? "1px solid rgba(255,255,255,0.15)"
                : "none",
            }}
          >
            {product.stock === 0
              ? "Sold Out"
              : added
                ? "Added to Cart"
                : !selectedSize
                  ? "Select a Size"
                  : "Add to Cart"}
          </button>

          {product.stock > 0 && product.stock <= 5 && (
            <p
              className="text-[9px] tracking-[0.4em] uppercase text-white/20 mt-4 text-center"
              style={{ fontFamily: "var(--font-medieval)" }}
            >
              Only {product.stock} remaining
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes candleFlicker {
          0% { opacity: 0.7; transform: scale(1); }
          33% { opacity: 1; transform: scale(1.05); }
          66% { opacity: 0.85; transform: scale(0.98); }
          100% { opacity: 0.9; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}
