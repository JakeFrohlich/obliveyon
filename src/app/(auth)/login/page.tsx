"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/profile");
      router.refresh();
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
        Login
      </p>

      <div className="w-full max-w-sm flex flex-col gap-3">
        {/* Sign in with Shop — placeholder, styled like Ditch */}
        <button
          type="button"
          disabled
          className="w-full py-3.5 text-sm tracking-[0.2em] uppercase text-white/40 cursor-not-allowed"
          style={{
            fontFamily: "var(--font-medieval)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          Sign in with Shop
        </button>

        <div className="flex items-center gap-4 my-1">
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span
            className="text-[10px] tracking-[0.4em] uppercase text-white/25"
            style={{ fontFamily: "var(--font-medieval)" }}
          >
            or
          </span>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

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

          <div className="text-right -mt-1">
            <span
              className="text-[10px] tracking-[0.3em] uppercase text-white/30 cursor-not-allowed"
              style={{ fontFamily: "var(--font-medieval)" }}
            >
              Forgot your password?
            </span>
          </div>

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
            {loading ? "—" : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-2">
          <Link
            href="/create-account"
            className="text-[11px] tracking-[0.4em] uppercase text-white/40 hover:text-white/80 transition-colors duration-300 border-b border-white/15 hover:border-white/40 pb-0.5"
            style={{ fontFamily: "var(--font-medieval)" }}
          >
            Create Account
          </Link>
        </div>
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
