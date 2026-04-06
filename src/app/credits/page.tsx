"use client";

import { useRouter } from "next/navigation";

export default function CreditsPage() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto select-none">
      {/* Back button — top left, always visible */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-6 left-6 z-20 text-[11px] tracking-[0.4em] uppercase transition-colors duration-300 cursor-pointer"
        style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, color: "rgba(255,255,255,0.85)", textShadow: "0 0 12px rgba(0,0,0,0.9)" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,1)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
      >
        ← Return
      </button>

      {/* Video background — reuse sword video, feels right for credits */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover"
        style={{ opacity: 0.35 }}
      >
        <source src="/The real sword press play.mp4" type="video/mp4" />
      </video>

      {/* Deep dark overlay */}
      <div
        className="fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center max-w-xl px-8 text-center mx-auto py-24"
        style={{ animation: "fadeUp 1.6s ease both" }}
      >
        {/* Title ornament */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span
            className="text-[9px] tracking-[0.6em] uppercase text-white/30"
            style={{ fontFamily: "var(--font-medieval)" }}
          >
            Credits
          </span>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Brand name */}
        <h1
          className="text-4xl sm:text-5xl tracking-[0.3em] uppercase text-white mb-2"
          style={{
            fontFamily: "var(--font-gothic)",
            fontWeight: 300,
            textShadow:
              "0 0 10px rgba(255,255,255,0.4), 0 0 40px rgba(255,255,255,0.15), 0 4px 20px rgba(0,0,0,1)",
          }}
        >
          Obliveyon
        </h1>
        <p
          className="text-[10px] tracking-[0.5em] uppercase text-white/30 mb-16"
          style={{ fontFamily: "var(--font-medieval)" }}
        >
          A database of one.
        </p>

        {/* Body copy */}
        <div className="flex flex-col gap-7">
          <p
            className="text-sm sm:text-base leading-loose text-white/60 text-center"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300, letterSpacing: "0.04em" }}
          >
            Obliveyon is a reflection of oneself.
          </p>

          <p
            className="text-sm sm:text-base leading-loose text-white/50 text-center"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300, letterSpacing: "0.04em" }}
          >
            Everything here is an honest attempt at one&apos;s inner reflection — the
            aesthetic, the feeling, the way it looks. Everything is done for a reason. Not to impress, but to
            become who you were always meant to be. To show that what you
            carry inside can become something others feel without you saying a
            word. A path that is recognizable not by telling, but by showing.
          </p>

          <p
            className="text-sm sm:text-base leading-loose text-white/50 text-center"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300, letterSpacing: "0.04em" }}
          >
            Darkness has always belonged to the wrong side — and it is present.
            He is changing that. Obliveyon is the opposite, taking something the
            world sees as dark and turning it into something that points toward God.
          </p>

          <p
            className="text-sm sm:text-base leading-loose text-white/50 text-center"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300, letterSpacing: "0.04em" }}
          >
            Obliveyon is not about following. It is about the version of yourself
            you keep putting off — the one God has been calling you to be,
            fulfilling the destiny He has always promised you, the one only you can fulfill...
          </p>

          {/* The motto */}
          <div className="my-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="w-1 h-1 rotate-45" style={{ background: "rgba(255,255,255,0.2)" }} />
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
            <p
              className="text-xl sm:text-2xl italic text-white"
              style={{
                fontFamily: "var(--font-gothic)",
                fontWeight: 300,
                textShadow:
                  "0 0 8px rgba(255,255,255,0.5), 0 0 30px rgba(255,255,255,0.2), 0 4px 15px rgba(0,0,0,1)",
                letterSpacing: "0.06em",
              }}
            >
              Be the light in the darkness.
            </p>
            <p
              className="text-sm text-white/40 mt-2 italic"
              style={{ fontFamily: "var(--font-gothic)", fontWeight: 300 }}
            >
              Not despite who you are. Because of it.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="w-1 h-1 rotate-45" style={{ background: "rgba(255,255,255,0.2)" }} />
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
          </div>

          {/* Founder credit */}
          <div className="mt-4">
            <p
              className="text-base tracking-[0.3em] uppercase text-white/80"
              style={{ fontFamily: "var(--font-gothic)", fontWeight: 300 }}
            >
              Founded by a Dream
            </p>
            <p
              className="text-[10px] tracking-[0.4em] uppercase text-white/25 mt-2"
              style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
            >
              Creator &nbsp;·&nbsp; Visionary &nbsp;·&nbsp; Still becoming.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
