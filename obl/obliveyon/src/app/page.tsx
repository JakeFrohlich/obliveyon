"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/The real sword press play.mp4" type="video/mp4" />
      </video>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Menu */}
      <div className="relative z-10 flex flex-col items-center gap-3">

        {/* PRESS PLAY */}
        <button
          onClick={() => router.push("/shop")}
          className="group cursor-pointer relative mb-2"
          style={{ animation: "breathe 4s ease-in-out infinite" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.4) drop-shadow(0 0 20px rgba(255,255,255,0.15))";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1)";
          }}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 80" preserveAspectRatio="none" style={{ overflow: "visible" }}>
            <defs>
              <filter id="glow-main">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g filter="url(#glow-main)">
              {/* Full border — continuous thin line */}
              <rect x="1" y="1" width="338" height="78" rx="1" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
              {/* Outer accent corners — thick bright */}
              <line x1="-4" y1="0" x2="35" y2="0" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
              <line x1="0" y1="-4" x2="0" y2="28" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
              <line x1="344" y1="0" x2="305" y2="0" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
              <line x1="340" y1="-4" x2="340" y2="28" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
              <line x1="-4" y1="80" x2="35" y2="80" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
              <line x1="0" y1="84" x2="0" y2="52" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
              <line x1="344" y1="80" x2="305" y2="80" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
              <line x1="340" y1="84" x2="340" y2="52" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
              {/* Inner corner details */}
              <line x1="6" y1="6" x2="20" y2="6" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
              <line x1="6" y1="6" x2="6" y2="16" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
              <line x1="334" y1="6" x2="320" y2="6" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
              <line x1="334" y1="6" x2="334" y2="16" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
              <line x1="6" y1="74" x2="20" y2="74" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
              <line x1="6" y1="74" x2="6" y2="64" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
              <line x1="334" y1="74" x2="320" y2="74" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
              <line x1="334" y1="74" x2="334" y2="64" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
              {/* Top center — sword cross ornament */}
              <line x1="170" y1="-8" x2="170" y2="8" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
              <line x1="162" y1="0" x2="178" y2="0" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
              <circle cx="170" cy="0" r="2" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
              {/* Bottom center — sword cross ornament */}
              <line x1="170" y1="72" x2="170" y2="88" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
              <line x1="162" y1="80" x2="178" y2="80" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
              <circle cx="170" cy="80" r="2" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
              {/* Side ornaments — small diamonds */}
              <polygon points="0,40 -4,44 0,48 4,44" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
              <polygon points="340,40 336,44 340,48 344,44" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
              {/* Horizontal filigree lines */}
              <line x1="40" y1="0" x2="130" y2="0" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />
              <line x1="210" y1="0" x2="300" y2="0" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />
              <line x1="40" y1="80" x2="130" y2="80" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />
              <line x1="210" y1="80" x2="300" y2="80" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />
            </g>
          </svg>
          <span
            className="block px-8 sm:px-16 py-5 sm:py-6 text-xl sm:text-3xl tracking-[0.35em] sm:tracking-[0.5em] uppercase text-white relative z-10"
            style={{
              fontFamily: "var(--font-gothic)",
              fontWeight: 500,
              textShadow: "0 0 10px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.4), 0 0 60px rgba(255,255,255,0.2), 0 4px 20px rgba(0,0,0,1)",
              animation: "textGlow 4s ease-in-out infinite",
              WebkitTextStroke: "0.3px rgba(255,255,255,0.9)",
            }}
          >
            Press Play
          </span>
        </button>

        {/* SETTINGS */}
        <button
          onClick={() => router.push("/settings")}
          className="group cursor-pointer relative"
          style={{ transition: "filter 0.4s ease" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1)";
          }}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 220 48" preserveAspectRatio="none">
            <g filter="url(#glow-sm)">
              <defs>
                <filter id="glow-sm">
                  <feGaussianBlur stdDeviation="1" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <line x1="0" y1="1" x2="22" y2="1" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <line x1="1" y1="0" x2="1" y2="15" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <circle cx="4" cy="4" r="0.8" fill="rgba(255,255,255,0.3)" />
              <line x1="220" y1="1" x2="198" y2="1" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <line x1="219" y1="0" x2="219" y2="15" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <circle cx="216" cy="4" r="0.8" fill="rgba(255,255,255,0.3)" />
              <line x1="0" y1="47" x2="22" y2="47" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <line x1="1" y1="48" x2="1" y2="33" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <circle cx="4" cy="44" r="0.8" fill="rgba(255,255,255,0.3)" />
              <line x1="220" y1="47" x2="198" y2="47" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <line x1="219" y1="48" x2="219" y2="33" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <circle cx="216" cy="44" r="0.8" fill="rgba(255,255,255,0.3)" />
              <line x1="50" y1="1" x2="170" y2="1" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />
              <line x1="50" y1="47" x2="170" y2="47" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />
            </g>
          </svg>
          <span
            className="block px-8 sm:px-12 py-3 text-sm sm:text-lg tracking-[0.35em] sm:tracking-[0.5em] uppercase text-white/90 relative z-10"
            style={{
              fontFamily: "var(--font-medieval)",
              fontWeight: 400,
              textShadow: "0 0 8px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.2), 0 4px 15px rgba(0,0,0,1)",
            }}
          >
            Settings
          </span>
        </button>

        {/* CREDITS */}
        <button
          onClick={() => router.push("/credits")}
          className="group cursor-pointer relative"
          style={{ transition: "filter 0.4s ease" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(1)";
          }}
        >
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 220 48" preserveAspectRatio="none">
            <g filter="url(#glow-sm2)">
              <defs>
                <filter id="glow-sm2">
                  <feGaussianBlur stdDeviation="1" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <line x1="0" y1="1" x2="22" y2="1" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <line x1="1" y1="0" x2="1" y2="15" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <circle cx="4" cy="4" r="0.8" fill="rgba(255,255,255,0.3)" />
              <line x1="220" y1="1" x2="198" y2="1" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <line x1="219" y1="0" x2="219" y2="15" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <circle cx="216" cy="4" r="0.8" fill="rgba(255,255,255,0.3)" />
              <line x1="0" y1="47" x2="22" y2="47" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <line x1="1" y1="48" x2="1" y2="33" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <circle cx="4" cy="44" r="0.8" fill="rgba(255,255,255,0.3)" />
              <line x1="220" y1="47" x2="198" y2="47" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <line x1="219" y1="48" x2="219" y2="33" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <circle cx="216" cy="44" r="0.8" fill="rgba(255,255,255,0.3)" />
              <line x1="50" y1="1" x2="170" y2="1" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />
              <line x1="50" y1="47" x2="170" y2="47" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />
            </g>
          </svg>
          <span
            className="block px-8 sm:px-12 py-3 text-sm sm:text-lg tracking-[0.35em] sm:tracking-[0.5em] uppercase text-white/90 relative z-10"
            style={{
              fontFamily: "var(--font-medieval)",
              fontWeight: 400,
              textShadow: "0 0 8px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.2), 0 4px 15px rgba(0,0,0,1)",
            }}
          >
            Credits
          </span>
        </button>
      </div>

      <style jsx>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        @keyframes textGlow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(255,255,255,0.4), 0 0 30px rgba(255,255,255,0.2), 0 0 60px rgba(255,255,255,0.1), 0 2px 20px rgba(0,0,0,0.8);
          }
          50% {
            text-shadow: 0 0 15px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4), 0 0 80px rgba(255,255,255,0.2), 0 0 120px rgba(255,255,255,0.08), 0 2px 20px rgba(0,0,0,0.8);
          }
        }
      `}</style>
    </div>
  );
}
