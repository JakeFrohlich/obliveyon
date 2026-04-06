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
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#000000" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        {/* Ornate confirmation symbol */}
        <div className="flex justify-center mb-8">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <polygon points="32,2 62,32 32,62 2,32" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
            <polygon points="32,10 54,32 32,54 10,32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
            <path d="M22 32L29 39L42 26" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="32" cy="2" r="1.5" fill="rgba(255,255,255,0.3)" />
            <circle cx="62" cy="32" r="1.5" fill="rgba(255,255,255,0.3)" />
            <circle cx="32" cy="62" r="1.5" fill="rgba(255,255,255,0.3)" />
            <circle cx="2" cy="32" r="1.5" fill="rgba(255,255,255,0.3)" />
          </svg>
        </div>

        <h1
          className="text-3xl sm:text-4xl tracking-[0.15em] uppercase mb-4"
          style={{
            fontFamily: "var(--font-gothic)",
            fontWeight: 300,
            color: "rgba(255,255,255,0.9)",
            textShadow: "0 0 20px rgba(255,255,255,0.1), 0 0 60px rgba(255,255,255,0.04)",
          }}
        >
          Order Confirmed
        </h1>

        <p
          className="text-sm mb-10"
          style={{
            fontFamily: "var(--font-medieval)",
            fontWeight: 300,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.04em",
          }}
        >
          Thank you for your purchase. You&apos;ll receive a confirmation email shortly.
        </p>

        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="w-1 h-1 rotate-45" style={{ background: "rgba(255,255,255,0.2)" }} />
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/profile"
            className="px-8 py-3 text-sm tracking-[0.3em] uppercase transition-all duration-300"
            style={{
              fontFamily: "var(--font-medieval)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
              e.currentTarget.style.color = "rgba(255,255,255,0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            }}
          >
            View Orders
          </Link>
          <Link
            href="/shop"
            className="px-8 py-3 text-sm tracking-[0.5em] uppercase transition-all duration-300"
            style={{
              fontFamily: "var(--font-medieval)",
              fontWeight: 400,
              background: "rgba(255,255,255,0.92)",
              color: "#060504",
              border: "1px solid rgba(255,255,255,0.9)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,1)";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.92)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
