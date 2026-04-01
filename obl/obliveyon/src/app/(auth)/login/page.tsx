"use client";

import { useState, useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import MedievalBackground from "@/components/ui/MedievalBackground";
import EmberParticles from "@/components/ui/EmberParticles";
import CandleFlame from "@/components/ui/CandleFlame";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const bgX          = useTransform(smoothX, [0, 1], [-12, 12]);
  const bgY          = useTransform(smoothY, [0, 1], [-8, 8]);
  const leftLanternX = useTransform(smoothX, [0, 1], [14, -14]);
  const leftLanternY = useTransform(smoothY, [0, 1], [-6, 6]);
  const rightLanternX= useTransform(smoothX, [0, 1], [-14, 14]);
  const rightLanternY= useTransform(smoothY, [0, 1], [-6, 6]);
  const emberX       = useTransform(smoothX, [0, 1], [-6, 6]);
  const tiltX        = useTransform(smoothY, [0, 1], [6, -6]);
  const tiltY        = useTransform(smoothX, [0, 1], [-6, 6]);
  const swayLeft     = useTransform(smoothX, [0, 1], [-4, 4]);
  const swayRight    = useTransform(smoothX, [0, 1], [4, -4]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    },
    [mouseX, mouseY]
  );

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
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <motion.div className="fixed inset-0" style={{ x: bgX, y: bgY }}>
        <MedievalBackground />
      </motion.div>

      <motion.div className="fixed inset-0" style={{ x: emberX }}>
        <EmberParticles count={20} />
      </motion.div>

      <motion.div
        className="fixed bottom-0 z-10"
        style={{ left: "4%", x: leftLanternX, y: leftLanternY, rotate: swayLeft, transformOrigin: "50% 0%" }}
      >
        <CandleFlame side="left" />
      </motion.div>

      <motion.div
        className="fixed bottom-0 z-10"
        style={{ right: "4%", x: rightLanternX, y: rightLanternY, rotate: swayRight, transformOrigin: "50% 0%" }}
      >
        <CandleFlame side="right" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-md relative z-20"
        style={{ perspective: 1000 }}
      >
        <motion.div
          style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div
            className="p-8 sm:p-10"
            style={{
              background: "linear-gradient(180deg, rgba(15,13,10,0.85) 0%, rgba(10,9,7,0.9) 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
            }}
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="w-1.5 h-1.5 rotate-45 border border-white/20" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center mb-2"
            >
              <span
                className="block text-3xl sm:text-4xl tracking-[0.25em] uppercase"
                style={{ fontFamily: "var(--font-gothic)" }}
              >
                Return
              </span>
              <span
                className="block text-lg sm:text-xl tracking-[0.4em] uppercase text-white/50 mt-1"
                style={{ fontFamily: "var(--font-medieval)" }}
              >
                To The Realm
              </span>
            </motion.h1>

            <div className="flex items-center justify-center gap-3 mt-4 mb-8">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/15" />
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/15" />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <label
                  htmlFor="email"
                  className="block text-[10px] tracking-[0.3em] uppercase mb-2"
                  style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.4)" }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "var(--font-medieval)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(255,200,100,0.2)";
                    e.target.style.boxShadow = "0 0 20px rgba(255,170,60,0.05), inset 0 0 20px rgba(255,170,60,0.02)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="thy@email.com"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <label
                  htmlFor="password"
                  className="block text-[10px] tracking-[0.3em] uppercase mb-2"
                  style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.4)" }}
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "var(--font-medieval)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(255,200,100,0.2)";
                    e.target.style.boxShadow = "0 0 20px rgba(255,170,60,0.05), inset 0 0 20px rgba(255,170,60,0.02)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                  placeholder="••••••••"
                />
              </motion.div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400/80 text-xs tracking-wider"
                  style={{ fontFamily: "var(--font-medieval)" }}
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-sm font-medium tracking-[0.3em] uppercase disabled:opacity-30 mt-2 transition-colors duration-300 cursor-pointer"
                style={{
                  fontFamily: "var(--font-medieval)",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(220,220,220,0.9) 100%)",
                  color: "#0a0a0a",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(255,255,255,0.1), 0 0 60px rgba(255,200,100,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {loading ? "Entering realm..." : "Enter The Realm"}
              </motion.button>
            </form>

            <div className="flex items-center justify-center gap-4 mt-8 mb-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <p
              className="text-center text-sm mt-4"
              style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.35)" }}
            >
              New to the realm?{" "}
              <Link href="/signup" className="text-white/60 hover:text-white/90 transition-colors duration-300">
                Create an account
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
