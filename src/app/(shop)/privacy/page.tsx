"use client";

import Footer from "@/components/shop/Footer";

const SECTIONS = [
  {
    title: "Sales & Returns",
    body: "All sales are final. We do not accept returns, refunds, or exchanges. Please review the size chart carefully before placing your order — if you have any questions about fit, reach out before you buy and we will help you find the right size.",
  },
  {
    title: "Defective or Incorrect Items",
    body: "If you receive a defective item or something different from what you ordered, contact us within 14 days of your delivery date. We will make it right — either by replacing the item or issuing a full refund. Proof of the issue (a photo) will be required.",
  },
  {
    title: "Shipping",
    body: "Shipping takes 6–18 business days from order confirmation, depending on destination. International customers are responsible for any customs duties or import taxes assessed by their country.",
  },
  {
    title: "Contact",
    body: "For any order issues, reach us at vip@obliveyon.com. Include your order number and a brief description of the issue and we will get back to you as soon as possible.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: "#000000" }}>
      <div
        className="w-full flex flex-col items-center px-6 pb-20"
        style={{ paddingTop: "140px", maxWidth: "960px", marginLeft: "auto", marginRight: "auto" }}
      >
        {/* Title */}
        <div className="w-full text-center mb-14">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="w-1.5 h-1.5 rotate-45" style={{ background: "rgba(255,255,255,0.15)" }} />
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl tracking-[0.25em] uppercase text-white text-center"
            style={{ fontFamily: "var(--font-gothic)", fontWeight: 300 }}
          >
            Policies
          </h1>
          <p
            className="text-center text-[10px] tracking-[0.5em] uppercase mt-3"
            style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.3)" }}
          >
            Please read before purchasing
          </p>
        </div>

        {/* Sections */}
        <div className="w-full flex flex-col gap-10">
          {SECTIONS.map((s) => (
            <div
              key={s.title}
              className="text-center"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "2.5rem" }}
            >
              <h2
                className="text-base sm:text-lg tracking-[0.35em] uppercase text-white/90 mb-5"
                style={{ fontFamily: "var(--font-medieval)", fontWeight: 400 }}
              >
                {s.title}
              </h2>
              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.65)", fontWeight: 300 }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <p
          className="text-[10px] tracking-wider text-white/20 mt-14 text-center"
          style={{ fontFamily: "var(--font-medieval)" }}
        >
          Last updated May 2026
        </p>
      </div>

      <Footer />
    </div>
  );
}
