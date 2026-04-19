"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [phoneError, setPhoneError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Signups paused during abuse-incident investigation. Flip to false to re-enable.
  const SIGNUPS_PAUSED = true;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (SIGNUPS_PAUSED) {
      setStatus("error");
      return;
    }
    if (!email) return;

    if (phone && !isValidPhoneNumber(phone)) {
      setPhoneError("Please enter a valid phone number with country code.");
      return;
    }
    setPhoneError("");
    setStatus("loading");

    try {
      const res = await fetch("/api/klaviyo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...(phone ? { phone } : {}) }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setPhone(undefined);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border bg-bg-secondary">
      <style>{`
        .PhoneInput {
          display: flex;
          align-items: center;
          background: transparent;
          border: 1px solid #222;
          transition: border-color 0.2s;
        }
        .PhoneInput:focus-within { border-color: #555; }
        .PhoneInputCountry {
          padding: 0 10px;
          border-right: 1px solid #222;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .PhoneInputCountrySelect {
          background: transparent;
          border: none;
          color: #999;
          font-size: 13px;
          cursor: pointer;
          outline: none;
          appearance: none;
          padding-right: 4px;
        }
        .PhoneInputCountrySelect option { background: #111; color: #fff; }
        .PhoneInputInput {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 13px;
          padding: 12px 14px;
          outline: none;
          font-family: inherit;
        }
        .PhoneInputInput::placeholder { color: #555; }
        .PhoneInputCountryIconImg { width: 18px; height: 13px; object-fit: cover; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto text-center"
      >
        <h2 className="text-xs font-medium tracking-[0.3em] uppercase text-text-muted mb-4">
          Stay Connected
        </h2>
        <p className="text-text-secondary text-sm mb-8">
          Early access to drops, exclusive pieces, and news from the void.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-0">
          <div className="flex gap-0">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="Enter your email"
              required
              className="flex-1 bg-bg border border-border border-r-0 px-4 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-border-hover transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-white text-black text-sm font-medium tracking-wider uppercase hover:bg-accent-dim transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "..." : "Join"}
            </button>
          </div>

          <div className="mt-2">
            <PhoneInput
              placeholder="Phone (optional)"
              value={phone}
              onChange={(val) => {
                setPhone(val);
                setPhoneError("");
                if (status !== "idle") setStatus("idle");
              }}
              flags={flags}
              defaultCountry="US"
              international
              countryCallingCodeEditable={false}
            />
            {phoneError && (
              <p className="text-xs text-red-400 mt-1 text-left">{phoneError}</p>
            )}
            <p className="text-xs text-text-muted mt-1 text-left">
              Add your number for SMS-first drop alerts.
            </p>
          </div>
        </form>

        {status === "success" && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-text-secondary mt-4"
          >
            Welcome to the void.
          </motion.p>
        )}
        {status === "error" && (
          <p className="text-xs text-red-400 mt-4">
            {SIGNUPS_PAUSED
              ? "Signups are temporarily paused. Check back soon."
              : "Something went wrong. Try again."}
          </p>
        )}
      </motion.div>
    </section>
  );
}
