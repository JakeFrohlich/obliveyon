"use client";

import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

// Shopify variant IDs — keyed by "productId|color|size". Kept in sync with CartSidebar.
const SHOPIFY_VARIANTS: Record<string, number> = {
  "the-original-obliveyon|White|S":      50142432854317,
  "the-original-obliveyon|White|M":      50142432952621,
  "the-original-obliveyon|White|L":      50142433050925,
  "the-original-obliveyon|White|XL":     50142433149229,
  "the-original-obliveyon|Acid Wash|S":  50142432887085,
  "the-original-obliveyon|Acid Wash|M":  50142432985389,
  "the-original-obliveyon|Acid Wash|L":  50142433083693,
  "the-original-obliveyon|Acid Wash|XL": 50142433181997,
  "the-original-obliveyon|Black|S":      50142432919853,
  "the-original-obliveyon|Black|M":      50142433018157,
  "the-original-obliveyon|Black|L":      50142433116461,
  "the-original-obliveyon|Black|XL":     50142433214765,
  "the-obliveyon-hoodie||S":  48602088440109,
  "the-obliveyon-hoodie||M":  48602088472877,
  "the-obliveyon-hoodie||L":  48602088505645,
  "the-obliveyon-hoodie||XL": 48602088538413,
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

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: "#000000", paddingTop: "120px", paddingBottom: "80px" }}
      >
        <p
          className="text-[10px] tracking-[0.5em] uppercase text-white/30 mb-4"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
        >
          Obliveyon
        </p>
        <h1
          className="text-3xl sm:text-4xl tracking-[0.2em] uppercase text-white mb-4"
          style={{ fontFamily: "var(--font-gothic)", fontWeight: 300 }}
        >
          Your Cart
        </h1>
        <p
          className="text-sm text-white/45 mb-10"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
        >
          Your cart is empty.
        </p>
        <Link
          href="/shop"
          className="inline-block px-10 py-3.5 text-xs tracking-[0.5em] uppercase transition-all duration-300"
          style={{
            fontFamily: "var(--font-medieval)",
            fontWeight: 400,
            background: "rgba(255,255,255,0.92)",
            color: "#060504",
            border: "1px solid rgba(255,255,255,0.9)",
          }}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 sm:px-8 lg:px-12" style={{ background: "#000000", paddingTop: "120px", paddingBottom: "80px" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="text-[10px] tracking-[0.5em] uppercase text-white/30 mb-3"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
          >
            Obliveyon
          </p>
          <h1
            className="text-3xl sm:text-4xl tracking-[0.2em] uppercase text-white"
            style={{ fontFamily: "var(--font-gothic)", fontWeight: 300, textShadow: "0 0 40px rgba(255,255,255,0.06)" }}
          >
            Your Cart
          </h1>
          <div className="h-px mt-6 max-w-md mx-auto" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Items */}
        <div className="flex flex-col">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-4 sm:gap-6 py-6"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Image */}
              <div
                className="flex-shrink-0 w-20 h-28 sm:w-24 sm:h-32 overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full" style={{ background: "rgba(255,255,255,0.04)" }} />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <p
                    className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-1"
                    style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
                  >
                    Obliveyon
                  </p>
                  <p
                    className="text-sm sm:text-base text-white leading-snug"
                    style={{ fontFamily: "var(--font-gothic)", fontWeight: 400 }}
                  >
                    {item.name.split("—")[0].trim()}
                  </p>
                  <p
                    className="text-xs sm:text-sm text-white/70 mt-1 tabular-nums"
                    style={{ fontFamily: "var(--font-medieval)", fontWeight: 400 }}
                  >
                    {formatPrice(item.price)}
                  </p>
                  <p
                    className="text-[11px] tracking-[0.15em] uppercase text-white/55 mt-1"
                    style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
                  >
                    Size: {item.size}
                    {item.color && ` · ${item.color}`}
                  </p>
                </div>

                {/* Qty + remove */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center" style={{ border: "1px solid rgba(255,255,255,0.25)" }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center cursor-pointer transition-colors hover:bg-white/10"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      −
                    </button>
                    <span
                      className="w-8 text-center text-sm tabular-nums"
                      style={{ fontFamily: "var(--font-medieval)", color: "#fff" }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center cursor-pointer transition-colors hover:bg-white/10"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[10px] tracking-[0.3em] uppercase cursor-pointer transition-colors duration-300"
                    style={{ fontFamily: "var(--font-medieval)", fontWeight: 300, color: "rgba(255,255,255,0.4)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.9)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Line total */}
              <div className="flex-shrink-0 text-right">
                <span
                  className="text-sm sm:text-base text-white tabular-nums"
                  style={{ fontFamily: "var(--font-medieval)", fontWeight: 500 }}
                >
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-10 flex flex-col items-end gap-4">
          <div className="w-full max-w-xs">
            <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="text-[11px] tracking-[0.35em] uppercase text-white/55" style={{ fontFamily: "var(--font-medieval)" }}>Subtotal</span>
              <span className="text-sm text-white tabular-nums" style={{ fontFamily: "var(--font-medieval)", fontWeight: 500 }}>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="text-[11px] tracking-[0.35em] uppercase text-white/55" style={{ fontFamily: "var(--font-medieval)" }}>Shipping</span>
              <span className="text-[11px] tracking-[0.15em] uppercase text-white/70" style={{ fontFamily: "var(--font-medieval)", fontWeight: 400 }}>Free (US)</span>
            </div>
            <div className="flex items-center justify-between py-4">
              <span className="text-[11px] tracking-[0.35em] uppercase text-white/85" style={{ fontFamily: "var(--font-medieval)", fontWeight: 500 }}>Total</span>
              <span className="text-lg text-white tabular-nums" style={{ fontFamily: "var(--font-medieval)", fontWeight: 500 }}>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <button
            onClick={() => {
              window.location.href = buildShopifyCartUrl(items);
            }}
            className="w-full max-w-xs block text-center py-4 text-xs tracking-[0.5em] uppercase transition-all duration-300 cursor-pointer"
            style={{
              fontFamily: "var(--font-medieval)",
              fontWeight: 400,
              background: "rgba(255,255,255,0.92)",
              color: "#060504",
              border: "1px solid rgba(255,255,255,0.9)",
              boxShadow: "0 0 20px rgba(255,255,255,0.06)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.92)"; }}
          >
            Check Out
          </button>
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-white/30 text-center w-full max-w-xs"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
          >
            Secure payment via Shopify
          </p>
        </div>
      </div>
    </div>
  );
}
