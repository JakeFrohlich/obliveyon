"use client";

import { useState, useEffect } from "react";
import MedievalBackground from "@/components/ui/MedievalBackground";

const DROP_DATE = new Date("2026-05-21T00:00:00");

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calc() {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const countdown = useCountdown(DROP_DATE);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 relative overflow-hidden">
      <MedievalBackground />

      {/* Full bleed content — no box, just layered over the video */}
      <div className="w-full max-w-lg relative z-20 text-center">

        {/* Brand label */}
        <p
          className="text-[10px] tracking-[0.6em] uppercase text-white mb-10"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
        >
          Obliveyon
        </p>

        {/* Main title */}
        <h1
          className="text-5xl sm:text-7xl text-white leading-none mb-3"
          style={{
            fontFamily: "var(--font-gothic)",
            fontWeight: 300,
            textShadow: "0 2px 40px rgba(0,0,0,0.8)",
            letterSpacing: "0.04em",
          }}
        >
          Be the Light
        </h1>
        <p
          className="text-xl sm:text-2xl text-white/80 italic mb-12"
          style={{
            fontFamily: "var(--font-gothic)",
            fontWeight: 300,
            textShadow: "0 2px 20px rgba(0,0,0,0.6)",
          }}
        >
          in the Darkness
        </p>

        {/* Thin divider */}
        <div className="flex items-center gap-5 mb-10 px-8">
          <div className="h-px flex-1 bg-white/15" />
          <span
            className="text-[9px] tracking-[0.5em] uppercase text-white"
            style={{ fontFamily: "var(--font-medieval)" }}
          >
            May 21
          </span>
          <div className="h-px flex-1 bg-white/15" />
        </div>

        {/* Countdown — large, airy */}
        <div className="flex justify-center gap-8 sm:gap-12 mb-12">
          {[
            { label: "Days", value: countdown.days },
            { label: "Hrs", value: countdown.hours },
            { label: "Min", value: countdown.minutes },
            { label: "Sec", value: countdown.seconds },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <span
                className="text-4xl sm:text-5xl text-white tabular-nums leading-none"
                style={{
                  fontFamily: "var(--font-gothic)",
                  fontWeight: 300,
                  textShadow: "0 2px 30px rgba(0,0,0,0.7)",
                }}
              >
                {String(value).padStart(2, "0")}
              </span>
              <span
                className="text-[9px] tracking-[0.35em] uppercase text-white/70 mt-2"
                style={{ fontFamily: "var(--font-medieval)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {submitted ? (
          <div className="py-4">
            <p
              className="text-white/80 text-xl italic"
              style={{ fontFamily: "var(--font-gothic)", fontWeight: 300 }}
            >
              You are amongst the chosen.
            </p>
            <p
              className="text-white/70 text-xs mt-3 tracking-[0.4em] uppercase"
              style={{ fontFamily: "var(--font-medieval)" }}
            >
              We will reach you when the time comes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Underline-only inputs — fashion forward */}
            <div className="text-left">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full py-3 text-sm text-white/90 placeholder:text-white/50 focus:outline-none transition-all duration-400 bg-transparent"
                style={{
                  fontFamily: "var(--font-medieval)",
                  fontWeight: 300,
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                  letterSpacing: "0.05em",
                }}
                onFocus={(e) => {
                  e.target.style.borderBottomColor = "rgba(255,255,255,0.6)";
                }}
                onBlur={(e) => {
                  e.target.style.borderBottomColor = "rgba(255,255,255,0.2)";
                }}
                placeholder="Email address"
              />
            </div>

            <div className="text-left">
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full py-3 text-sm text-white/90 placeholder:text-white/50 focus:outline-none transition-all duration-400 bg-transparent"
                style={{
                  fontFamily: "var(--font-medieval)",
                  fontWeight: 300,
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                  letterSpacing: "0.05em",
                }}
                onFocus={(e) => {
                  e.target.style.borderBottomColor = "rgba(255,255,255,0.6)";
                }}
                onBlur={(e) => {
                  e.target.style.borderBottomColor = "rgba(255,255,255,0.2)";
                }}
                placeholder="Phone number"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 text-xs tracking-[0.5em] uppercase cursor-pointer transition-all duration-300 disabled:opacity-30"
              style={{
                fontFamily: "var(--font-medieval)",
                fontWeight: 400,
                background: "rgba(255,255,255,0.92)",
                color: "#080808",
                border: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,1)";
                e.currentTarget.style.boxShadow = "0 0 50px rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.92)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {loading ? "—" : "Sign Up for the Drop"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
