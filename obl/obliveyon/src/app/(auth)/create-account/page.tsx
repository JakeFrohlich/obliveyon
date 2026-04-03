"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MedievalBackground from "@/components/ui/MedievalBackground";

export default function CreateAccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login"), 1800);
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <MedievalBackground />

      <div className="w-full max-w-md relative z-20">
        <div
          className="p-8 sm:p-10"
          style={{
            background: "linear-gradient(180deg, rgba(15,13,10,0.88) 0%, rgba(10,9,7,0.92) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Top divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
            <svg width="8" height="8" viewBox="0 0 8 8">
              <polygon points="4,0 8,4 4,8 0,4" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
            </svg>
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl sm:text-4xl tracking-[0.25em] uppercase text-white mb-2"
              style={{ fontFamily: "var(--font-gothic)", fontWeight: 300 }}
            >
              Enter the Realm
            </h1>
            <p
              className="text-[10px] tracking-[0.5em] uppercase"
              style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.35)" }}
            >
              Create your account
            </p>
          </div>

          {done ? (
            <div className="text-center py-6">
              <p
                className="text-white/80 text-lg tracking-[0.3em] uppercase"
                style={{ fontFamily: "var(--font-gothic)", fontWeight: 300 }}
              >
                You are amongst the chosen.
              </p>
              <p
                className="text-white/40 text-[10px] tracking-[0.4em] uppercase mt-3"
                style={{ fontFamily: "var(--font-medieval)" }}
              >
                Entering the realm...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <div>
                <label
                  className="block text-[10px] tracking-[0.4em] uppercase mb-2"
                  style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.4)" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="thy@email.com"
                  className="w-full px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all duration-300 bg-transparent"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "var(--font-medieval)",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.3)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-[10px] tracking-[0.4em] uppercase mb-2"
                  style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.4)" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all duration-300 bg-transparent"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "var(--font-medieval)",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.3)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className="block text-[10px] tracking-[0.4em] uppercase mb-2"
                  style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.4)" }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all duration-300 bg-transparent"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "var(--font-medieval)",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.3)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                />
              </div>

              {/* Error */}
              {error && (
                <p
                  className="text-red-400/80 text-xs tracking-wider"
                  style={{ fontFamily: "var(--font-medieval)" }}
                >
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 text-sm tracking-[0.4em] uppercase cursor-pointer transition-all duration-300 disabled:opacity-30"
                style={{
                  fontFamily: "var(--font-medieval)",
                  fontWeight: 400,
                  background: "rgba(255,255,255,0.92)",
                  color: "#080808",
                  border: "none",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 30px rgba(255,255,255,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
              >
                {loading ? "—" : "Create Account"}
              </button>
            </form>
          )}

          {/* Bottom divider + login link */}
          <div className="flex items-center gap-4 mt-8 mb-4">
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
          <p
            className="text-center text-sm"
            style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.35)" }}
          >
            Already have an account?{" "}
            <Link href="/login" className="text-white/60 hover:text-white transition-colors duration-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
