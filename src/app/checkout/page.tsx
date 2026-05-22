"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

// Shopify variant IDs — keyed by "productId|color|size"
const SHOPIFY_VARIANTS: Record<string, number> = {
  // Zip Up — White
  "the-original-obliveyon|White|S":  50142432854317,
  "the-original-obliveyon|White|M":  50142432952621,
  "the-original-obliveyon|White|L":  50142433050925,
  "the-original-obliveyon|White|XL": 50142433149229,
  // Zip Up — Acid Wash (Gray)
  "the-original-obliveyon|Acid Wash|S":  50142432887085,
  "the-original-obliveyon|Acid Wash|M":  50142432985389,
  "the-original-obliveyon|Acid Wash|L":  50142433083693,
  "the-original-obliveyon|Acid Wash|XL": 50142433181997,
  // Zip Up — Black
  "the-original-obliveyon|Black|S":  50142432919853,
  "the-original-obliveyon|Black|M":  50142433018157,
  "the-original-obliveyon|Black|L":  50142433116461,
  "the-original-obliveyon|Black|XL": 50142433214765,
  // Zip Up — Original (mapped to Black)
  "the-original-obliveyon|Original|S":  50142432919853,
  "the-original-obliveyon|Original|M":  50142433018157,
  "the-original-obliveyon|Original|L":  50142433116461,
  "the-original-obliveyon|Original|XL": 50142433214765,
  // Hoodie
  "obliveyon-hoodie||S":  48602088440109,
  "obliveyon-hoodie||M":  48602088472877,
  "obliveyon-hoodie||L":  48602088505645,
  "obliveyon-hoodie||XL": 48602088538413,
  // The Obliveyon Hoodie (product page) — same SKUs as the original hoodie, with Black color
  "the-obliveyon-hoodie|Black|S":  48602088440109,
  "the-obliveyon-hoodie|Black|M":  48602088472877,
  "the-obliveyon-hoodie|Black|L":  48602088505645,
  "the-obliveyon-hoodie|Black|XL": 48602088538413,
};

function buildShopifyCartUrl(items: { productId: string; color?: string; size: string; quantity: number }[]): string {
  const parts = items
    .map((item) => {
      const key = `${item.productId}|${item.color ?? ""}|${item.size}`;
      const variantId = SHOPIFY_VARIANTS[key];
      if (!variantId) return null;
      return `${variantId}:${item.quantity}`;
    })
    .filter(Boolean);

  if (parts.length === 0) return "https://obliveyon.myshopify.com/shop";
  return `https://obliveyon.myshopify.com/cart/${parts.join(",")}`;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  // Auto-redirect if cart has items
  useEffect(() => {
    if (items.length > 0) {
      const url = buildShopifyCartUrl(items);
      const parsed = new URL(url);
      if (parsed.hostname !== "obliveyon.myshopify.com") return;
      clearCart();
      window.location.href = url;
    }
  }, [items, clearCart]);

  if (items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: "#000000" }}
      >
        <button
          onClick={() => router.push("/shop")}
          className="fixed top-6 left-6 z-20 text-[11px] tracking-[0.4em] uppercase transition-colors duration-300 cursor-pointer"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, color: "rgba(255,255,255,0.85)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
        >
          ← Return
        </button>
        <h1
          className="text-3xl tracking-[0.15em] uppercase mb-4"
          style={{ fontFamily: "var(--font-gothic)", fontWeight: 300, color: "rgba(255,255,255,0.9)" }}
        >
          Checkout
        </h1>
        <p
          className="text-sm mb-8"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 300, color: "rgba(255,255,255,0.4)" }}
        >
          Your cart is empty
        </p>
        <Link
          href="/shop"
          className="inline-block px-8 py-3 text-sm tracking-[0.4em] uppercase transition-all duration-300"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, background: "rgba(255,255,255,0.92)", color: "#060504", border: "1px solid rgba(255,255,255,0.9)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.92)"; }}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Show order summary while redirecting
  return (
    <div className="min-h-screen px-6" style={{ background: "#000000" }}>
      <button
        onClick={() => router.push("/shop")}
        className="fixed top-6 left-6 z-20 text-[11px] tracking-[0.4em] uppercase transition-colors duration-300 cursor-pointer"
        style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, color: "rgba(255,255,255,0.85)" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,1)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
      >
        ← Return
      </button>

      <div className="max-w-2xl mx-auto pt-20 pb-16">
        <div className="text-center mb-10">
          <p className="text-[9px] tracking-[0.5em] uppercase mb-3"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300, color: "rgba(255,255,255,0.2)" }}>
            Obliveyon
          </p>
          <h1 className="text-2xl sm:text-3xl tracking-[0.25em] uppercase"
            style={{ fontFamily: "var(--font-gothic)", fontWeight: 300, color: "rgba(255,255,255,0.9)", textShadow: "0 0 40px rgba(255,255,255,0.06)" }}>
            Redirecting to Checkout
          </h1>
          <div className="h-px mt-6" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="relative p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 className="text-[11px] tracking-[0.5em] uppercase mb-6"
              style={{ fontFamily: "var(--font-medieval)", fontWeight: 300, color: "rgba(255,255,255,0.35)" }}>
              Order Summary
            </h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, color: "rgba(255,255,255,0.8)" }}>
                      {item.name}
                    </p>
                    <p className="text-[10px] tracking-[0.15em] uppercase mt-0.5"
                      style={{ fontFamily: "var(--font-medieval)", fontWeight: 300, color: "rgba(255,255,255,0.35)" }}>
                      {item.color && `${item.color} · `}Size: {item.size} &middot; Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm" style={{ fontFamily: "var(--font-medieval)", fontWeight: 300, color: "rgba(255,255,255,0.6)" }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-6 mb-4">
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="w-1 h-1 rotate-45" style={{ background: "rgba(255,255,255,0.15)" }} />
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] tracking-[0.3em] uppercase"
                style={{ fontFamily: "var(--font-medieval)", fontWeight: 300, color: "rgba(255,255,255,0.4)" }}>
                Total
              </span>
              <span className="text-lg" style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, color: "rgba(255,255,255,0.9)" }}>
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              const url = buildShopifyCartUrl(items);
              const parsed = new URL(url);
              if (parsed.hostname !== "obliveyon.myshopify.com") return;
              clearCart();
              window.location.href = url;
            }}
            className="w-full py-4 text-sm tracking-[0.5em] uppercase transition-all duration-300 cursor-pointer"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, background: "rgba(255,255,255,0.92)", color: "#060504", border: "1px solid rgba(255,255,255,0.9)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.92)"; }}
          >
            Continue to Shopify Checkout
          </button>

          <p className="text-[10px] tracking-[0.3em] uppercase text-center"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300, color: "rgba(255,255,255,0.25)" }}>
            You will be redirected to Shopify for secure payment
          </p>
        </motion.div>
      </div>
    </div>
  );
}
