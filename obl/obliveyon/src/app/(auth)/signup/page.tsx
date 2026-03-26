"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create account");
        setLoading(false);
        return;
      }

      // Auto sign in after signup
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but failed to sign in. Please try logging in.");
        setLoading(false);
      } else {
        router.push("/profile");
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold tracking-[0.2em] uppercase text-center mb-8">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-xs text-text-muted tracking-wider uppercase mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-bg-secondary border border-border px-4 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-border-hover transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs text-text-muted tracking-wider uppercase mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-bg-secondary border border-border px-4 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-border-hover transition-colors"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs text-text-muted tracking-wider uppercase mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-bg-secondary border border-border px-4 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-border-hover transition-colors"
              placeholder="Min. 8 characters"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 text-sm font-medium tracking-wider uppercase hover:bg-accent-dim transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:text-accent-dim transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
