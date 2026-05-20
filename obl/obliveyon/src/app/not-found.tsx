import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "#000000", paddingTop: "120px", paddingBottom: "80px" }}
    >
      {/* Top flourish */}
      <div className="flex items-center gap-3 mb-6 opacity-70">
        <div className="h-px w-12 sm:w-20" style={{ background: "rgba(255,255,255,0.18)" }} />
        <svg width="10" height="10" viewBox="0 0 10 10">
          <polygon points="5,0 10,5 5,10 0,5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
        </svg>
        <div className="h-px w-12 sm:w-20" style={{ background: "rgba(255,255,255,0.18)" }} />
      </div>

      <p
        className="text-[10px] sm:text-[11px] tracking-[0.6em] uppercase text-white/30 mb-5"
        style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
      >
        Error 404
      </p>

      <h1
        className="text-5xl sm:text-7xl tracking-[0.04em] uppercase text-white leading-none mb-4"
        style={{
          fontFamily: "var(--font-gothic)",
          fontWeight: 300,
          textShadow: "0 0 30px rgba(255,255,255,0.12), 0 0 80px rgba(255,255,255,0.04)",
        }}
      >
        Lost
        <br />
        in the Dark
      </h1>

      <p
        className="text-sm sm:text-base text-white/55 max-w-md mb-10 leading-relaxed"
        style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
      >
        The page you seek does not exist — or has been forgotten.
      </p>

      <Link
        href="/"
        className="inline-block px-10 py-3.5 text-xs tracking-[0.5em] uppercase transition-all duration-300"
        style={{
          fontFamily: "var(--font-medieval)",
          fontWeight: 400,
          background: "rgba(255,255,255,0.92)",
          color: "#060504",
          border: "1px solid rgba(255,255,255,0.9)",
        }}
      >
        Return Home
      </Link>

      {/* Bottom flourish */}
      <div className="flex items-center gap-3 mt-14 opacity-40">
        <div className="h-px w-12 sm:w-20" style={{ background: "rgba(255,255,255,0.15)" }} />
        <svg width="8" height="8" viewBox="0 0 8 8">
          <polygon points="4,0 8,4 4,8 0,4" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
        </svg>
        <div className="h-px w-12 sm:w-20" style={{ background: "rgba(255,255,255,0.15)" }} />
      </div>
    </div>
  );
}
