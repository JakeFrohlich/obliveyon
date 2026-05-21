"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

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
      // Auto-sign-in after successful signup
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      setDone(true);
      if (signInRes?.ok) {
        setTimeout(() => {
          router.push("/profile");
          router.refresh();
        }, 1200);
      } else {
        setTimeout(() => router.push("/login"), 1800);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "#000000" }}
    >
      {/* Logo */}
      <h1
        className="text-2xl tracking-[0.4em] uppercase text-white mb-10"
        style={{ fontFamily: "var(--font-gothic)", fontWeight: 400 }}
      >
        Obliveyon
      </h1>

      <p
        className="text-[11px] tracking-[0.55em] uppercase text-white/40 mb-8"
        style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
      >
        Create Account
      </p>

      <div className="w-full max-w-sm">
        {done ? (
          <div className="text-center py-8">
            <p
              className="text-white/80 text-sm tracking-[0.3em] uppercase mb-3"
              style={{ fontFamily: "var(--font-medieval)" }}
            >
              You are amongst the chosen.
            </p>
            <p
              className="text-white/30 text-[10px] tracking-[0.4em] uppercase"
              style={{ fontFamily: "var(--font-medieval)" }}
            >
              Entering the realm...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full px-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors duration-300"
              style={{
                fontFamily: "var(--font-medieval)",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                letterSpacing: "0.05em",
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.5)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.15)"; }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full px-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors duration-300"
              style={{
                fontFamily: "var(--font-medieval)",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                letterSpacing: "0.05em",
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.5)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.15)"; }}
            />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder="Confirm Password"
              className="w-full px-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors duration-300"
              style={{
                fontFamily: "var(--font-medieval)",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                letterSpacing: "0.05em",
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.5)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.15)"; }}
            />

            {error && (
              <p
                className="text-red-400/80 text-xs tracking-wider text-center"
                style={{ fontFamily: "var(--font-medieval)" }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-sm tracking-[0.3em] uppercase transition-colors duration-300 disabled:opacity-30 cursor-pointer mt-1"
              style={{
                fontFamily: "var(--font-medieval)",
                background: "rgba(255,255,255,0.92)",
                color: "#080808",
                border: "none",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.92)"; }}
            >
              {loading ? "—" : "Create Account"}
            </button>

            <div className="text-center mt-2">
              <Link
                href="/login"
                className="text-[11px] tracking-[0.4em] uppercase text-white/40 hover:text-white/80 transition-colors duration-300 border-b border-white/15 hover:border-white/40 pb-0.5"
                style={{ fontFamily: "var(--font-medieval)" }}
              >
                Sign In
              </Link>
            </div>
          </form>
        )}
      </div>

      {/* Footer links */}
      <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {[
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Contact", href: "mailto:Obliveyon@gmail.com" },
        ].map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="text-[10px] tracking-[0.35em] uppercase text-white/25 hover:text-white/55 transition-colors duration-300"
            style={{ fontFamily: "var(--font-medieval)" }}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
