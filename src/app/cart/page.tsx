"use client";

import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-3xl font-bold tracking-[0.15em] uppercase mb-4">Your Cart</h1>
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-[0.15em] uppercase mb-10">Your Cart</h1>

      <div className="flex flex-col gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-6 py-6 border-b border-border"
          >
            <div className="w-24 h-30 bg-bg-secondary rounded-lg flex-shrink-0 overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
                  {item.name}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium">{item.name}</h3>
              <p className="text-xs text-text-muted mt-1">Size: {item.size}</p>
              <p className="text-sm mt-2">{formatPrice(item.price)}</p>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center border border-border rounded hover:border-border-hover transition-colors text-sm"
                  >
                    −
                  </button>
                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border border-border rounded hover:border-border-hover transition-colors text-sm"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-text-muted hover:text-white transition-colors ml-auto"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="text-sm font-medium">
              {formatPrice(item.price * item.quantity)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-10 flex flex-col items-end gap-4">
        <div className="w-full max-w-xs">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-sm text-text-secondary">Subtotal</span>
            <span className="text-sm font-medium">{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-sm text-text-secondary">Shipping</span>
            <span className="text-xs text-text-muted">Calculated at checkout</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-medium">Total</span>
            <span className="text-lg font-bold">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        <Link
          href="/checkout"
          className="w-full max-w-xs block text-center bg-white text-black py-3.5 text-sm font-medium tracking-wider uppercase hover:bg-accent-dim transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
