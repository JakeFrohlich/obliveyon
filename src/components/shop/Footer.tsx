"use client";

import Link from "next/link";

const SITE_LINKS = [
  { label: "Shop",    href: "/shop" },
  { label: "FAQ",     href: "/faq" },
  { label: "Contact", href: "mailto:hello@obliveyon.com" },
];

export default function Footer() {
  return (
    <footer className="w-full pt-20 pb-12" style={{ background: "#000000" }}>
      {/* Top divider */}
      <div className="flex items-center gap-4 mb-12 px-6 sm:px-16">
        <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="w-1 h-1 rotate-45" style={{ background: "rgba(255,255,255,0.15)" }} />
        <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Wordmark + tagline */}
      <div className="text-center mb-14 px-6">
        <h2
          className="text-2xl tracking-[0.3em] uppercase text-white mb-4"
          style={{
            fontFamily: "var(--font-gothic)",
            fontWeight: 300,
            textShadow: "0 0 30px rgba(255,255,255,0.08)",
          }}
        >
          Obliveyon
        </h2>
        <p
          className="text-[10px] tracking-[0.4em] uppercase text-white/25"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
        >
          Be the light in the darkness.
        </p>
      </div>

      {/* Links */}
      <div className="px-6 sm:px-16 mb-14">
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {SITE_LINKS.map((link) => {
            const isExternal = link.href.startsWith("mailto:") || link.href.startsWith("http");
            const className = "text-[11px] tracking-[0.35em] uppercase text-white/65 hover:text-white transition-colors duration-300";
            const style = { fontFamily: "var(--font-medieval)", fontWeight: 300 };
            return (
              <li key={link.label}>
                {isExternal ? (
                  <a href={link.href} className={className} style={style}>
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} className={className} style={style}>
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom divider */}
      <div className="flex items-center gap-4 mb-6 px-6 sm:px-16">
        <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>

      {/* Copyright */}
      <p
        className="text-[10px] tracking-[0.3em] uppercase text-white/25 text-center"
        style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
      >
        © {new Date().getFullYear()} Obliveyon. All rights reserved.
      </p>
    </footer>
  );
}
