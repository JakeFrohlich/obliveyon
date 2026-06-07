"use client";

import Footer from "@/components/shop/Footer";

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    body: "By accessing or using obliveyon.com, you agree to be bound by these Terms of Service. If you do not agree, please do not use the site.",
  },
  {
    title: "Use of the Site",
    body: "You agree to use this site for lawful purposes only. You may not use it in any way that violates applicable laws, infringes on the rights of others, or interferes with the operation of the site.",
  },
  {
    title: "Purchases",
    body: "All purchases are subject to our sales policies. All sales are final. By completing a purchase, you confirm that you have reviewed the product details, sizing, and policies before ordering.",
  },
  {
    title: "Intellectual Property",
    body: "All content on this site — including text, graphics, logos, images, and product designs — is the property of Obliveyon and may not be reproduced, distributed, or used without express written permission.",
  },
  {
    title: "SMS & Email Communications",
    body: "By providing your phone number or email address, you consent to receive marketing communications from Obliveyon. You may opt out at any time by replying STOP to any SMS or using the unsubscribe link in any email.",
  },
  {
    title: "Limitation of Liability",
    body: "Obliveyon is not liable for any indirect, incidental, or consequential damages arising from your use of this site or any products purchased. Our total liability shall not exceed the amount paid for the order in question.",
  },
  {
    title: "Changes to Terms",
    body: "We reserve the right to update these Terms at any time. Continued use of the site after changes are posted constitutes your acceptance of the revised Terms.",
  },
  {
    title: "Contact",
    body: "Questions about these Terms? Reach us at vip@obliveyon.com.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: "#000000" }}>
      <div
        className="w-full flex flex-col items-center px-6 pb-20"
        style={{ paddingTop: "clamp(90px, 15vw, 140px)", maxWidth: "960px", marginLeft: "auto", marginRight: "auto" }}
      >
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
            Terms of Service
          </h1>
          <p
            className="text-center text-[10px] tracking-[0.5em] uppercase mt-3"
            style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.3)" }}
          >
            Please read before using this site
          </p>
        </div>

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
          Last updated June 2026
        </p>
      </div>

      <Footer />
    </div>
  );
}
