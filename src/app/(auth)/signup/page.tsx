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

const STORAGE_KEY = "obliveyon_signed_up";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function formatPhone(raw: string): string {
  // Strip everything except digits
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function toE164(formatted: string): string {
  const digits = formatted.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const countdown = useCountdown(DROP_DATE);

  // On mount, check if this browser already signed up
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) {
      setSubmitted(true);
    }
  }, []);

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    if (phoneError) setPhoneError("");
  }

  function validateEmail() {
    if (!EMAIL_RE.test(email)) {
      setEmailError("Enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  }

  function validatePhone() {
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setPhoneError("Enter a 10-digit US phone number");
      return false;
    }
    setPhoneError("");
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const emailOk = validateEmail();
    const phoneOk = validatePhone();
    if (!emailOk || !phoneOk) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/klaviyo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone: toE164(phone) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Try again.");
      } else {
        localStorage.setItem(STORAGE_KEY, "1");
        setSubmitted(true);
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 sm:px-6 relative overflow-hidden">

      <MedievalBackground />

      {/* Full bleed content — no box, just layered over the video */}
      <div className="w-full max-w-lg relative z-20 text-center py-8">

        {/* Brand label */}
        <p
          className="text-[9px] sm:text-[10px] tracking-[0.6em] uppercase text-white mb-6 sm:mb-10"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
        >
          Obliveyon
        </p>

        {/* Main title */}
        <h1
          className="text-4xl sm:text-7xl text-white leading-none mb-3"
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
          className="text-lg sm:text-2xl text-white/80 italic mb-8 sm:mb-12"
          style={{
            fontFamily: "var(--font-gothic)",
            fontWeight: 300,
            textShadow: "0 2px 20px rgba(0,0,0,0.6)",
          }}
        >
          in the Darkness
        </p>

        {/* Thin divider */}
        <div className="flex items-center gap-4 mb-7 sm:mb-10 px-4 sm:px-8">
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
        <div className="flex justify-center gap-5 sm:gap-12 mb-10 sm:mb-12">
          {[
            { label: "Days", value: countdown.days },
            { label: "Hrs", value: countdown.hours },
            { label: "Min", value: countdown.minutes },
            { label: "Sec", value: countdown.seconds },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <span
                className="text-3xl sm:text-5xl text-white tabular-nums leading-none"
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
                onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
                onBlur={validateEmail}
                required
                className="w-full py-3 text-sm text-white/90 placeholder:text-white/50 focus:outline-none transition-all duration-400 bg-transparent"
                style={{
                  fontFamily: "var(--font-medieval)",
                  fontWeight: 300,
                  borderBottom: emailError ? "1px solid rgba(255,100,100,0.7)" : "1px solid rgba(255,255,255,0.2)",
                  letterSpacing: "0.05em",
                }}
                onFocus={(e) => { e.target.style.borderBottomColor = emailError ? "rgba(255,100,100,0.9)" : "rgba(255,255,255,0.6)"; }}
                maxLength={254}
                placeholder="Email address"
                autoComplete="email"
              />
              {emailError && (
                <p className="text-[10px] mt-1 tracking-wider" style={{ color: "rgba(255,130,130,0.9)", fontFamily: "var(--font-medieval)" }}>
                  {emailError}
                </p>
              )}
            </div>

            <div className="text-left">
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                onBlur={validatePhone}
                required
                className="w-full py-3 text-sm text-white/90 placeholder:text-white/50 focus:outline-none transition-all duration-400 bg-transparent"
                style={{
                  fontFamily: "var(--font-medieval)",
                  fontWeight: 300,
                  borderBottom: phoneError ? "1px solid rgba(255,100,100,0.7)" : "1px solid rgba(255,255,255,0.2)",
                  letterSpacing: "0.05em",
                }}
                onFocus={(e) => { e.target.style.borderBottomColor = phoneError ? "rgba(255,100,100,0.9)" : "rgba(255,255,255,0.6)"; }}
                maxLength={14}
                placeholder="(555) 000-0000"
                autoComplete="tel"
              />
              {phoneError && (
                <p className="text-[10px] mt-1 tracking-wider" style={{ color: "rgba(255,130,130,0.9)", fontFamily: "var(--font-medieval)" }}>
                  {phoneError}
                </p>
              )}
            </div>

            {error && (
              <p className="text-[11px] tracking-wider text-center" style={{ color: "rgba(255,160,160,0.9)", fontFamily: "var(--font-medieval)" }}>
                {error}
              </p>
            )}

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
