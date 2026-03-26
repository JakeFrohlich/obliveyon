"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold tracking-[0.2em] uppercase text-center mb-8">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              className="w-full bg-bg-secondary border border-border px-4 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-border-hover transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 text-sm font-medium tracking-wider uppercase hover:bg-accent-dim transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-white hover:text-accent-dim transition-colors">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
