"use client";

import { useSyncExternalStore, useCallback } from "react";
import type { CartItem } from "@/types";

let cart: CartItem[] = [];
const listeners = new Set<() => void>();

function emitChange() {
  if (typeof window !== "undefined") {
    localStorage.setItem("obliveyon-cart", JSON.stringify(cart));
  }
  listeners.forEach((l) => l());
}

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("obliveyon-cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): CartItem[] {
  return cart;
}

const EMPTY_CART: CartItem[] = [];
function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

if (typeof window !== "undefined") {
  cart = loadCart();

  // Re-sync from localStorage when the page is restored from bfcache
  // (e.g. user clicks back from Shopify checkout). Without this, the cart
  // store can desync from reality and the navbar Cart button stops responding.
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      cart = loadCart();
      listeners.forEach((l) => l());
    }
  });
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = useCallback((item: Omit<CartItem, "id">) => {
    const existing = cart.find(
      (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
    );
    if (existing) {
      cart = cart.map((i) =>
        i.productId === item.productId && i.size === item.size && i.color === item.color
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      cart = [...cart, { ...item, id: crypto.randomUUID() }];
    }
    emitChange();
  }, []);

  const removeItem = useCallback((id: string) => {
    cart = cart.filter((i) => i.id !== id);
    emitChange();
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      cart = cart.filter((i) => i.id !== id);
    } else {
      cart = cart.map((i) => (i.id === id ? { ...i, quantity } : i));
    }
    emitChange();
  }, []);

  const clearCart = useCallback(() => {
    cart = [];
    emitChange();
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };
}
