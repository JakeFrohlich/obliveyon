"use client";

import { useState } from "react";
import Footer from "@/components/shop/Footer";

const FAQS: { q: string; a: string }[] = [
  {
    q: "When does the first drop release?",
    a: "May 22, 2026. Sign up to be the first to know when the doors open.",
  },
  {
    q: "What materials are used?",
    a: "Heavyweight cotton blend with hand-embroidered logo and a custom branded zipper. Built to outlast the trend cycle.",
  },
  {
    q: "How do I care for my piece?",
    a: "Cold wash, inside out. Hang dry. Do not iron over the embroidery. Treat it like something that means something.",
  },
  {
    q: "How long does shipping take?",
    a: "Shipping takes 6–18 business days from order confirmation, depending on destination.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. International shipping rates and timeframes are calculated at checkout. Customs and duties are the responsibility of the recipient.",
  },
  {
    q: "What's your return policy?",
    a: "Returns accepted within 14 days, including the time it takes for delivery.",
  },
  {
    q: "Will sold-out colorways come back?",
    a: "Each drop is limited. Some pieces will return; others won't. If you see something you want, take it.",
  },
  {
    q: "How do I contact the team?",
    a: "Email vip@obliveyon.com — a real person will get back to you.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: "#000000" }}>
      <div
        className="w-full flex flex-col items-center px-6 pb-16"
        style={{ paddingTop: "140px", maxWidth: "960px", marginLeft: "auto", marginRight: "auto" }}
      >
        {/* Header */}
        <div className="w-full text-center mb-12">
          <p
            className="text-[10px] tracking-[0.55em] uppercase text-white/40 mb-4"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
          >
            Questions
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl tracking-[0.2em] uppercase text-white"
            style={{
              fontFamily: "var(--font-gothic)",
              fontWeight: 300,
              textShadow: "0 0 40px rgba(255,255,255,0.06)",
            }}
          >
            Frequently Asked
          </h1>
          <div className="h-px mt-8 mx-auto" style={{ background: "rgba(255,255,255,0.08)", maxWidth: "360px" }} />
        </div>

        {/* Q&A list */}
        <div className="w-full">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full py-8 flex items-center justify-center gap-5 cursor-pointer transition-colors duration-300 group"
                >
                  <span
                    className="text-lg sm:text-xl tracking-[0.08em] text-white/80 group-hover:text-white transition-colors duration-300 text-center"
                    style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
                  >
                    {faq.q}
                  </span>
                  <span
                    className="flex-shrink-0 text-white/40 group-hover:text-white/70 transition-all duration-300"
                    style={{
                      fontFamily: "var(--font-medieval)",
                      fontSize: "24px",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      lineHeight: 1,
                    }}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-9 px-6">
                    <p
                      className="text-base sm:text-lg leading-loose text-white/65 text-center"
                      style={{ fontFamily: "var(--font-medieval)", fontWeight: 300, letterSpacing: "0.03em" }}
                    >
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact prompt */}
        <div className="w-full text-center mt-16" style={{ maxWidth: "440px" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="w-1 h-1 rotate-45" style={{ background: "rgba(255,255,255,0.15)" }} />
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
          <p
            className="text-[11px] tracking-[0.35em] uppercase text-white/40 mb-4"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
          >
            Still have questions?
          </p>
          <a
            href="mailto:vip@obliveyon.com"
            className="inline-block text-sm tracking-[0.3em] uppercase text-white/85 hover:text-white border-b border-white/20 hover:border-white/60 pb-1 transition-colors duration-300"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
          >
            vip@obliveyon.com
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
