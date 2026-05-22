"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MedievalBackground from "@/components/ui/MedievalBackground";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";

const DROP_DATE = new Date("2026-05-22T20:00:00Z"); // 3pm EST (UTC-5)

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
const REF_RE = /^[a-zA-Z0-9_-]{1,64}$/;

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const countdown = useCountdown(DROP_DATE);
  const searchParams = useSearchParams();

  // Read the ad ref from the URL (middleware forwards it here when redirecting)
  const refParam = searchParams.get("ref");
  const adRef = refParam && REF_RE.test(refParam) ? refParam : null;

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) setSubmitted(true);
  }, []);

  function validateEmail() {
    if (!EMAIL_RE.test(email)) {
      setEmailError("Enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  }

  function validatePhone() {
    if (!phone) {
      setPhoneError("");
      return true;
    }
    if (!isValidPhoneNumber(phone)) {
      setPhoneError("Enter a valid phone number");
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
        body: JSON.stringify({ email, ...(phone ? { phone } : {}), ...(adRef ? { ref: adRef } : {}) }),
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

      {/* Phone input styles — underline-only to match the page aesthetic */}
      <style>{`
        .signup-phone .PhoneInput {
          display: flex;
          align-items: center;
          background: transparent;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          transition: border-color 0.4s;
          gap: 0;
        }
        .signup-phone.has-error .PhoneInput {
          border-bottom-color: rgba(255,100,100,0.7);
        }
        .signup-phone .PhoneInput:focus-within {
          border-bottom-color: rgba(255,255,255,0.6);
        }
        .signup-phone.has-error .PhoneInput:focus-within {
          border-bottom-color: rgba(255,100,100,0.9);
        }
        .signup-phone .PhoneInputCountry {
          display: flex;
          align-items: center;
          gap: 6px;
          padding-right: 10px;
        }
        .signup-phone .PhoneInputCountrySelect {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          cursor: pointer;
          outline: none;
          appearance: none;
          letter-spacing: 0.05em;
        }
        .signup-phone .PhoneInputCountrySelect option {
          background: #111;
          color: #fff;
        }
        .signup-phone .PhoneInputCountryIconImg {
          width: 18px;
          height: 13px;
          object-fit: cover;
          opacity: 0.75;
        }
        .signup-phone .PhoneInputInput {
          flex: 1;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.9);
          font-size: 14px;
          padding: 12px 0;
          outline: none;
          letter-spacing: 0.05em;
          font-weight: 300;
        }
        .signup-phone .PhoneInputInput::placeholder {
          color: rgba(255,255,255,0.5);
        }
      `}</style>

      <div className="w-full max-w-lg relative z-20 text-center py-8">

        <p
          className="text-[9px] sm:text-[10px] tracking-[0.6em] uppercase text-white mb-6 sm:mb-10"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
        >
          Obliveyon
        </p>

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
            {/* Email */}
            <div className="text-left">
              <input
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
                onBlurCapture={(e) => { e.target.style.borderBottomColor = emailError ? "rgba(255,100,100,0.7)" : "rgba(255,255,255,0.2)"; }}
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

            {/* Phone — international with country selector */}
            <div className="text-left">
              <div className={`signup-phone${phoneError ? " has-error" : ""} relative`}>
                <PhoneInput
                  placeholder="Phone number"
                  value={phone}
                  onChange={(val) => {
                    setPhone(val);
                    if (phoneError) setPhoneError("");
                  }}
                  onBlur={validatePhone}
                  flags={flags}
                  defaultCountry="US"
                  international
                  countryCallingCodeEditable={false}
                  autoComplete="tel"
                />
                <span
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] tracking-[0.3em] uppercase pointer-events-none"
                  style={{
                    fontFamily: "var(--font-medieval)",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  Optional
                </span>
              </div>
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
              {loading ? "—" : "Sign Up for early access"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
