"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border bg-bg-secondary">
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

        <form onSubmit={handleSubmit} className="flex gap-0">
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
          <p className="text-xs text-red-400 mt-4">Something went wrong. Try again.</p>
        )}
      </motion.div>
    </section>
  );
}
