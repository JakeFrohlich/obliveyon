"use client";

import Link from "next/link";

const SITE_LINKS = [
  { label: "Shop",     href: "/shop" },
  { label: "FAQ",      href: "/faq" },
  { label: "Policies", href: "/privacy" },
  { label: "Contact",  href: "mailto:vip@obliveyon.com" },
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

      {/* Social icons */}
      <div className="flex items-center justify-center gap-6 mb-10">
        <a
          href="https://discord.gg/M4kgbn9Z"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Discord"
          className="text-white/35 hover:text-white/80 transition-colors duration-300"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.055a19.928 19.928 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        </a>
        <a
          href="https://www.instagram.com/obliveyon/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="text-white/35 hover:text-white/80 transition-colors duration-300"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>
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
