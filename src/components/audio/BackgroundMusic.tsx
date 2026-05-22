"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useVolume } from "@/lib/volume-store";

const SRC = "/Maruex.mp3";

export default function BackgroundMusic() {
  const pathname = usePathname();
  const volume = useVolume();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Don't mount the audio element on admin pages
  const enabled = !pathname.startsWith("/admin");

  // Sync HTMLAudioElement volume with the store
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume / 100;
  }, [volume]);

  // Try to play (or pause when volume hits 0) whenever volume changes
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (volume > 0) {
      a.play().catch(() => {
        // Autoplay blocked — will retry on first user interaction (handled below)
      });
    } else {
      a.pause();
    }
  }, [volume]);

  // Pause when tab hidden, resume when visible (only if volume > 0)
  useEffect(() => {
    if (!enabled) return;
    function onVisibility() {
      const a = audioRef.current;
      if (!a) return;
      if (document.visibilityState === "hidden") {
        a.pause();
      } else if (volume > 0) {
        a.play().catch(() => {});
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [enabled, volume]);

  // Resume on bfcache restore (back from Shopify, etc.)
  useEffect(() => {
    if (!enabled) return;
    function onPageShow(e: PageTransitionEvent) {
      if (!e.persisted) return;
      const a = audioRef.current;
      if (!a) return;
      if (volume > 0) a.play().catch(() => {});
    }
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [enabled, volume]);

  // Retry play after first user interaction if autoplay was blocked
  useEffect(() => {
    if (!enabled) return;
    function tryPlay() {
      const a = audioRef.current;
      if (!a) return;
      if (volume > 0 && a.paused) {
        a.play().catch(() => {});
      }
    }
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart"];
    events.forEach((e) => window.addEventListener(e, tryPlay, { once: false, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, tryPlay));
  }, [enabled, volume]);

  if (!enabled) return null;

  return (
    <audio
      ref={audioRef}
      src={SRC}
      loop
      preload="auto"
      // Initial muted state via volume=0 keeps autoplay attempt consistent across browsers
    />
  );
}
