"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVolume, setVolume } from "@/lib/volume-store";

interface SliderProps {
  label: string;
  description: string;
  value: number;
  onChange: (val: number) => void;
}

function Slider({ label, description, value, onChange }: SliderProps) {
  return (
    <div className="py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p
            className="text-sm tracking-[0.3em] uppercase text-white/90"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 400 }}
          >
            {label}
          </p>
          <p
            className="text-[10px] tracking-wider text-white/30 mt-1"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
          >
            {description}
          </p>
        </div>
        <span
          className="text-xs tracking-widest text-white/50"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
        >
          {value}%
        </span>
      </div>
      <div className="relative w-full h-6 flex items-center">
        {/* Track background */}
        <div
          className="absolute w-full h-[2px]"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
        {/* Filled track */}
        <div
          className="absolute h-[2px]"
          style={{
            width: `${value}%`,
            background: "linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.5))",
            boxShadow: "0 0 8px rgba(255,255,255,0.1)",
          }}
        />
        {/* Native range input styled transparent, controls the value */}
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-6 cursor-pointer opacity-0 z-10"
        />
        {/* Custom thumb */}
        <div
          className="absolute w-3 h-3 pointer-events-none"
          style={{
            left: `calc(${value}% - 6px)`,
            background: "rgba(255,255,255,0.85)",
            boxShadow: "0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.4)",
            transition: "box-shadow 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsInner />
    </Suspense>
  );
}

function SettingsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const volume = useVolume();

  const returnPath = searchParams.get("from") === "/" ? "/" : "/shop";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden select-none">
      {/* Back button — top left */}
      <button
        onClick={() => router.push(returnPath)}
        className="fixed top-6 left-6 z-20 text-[11px] tracking-[0.4em] uppercase transition-colors duration-300 cursor-pointer"
        style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, color: "rgba(255,255,255,0.85)", textShadow: "0 0 12px rgba(0,0,0,0.9)" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,1)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
      >
        ← Return
      </button>

      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.5 }}
      >
        <source src="/background of settings.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg px-6">

        {/* Title with ornate frame */}
        <div className="relative mb-10">
          <svg className="absolute -left-4 -top-3 w-[calc(100%+32px)] h-[calc(100%+24px)]" viewBox="0 0 500 60" preserveAspectRatio="none" style={{ overflow: "visible" }}>
            <defs>
              <filter id="set-glow">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g filter="url(#set-glow)">
              {/* Left ornament */}
              <line x1="0" y1="30" x2="140" y2="30" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
              {/* Right ornament */}
              <line x1="360" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
              {/* Center diamond */}
              <polygon points="250,22 254,30 250,38 246,30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
            </g>
          </svg>
          <h1
            className="text-2xl sm:text-3xl tracking-[0.5em] uppercase text-white text-center"
            style={{
              fontFamily: "var(--font-gothic)",
              fontWeight: 300,
              textShadow: "0 0 10px rgba(255,255,255,0.5), 0 0 30px rgba(255,255,255,0.2), 0 4px 20px rgba(0,0,0,1)",
            }}
          >
            Settings
          </h1>
        </div>

        {/* Settings panel */}
        <div
          className="p-6 sm:p-8"
          style={{
            background: "rgba(6,5,4,0.5)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 60px rgba(0,0,0,0.4)",
          }}
        >
          <Slider
            label="Sound"
            description="Background music and ambient effects"
            value={volume}
            onChange={setVolume}
          />
        </div>

      </div>
    </div>
  );
}
