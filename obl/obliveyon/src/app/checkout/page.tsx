"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setError("Please sign in to checkout");
        } else {
          setError(data.error || "Checkout failed");
        }
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-3xl font-bold tracking-[0.15em] uppercase mb-4">Checkout</h1>
        <p className="text-text-secondary text-sm mb-8">Your cart is empty</p>
        <Link
          href="/shop"
          className="inline-block px-8 py-3 bg-white text-black text-sm font-medium tracking-wider uppercase hover:bg-accent-dim transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-[0.15em] uppercase mb-10">Checkout</h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Order Summary */}
        <div className="bg-bg-secondary border border-border p-6">
          <h2 className="text-xs font-medium tracking-[0.2em] uppercase text-text-muted mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm">{item.name}</p>
                  <p className="text-xs text-text-muted">
                    Size: {item.size} &middot; Qty: {item.quantity}
                  </p>
                </div>
                <span className="text-sm">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border mt-6 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total</span>
              <span className="text-lg font-bold">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 p-3">
            {error}
            {error.includes("sign in") && (
              <Link href="/login" className="ml-2 underline">
                Sign in
              </Link>
            )}
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-white text-black py-4 text-sm font-medium tracking-[0.2em] uppercase hover:bg-accent-dim transition-colors disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay with Stripe"}
        </button>

        <p className="text-xs text-text-muted text-center">
          You&apos;ll be redirected to Stripe for secure payment
        </p>
      </motion.div>
    </div>
  );
}
