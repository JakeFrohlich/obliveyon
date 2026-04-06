"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    category: string;
  };
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <div style={{ animation: `fadeUp 0.5s ease both`, animationDelay: `${index * 0.06}s` }}>
      <Link href={`/product/${product.slug}`} className="group block">
        <div
          className="aspect-square overflow-hidden relative"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              style={{ filter: "brightness(0.9)" }}
              loading="lazy"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <span
                className="text-[9px] tracking-[0.3em] uppercase text-white/15"
                style={{ fontFamily: "var(--font-medieval)" }}
              >
                {product.name}
              </span>
            </div>
          )}

          {/* Hover overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }}
          />
          {/* Hover border */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.3)" }}
          />
          {/* Name on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none">
            <p
              className="text-[9px] tracking-[0.2em] uppercase text-white/90 truncate"
              style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
            >
              {product.name}
            </p>
            <p
              className="text-[8px] tracking-wider text-white/50"
              style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
            >
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </Link>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
