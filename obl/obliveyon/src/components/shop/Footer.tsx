"use client";

export default function Footer() {
  return (
    <footer
      className="w-full py-20 text-center"
      style={{ background: "#000000" }}
    >
      {/* Divider */}
      <div className="flex items-center gap-4 mb-12 px-16">
        <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="w-1 h-1 rotate-45" style={{ background: "rgba(255,255,255,0.15)" }} />
        <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>

      <h2
        className="text-2xl tracking-[0.3em] uppercase text-white mb-4"
        style={{
          fontFamily: "var(--font-gothic)",
          fontWeight: 300,
          textShadow: "0 0 30px rgba(255,255,255,0.08)",
        }}
      >
        Obliveyon
      </h2>
      <p
        className="text-[10px] tracking-[0.4em] uppercase text-white/25"
        style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
      >
        Be the light in the darkness.
      </p>
    </footer>
  );
}
