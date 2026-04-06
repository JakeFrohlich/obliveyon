"use client";

interface CandleFlameProps {
  side: "left" | "right";
}

export default function CandleFlame({ side }: CandleFlameProps) {
  const id = side;

  return (
    <div className="pointer-events-none" style={{ width: 90 }}>
      <svg
        viewBox="0 0 90 340"
        width="90"
        height="340"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Flame gradient */}
          <radialGradient id={`${id}-flame-outer`} cx="50%" cy="80%" r="50%">
            <stop offset="0%" stopColor="#fff8c0" stopOpacity="1" />
            <stop offset="30%" stopColor="#ffcc44" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#ff8800" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#cc3300" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-flame-inner`} cx="50%" cy="90%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="40%" stopColor="#fffde0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffdd55" stopOpacity="0" />
          </radialGradient>
          {/* Glow */}
          <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffcc44" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ff8800" stopOpacity="0" />
          </radialGradient>
          {/* Glass panel gradient */}
          <linearGradient id={`${id}-glass`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#aaccff" stopOpacity="0.04" />
            <stop offset="40%" stopColor="#eef4ff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#aaccff" stopOpacity="0.03" />
          </linearGradient>
          {/* Candle wax gradient */}
          <linearGradient id={`${id}-wax`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c8b88a" stopOpacity="1" />
            <stop offset="30%" stopColor="#e0d0a8" stopOpacity="1" />
            <stop offset="70%" stopColor="#d4c090" stopOpacity="1" />
            <stop offset="100%" stopColor="#b0a070" stopOpacity="1" />
          </linearGradient>
          {/* Metal gradient */}
          <linearGradient id={`${id}-metal`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2a2820" />
            <stop offset="30%" stopColor="#504840" />
            <stop offset="60%" stopColor="#3a3428" />
            <stop offset="100%" stopColor="#1e1c16" />
          </linearGradient>
          <linearGradient id={`${id}-metal-h`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5a5040" />
            <stop offset="50%" stopColor="#3a3428" />
            <stop offset="100%" stopColor="#1e1c16" />
          </linearGradient>
          {/* Drop shadow filter */}
          <filter id={`${id}-shadow`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.7" />
          </filter>
          <filter id={`${id}-glow-filter`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── CHAIN ── */}
        {[0, 10, 20, 30, 40].map((y) => (
          <g key={y} transform={`translate(45, ${y})`}>
            {/* Oval chain link */}
            <ellipse cx="0" cy="0" rx="3.5" ry="5.5" fill="none" stroke={`url(#${id}-metal)`} strokeWidth="2.2" />
          </g>
        ))}

        {/* ── LANTERN CAP / CROWN ── */}
        <g transform="translate(45, 55)" filter={`url(#${id}-shadow)`}>
          {/* Decorative finial on top */}
          <circle cx="0" cy="-14" r="4" fill={`url(#${id}-metal-h)`} />
          <circle cx="0" cy="-14" r="2" fill="#6a5e44" />
          {/* Crown ring */}
          <ellipse cx="0" cy="-8" rx="20" ry="4" fill={`url(#${id}-metal-h)`} />
          {/* Cap pyramid shape */}
          <polygon points="-20,-8 20,-8 14,10 -14,10" fill={`url(#${id}-metal-h)`} />
          {/* Cap ridges */}
          <line x1="-10" y1="-4" x2="-7" y2="10" stroke="#1a1810" strokeWidth="1.2" />
          <line x1="0" y1="-6" x2="0" y2="10" stroke="#1a1810" strokeWidth="1.2" />
          <line x1="10" y1="-4" x2="7" y2="10" stroke="#1a1810" strokeWidth="1.2" />
          {/* Bottom ring of cap */}
          <rect x="-14" y="9" width="28" height="4" rx="1" fill={`url(#${id}-metal)`} />
        </g>

        {/* ── LANTERN BODY ── */}
        <g transform="translate(45, 110)" filter={`url(#${id}-shadow)`}>

          {/* Ambient glow behind glass */}
          <ellipse cx="0" cy="50" rx="38" ry="55"
            fill={`url(#${id}-glow)`}
            style={{ animation: "flameGlow 2.5s ease-in-out infinite" }}
          />

          {/* Glass panels (4 sides — front visible) */}
          {/* Back panel (darkest) */}
          <rect x="-22" y="0" width="44" height="100" rx="2"
            fill="#080808" fillOpacity="0.7"
            stroke={`url(#${id}-metal)`} strokeWidth="1"
          />
          {/* Side panels */}
          <rect x="-28" y="0" width="10" height="100" rx="1"
            fill={`url(#${id}-glass)`}
            stroke={`url(#${id}-metal)`} strokeWidth="0.8"
          />
          <rect x="18" y="0" width="10" height="100" rx="1"
            fill={`url(#${id}-glass)`}
            stroke={`url(#${id}-metal)`} strokeWidth="0.8"
          />
          {/* Front glass panel */}
          <rect x="-22" y="0" width="44" height="100" rx="2"
            fill={`url(#${id}-glass)`}
            stroke="none"
          />

          {/* Vertical corner bars */}
          {[-22, 22].map((x) => (
            <rect key={x} x={x - 2.5} y="-2" width="5" height="104" rx="2"
              fill={`url(#${id}-metal)`}
              stroke="#0d0c09" strokeWidth="0.5"
            />
          ))}
          {[-28, 18].map((x) => (
            <rect key={x} x={x - 2} y="-2" width="4" height="104" rx="2"
              fill={`url(#${id}-metal)`}
            />
          ))}

          {/* Horizontal divider bands */}
          {[0, 33, 66, 100].map((y) => (
            <rect key={y} x="-30" y={y - 2} width="60" height="4" rx="1"
              fill={`url(#${id}-metal)`}
              stroke="#0d0c09" strokeWidth="0.5"
            />
          ))}

          {/* Decorative cross bar in middle */}
          <rect x="-30" y="47" width="60" height="6" rx="1"
            fill={`url(#${id}-metal)`}
          />
          {/* Small decorative diamonds at corners of middle band */}
          {[-22, 22].map((x) => (
            <rect key={x} x={x - 4} y="47" width="8" height="6"
              fill={`url(#${id}-metal-h)`}
              rx="1"
            />
          ))}

          {/* ── CANDLE INSIDE ── */}
          {/* Wax pool */}
          <ellipse cx="0" cy="62" rx="7" ry="2.5" fill="#d8c898" fillOpacity="0.9" />
          {/* Candle body */}
          <rect x="-6" y="62" width="12" height="36" rx="1"
            fill={`url(#${id}-wax)`}
          />
          {/* Candle highlight */}
          <rect x="-3" y="64" width="3" height="30" rx="1"
            fill="#f0e4c0" fillOpacity="0.3"
          />
          {/* Wax drip left */}
          <path d="M -6,68 Q -9,72 -7,78 L -6,78 Z"
            fill="#d8c898" fillOpacity="0.8"
          />
          {/* Wax drip right */}
          <path d="M 6,71 Q 9,76 7,82 L 6,82 Z"
            fill="#d8c898" fillOpacity="0.7"
          />
          {/* Wick */}
          <line x1="0" y1="58" x2="1" y2="63"
            stroke="#2a2010" strokeWidth="1.2" strokeLinecap="round"
          />

          {/* ── FLAME ── */}
          <g style={{ animation: "flicker 1.8s ease-in-out infinite", transformOrigin: "0px 60px" }}>
            {/* Outer flame */}
            <path d="M 0,32 C -8,40 -10,50 -6,58 C -3,63 3,63 6,58 C 10,50 8,40 0,32 Z"
              fill={`url(#${id}-flame-outer)`}
              filter={`url(#${id}-glow-filter)`}
            />
            {/* Mid flame */}
            <path d="M 0,38 C -5,44 -6,52 -3,58 C -1.5,62 1.5,62 3,58 C 6,52 5,44 0,38 Z"
              fill={`url(#${id}-flame-outer)`}
            />
            {/* Inner bright core */}
            <path d="M 0,46 C -2.5,50 -2.5,55 -1,58 C -0.5,60 0.5,60 1,58 C 2.5,55 2.5,50 0,46 Z"
              fill={`url(#${id}-flame-inner)`}
            />
          </g>

          {/* Bottom base plate */}
          <rect x="-30" y="98" width="60" height="6" rx="2"
            fill={`url(#${id}-metal)`}
          />

          {/* Decorative bottom ring */}
          <ellipse cx="0" cy="104" rx="28" ry="4"
            fill={`url(#${id}-metal-h)`}
          />

          {/* Bottom hanging ornament */}
          <line x1="0" y1="108" x2="0" y2="118"
            stroke={`url(#${id}-metal)`} strokeWidth="2.5"
          />
          <circle cx="0" cy="122" r="5"
            fill={`url(#${id}-metal-h)`}
            stroke="#0d0c09" strokeWidth="0.8"
          />
          <circle cx="0" cy="122" r="2.5"
            fill="#1e1c16"
          />
        </g>
      </svg>
    </div>
  );
}
