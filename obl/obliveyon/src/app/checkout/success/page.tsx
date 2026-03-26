"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useCart } from "@/hooks/use-cart";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold tracking-[0.15em] uppercase mb-4">
          Order Confirmed
        </h1>
        <p className="text-text-secondary text-sm mb-8">
          Thank you for your purchase. You&apos;ll receive a confirmation email shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/profile"
            className="px-8 py-3 border border-border text-sm tracking-wider uppercase hover:border-white transition-colors"
          >
            View Orders
          </Link>
          <Link
            href="/shop"
            className="px-8 py-3 bg-white text-black text-sm font-medium tracking-wider uppercase hover:bg-accent-dim transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
