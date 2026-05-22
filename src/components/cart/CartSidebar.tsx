"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

// Shopify variant IDs — keyed by "productId|color|size"
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
  "obliveyon-hoodie||S":  48602088440109,
  "obliveyon-hoodie||M":  48602088472877,
  "obliveyon-hoodie||L":  48602088505645,
  "obliveyon-hoodie||XL": 48602088538413,
  // The Obliveyon Hoodie (separate product page) — same SKUs as the original hoodie
  "the-obliveyon-hoodie|Black|S":  48602088440109,
  "the-obliveyon-hoodie|Black|M":  48602088472877,
  "the-obliveyon-hoodie|Black|L":  48602088505645,
  "the-obliveyon-hoodie|Black|XL": 48602088538413,
};


// Shopify CDN image URLs — direct per color
const CART_IMAGES: Record<string, string> = {
  "the-original-obliveyon|White":     "https://cdn.shopify.com/s/files/1/0862/8905/6045/files/FF20555C-61F1-4BDA-BD15-4144F45F1623-removebg-preview.png?v=1730065095",
  "the-original-obliveyon|Acid Wash": "https://cdn.shopify.com/s/files/1/0862/8905/6045/files/24FA5624-E3A8-4833-B6CE-2938ED68ED28-removebg-preview.png?v=1730065055",
  "the-original-obliveyon|Black":     "https://cdn.shopify.com/s/files/1/0862/8905/6045/files/45687B38-77D4-4FEE-AEDE-C87031346143-removebg-preview.png?v=1730065018",
  "obliveyon-hoodie|":                "https://cdn.shopify.com/s/files/1/0862/8905/6045/files/45687B38-77D4-4FEE-AEDE-C87031346143-removebg-preview.png?v=1730065018",
  "the-obliveyon-hoodie|Black":       "https://cdn.shopify.com/s/files/1/0862/8905/6045/files/45687B38-77D4-4FEE-AEDE-C87031346143-removebg-preview.png?v=1730065018",
};

function getCartImage(productId: string, color?: string): string {
  const key = `${productId}|${color ?? ""}`;
  return CART_IMAGES[key] || "";
}

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

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.5)" }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28 }}
            className="fixed right-0 top-0 z-50 flex flex-col"
            style={{
              width: "100%",
              maxWidth: "480px",
              height: "100vh",
              background: "#000",
              borderLeft: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-7 pb-5">
              <h2
                className="text-3xl font-bold tracking-wide"
                style={{ fontFamily: "var(--font-gothic)", color: "#fff" }}
              >
                Your cart
              </h2>
              <button
                onClick={onClose}
                aria-label="Close cart"
                className="cursor-pointer transition-opacity hover:opacity-60"
                style={{ color: "#fff" }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="2" y1="2" x2="20" y2="20" />
                  <line x1="20" y1="2" x2="2" y2="20" />
                </svg>
              </button>
            </div>

            {/* Column headers */}
            <div
              className="flex justify-between px-5 pb-2"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}
            >
              <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-medieval)" }}>Product</span>
              <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-medieval)" }}>Total</span>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <svg className="w-12 h-12" fill="none" stroke="rgba(255,255,255,0.2)" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-sm" style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.3)" }}>
                    Your cart is empty
                  </p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-5 py-7" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      {/* Image */}
                      <div className="flex-shrink-0 w-28 h-36 overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                        <img
                          src={getCartImage(item.productId, item.color)}
                          alt={item.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>

                      {/* Details + controls */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          {/* Vendor */}
                          <p className="text-[11px] tracking-[0.25em] uppercase mb-1" style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.45)" }}>
                            Obliveyon
                          </p>
                          {/* Name */}
                          <p className="text-base font-semibold leading-snug" style={{ fontFamily: "var(--font-gothic)", color: "#fff" }}>
                            {item.name.split("—")[0].trim()}
                          </p>
                          {/* Price */}
                          <p className="text-sm mt-1" style={{ fontFamily: "var(--font-medieval)", color: "#fff" }}>
                            {formatPrice(item.price)}
                          </p>
                          {/* Size */}
                          <p className="text-sm mt-0.5" style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.7)" }}>
                            Size: {item.size}
                          </p>
                          {/* Color */}
                          {item.color && (
                            <p className="text-sm" style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.7)" }}>
                              Color: {item.color}
                            </p>
                          )}
                        </div>

                        {/* Quantity + trash */}
                        <div className="flex items-center gap-4 mt-4">
                          <div
                            className="flex items-center"
                            style={{ border: "1px solid rgba(255,255,255,0.35)", borderRadius: "2px" }}
                          >
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-10 h-10 flex items-center justify-center cursor-pointer transition-colors hover:bg-white/10"
                              style={{ color: "#fff" }}
                            >
                              <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
                                <line x1="0" y1="1" x2="12" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                            </button>
                            <span className="w-9 text-center text-sm select-none" style={{ fontFamily: "var(--font-medieval)", color: "#fff" }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center cursor-pointer transition-colors hover:bg-white/10"
                              style={{ color: "#fff" }}
                            >
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="cursor-pointer transition-opacity hover:opacity-60"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                            aria-label="Remove item"
                          >
                            <svg width="20" height="22" viewBox="0 0 18 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="1 5 17 5" />
                              <path d="M6 5V3a1 1 0 011-1h4a1 1 0 011 1v2" />
                              <rect x="2" y="5" width="14" height="13" rx="1" />
                              <line x1="7" y1="9" x2="7" y2="15" />
                              <line x1="11" y1="9" x2="11" y2="15" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Line total */}
                      <div className="flex-shrink-0 text-right">
                        <span className="text-sm" style={{ fontFamily: "var(--font-medieval)", color: "#fff" }}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 pb-6 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                {/* Subtotal */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-gothic)", color: "#fff" }}>
                    Subtotal
                  </span>
                  <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-gothic)", color: "#fff" }}>
                    {formatPrice(totalPrice)} USD
                  </span>
                </div>
                <p className="text-[11px] mb-5" style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.45)" }}>
                  Tax included and shipping calculated at checkout
                </p>

                {/* Checkout button */}
                <button
                  onClick={() => {
                    const url = buildShopifyCartUrl(items);
                    const parsed = new URL(url);
                    if (parsed.hostname !== "obliveyon.myshopify.com") return;
                    onClose();
                    clearCart();
                    window.location.href = url;
                  }}
                  className="w-full py-4 text-sm tracking-[0.4em] uppercase font-semibold cursor-pointer transition-opacity hover:opacity-90"
                  style={{
                    fontFamily: "var(--font-gothic)",
                    background: "#fff",
                    color: "#000",
                    border: "none",
                    letterSpacing: "0.2em",
                  }}
                >
                  Check Out
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
