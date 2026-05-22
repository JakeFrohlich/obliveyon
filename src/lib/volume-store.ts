"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "obliveyon-volume";

let volume = 0;
const listeners = new Set<() => void>();

function load(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return 0;
  const n = Number(raw);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

if (typeof window !== "undefined") {
  volume = load();

  // Cross-tab sync: if user changes volume in another tab, mirror it here
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      const next = load();
      if (next !== volume) {
        volume = next;
        listeners.forEach((l) => l());
      }
    }
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return volume;
}

function getServerSnapshot() {
  return 0;
}

export function setVolume(next: number) {
  const clamped = Math.max(0, Math.min(100, Math.round(next)));
  if (clamped === volume) return;
  volume = clamped;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, String(clamped));
  }
  listeners.forEach((l) => l());
}

export function useVolume(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
