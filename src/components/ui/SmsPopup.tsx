"use client";

import { useState, useEffect } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";

const STORAGE_KEY = "obliveyon_sms_popup_dismissed";

export default function SmsPopup() {
  const [visible, setVisible] = useState(false);
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  function validatePhone() {
    if (!phone || !isValidPhoneNumber(phone)) {
      setPhoneError("Enter a valid phone number");
      return false;
    }
    setPhoneError("");
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validatePhone()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/klaviyo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setPhoneError(data.error || "Something went wrong. Try again.");
        return;
      }
      localStorage.setItem(STORAGE_KEY, "1");
      setSubmitted(true);
    } catch {
      setPhoneError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!visible) return null;

  return (
    <>
      <style>{`
        .sms-popup-phone .PhoneInput {
          display: flex;
          align-items: center;
          background: transparent;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          transition: border-color 0.3s;
          gap: 0;
        }
        .sms-popup-phone .PhoneInput:focus-within {
          border-bottom-color: rgba(255,255,255,0.6);
        }
        .sms-popup-phone .PhoneInputCountry {
          display: flex;
          align-items: center;
          gap: 6px;
          padding-right: 10px;
        }
        .sms-popup-phone .PhoneInputCountrySelect {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          cursor: pointer;
          outline: none;
          appearance: none;
        }
        .sms-popup-phone .PhoneInputCountrySelect option {
          background: #111;
          color: #fff;
        }
        .sms-popup-phone .PhoneInputCountryIconImg {
          width: 18px;
          height: 13px;
          object-fit: cover;
          opacity: 0.75;
        }
        .sms-popup-phone .PhoneInputInput {
          flex: 1;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.9);
          font-size: 14px;
          padding: 10px 0;
          outline: none;
          letter-spacing: 0.05em;
          font-weight: 300;
        }
        .sms-popup-phone .PhoneInputInput::placeholder {
          color: rgba(255,255,255,0.4);
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[900] bg-black/60"
        onClick={dismiss}
      />

      {/* Modal */}
      <div
        className="fixed z-[901] bottom-0 left-0 right-0 sm:bottom-auto sm:left-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2 sm:w-[360px] overflow-y-auto"
        style={{
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "36px 24px 28px",
          paddingBottom: "max(28px, env(safe-area-inset-bottom, 28px))",
          borderRadius: "12px 12px 0 0",
          maxHeight: "90vh",
        }}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors"
          style={{ fontFamily: "var(--font-medieval)", width: 40, height: 40, fontSize: 16 }}
        >
          ✕
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <p
              className="text-2xl text-white mb-3"
              style={{ fontFamily: "var(--font-gothic)", fontWeight: 300 }}
            >
              Welcome.
            </p>
            <p
              className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-4"
              style={{ fontFamily: "var(--font-medieval)" }}
            >
              Your discount code
            </p>
            <div
              className="px-5 py-3 text-white text-sm tracking-[0.3em] uppercase"
              style={{
                fontFamily: "var(--font-medieval)",
                fontWeight: 400,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.04)",
                letterSpacing: "0.2em",
              }}
            >
              Obliveyon777
            </div>
            <p
              className="text-[9px] tracking-wider text-white/25 mt-3"
              style={{ fontFamily: "var(--font-medieval)" }}
            >
              Apply at checkout for 5% off
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <p
                className="text-[9px] tracking-[0.6em] uppercase text-white/40 mb-3"
                style={{ fontFamily: "var(--font-medieval)" }}
              >
                Obliveyon
              </p>
              <h2
                className="text-2xl text-white mb-2"
                style={{ fontFamily: "var(--font-gothic)", fontWeight: 300, letterSpacing: "0.05em" }}
              >
                Get 5% Off
              </h2>
              <p
                className="text-[11px] tracking-[0.35em] uppercase text-white/50"
                style={{ fontFamily: "var(--font-medieval)" }}
              >
                Submit your number for an exclusive discount
              </p>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="w-1 h-1 rotate-45" style={{ background: "rgba(255,255,255,0.15)" }} />
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="sms-popup-phone">
                <PhoneInput
                  placeholder="Phone number"
                  value={phone}
                  onChange={(val) => { setPhone(val); if (phoneError) setPhoneError(""); }}
                  flags={flags}
                  defaultCountry="US"
                  international
                  countryCallingCodeEditable={false}
                  autoComplete="tel"
                />
              </div>
              {phoneError && (
                <p className="text-[10px] tracking-wider" style={{ color: "rgba(255,130,130,0.9)", fontFamily: "var(--font-medieval)" }}>
                  {phoneError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-[11px] tracking-[0.5em] uppercase cursor-pointer transition-all duration-300 disabled:opacity-30 mt-1"
                style={{
                  fontFamily: "var(--font-medieval)",
                  fontWeight: 400,
                  background: "rgba(255,255,255,0.92)",
                  color: "#080808",
                  border: "none",
                }}
              >
                {loading ? "—" : "Claim My 5% Off"}
              </button>

              <p
                className="text-[11px] leading-relaxed text-center"
                style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.35)", letterSpacing: "0.02em" }}
              >
                By submitting, you agree to receive marketing texts from Obliveyon. Message &amp; data rates may apply. Reply STOP to unsubscribe.
              </p>
            </form>
          </>
        )}
      </div>
    </>
  );
}
