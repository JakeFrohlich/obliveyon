"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AccountGatewayPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/profile");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#000000" }}>
        <p
          className="text-[11px] tracking-[0.4em] uppercase text-white/40"
          style={{ fontFamily: "var(--font-medieval)" }}
        >
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#000000" }}
    >
      <h1
        className="text-2xl tracking-[0.4em] uppercase text-white mb-10"
        style={{ fontFamily: "var(--font-gothic)", fontWeight: 400 }}
      >
        Obliveyon
      </h1>

      <p
        className="text-[11px] tracking-[0.55em] uppercase text-white/40 mb-14 text-center"
        style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
      >
        Enter the realm
      </p>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <Link
          href="/login"
          className="w-full py-3.5 text-sm tracking-[0.3em] uppercase text-center transition-colors duration-300"
          style={{
            fontFamily: "var(--font-medieval)",
            background: "rgba(255,255,255,0.92)",
            color: "#080808",
            border: "none",
          }}
        >
          Sign In
        </Link>
        <Link
          href="/create-account"
          className="w-full py-3.5 text-sm tracking-[0.3em] uppercase text-white/85 hover:text-white text-center transition-colors duration-300"
          style={{
            fontFamily: "var(--font-medieval)",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          Create Account
        </Link>
      </div>

      {/* Footer links */}
      <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {[
          { label: "Shop", href: "/shop" },
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Contact", href: "mailto:vip@obliveyon.com" },
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
