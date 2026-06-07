"use client";

import Footer from "@/components/shop/Footer";

const SECTIONS = [
  {
    title: "Information We Collect",
    body: "We collect information you provide directly to us, including your name, email address, phone number, and any other information you submit through our website forms. We also automatically collect certain information when you visit our site, such as your IP address, browser type, and pages visited.",
  },
  {
    title: "How We Use Your Information",
    body: "We use the information we collect to process your orders, send you marketing communications (including SMS and email), improve our website, prevent fraud, and comply with legal obligations. If you provide your phone number, we may use it to send you promotional text messages about new products, drops, and exclusive offers.",
  },
  {
    title: "SMS Communications",
    body: "By providing your phone number and consenting to SMS marketing, you agree to receive recurring automated marketing text messages from Obliveyon at the number provided. Consent is not a condition of purchase. Message and data rates may apply. Message frequency varies. Reply STOP to unsubscribe at any time. Reply HELP for help.",
  },
  {
    title: "Sharing Your Information",
    body: "We do not sell your personal information. We may share your information with trusted third-party service providers who assist us in operating our website and conducting our business, including Shopify (e-commerce), Klaviyo (email and SMS marketing), Stripe (payments), and Vercel (hosting). These providers are contractually obligated to keep your information confidential.",
  },
  {
    title: "Cookies",
    body: "Our website uses cookies and similar tracking technologies to enhance your experience, analyze site traffic, and serve relevant content. You can control cookies through your browser settings. Disabling cookies may affect certain features of the site.",
  },
  {
    title: "Data Retention",
    body: "We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, and resolve disputes. You may request deletion of your data at any time by contacting us.",
  },
  {
    title: "Your Rights",
    body: "Depending on your location, you may have the right to access, correct, or delete your personal information, opt out of marketing communications, and request a copy of the data we hold about you. To exercise any of these rights, contact us at vip@obliveyon.com.",
  },
  {
    title: "Children's Privacy",
    body: "Our website is not directed to individuals under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.",
  },
  {
    title: "Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of our site after changes are posted constitutes your acceptance of the revised policy.",
  },
  {
    title: "Contact",
    body: "For any privacy-related questions or requests, contact us at vip@obliveyon.com.",
  },
];

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p
            className="text-center text-[10px] tracking-[0.5em] uppercase mt-3"
            style={{ fontFamily: "var(--font-medieval)", color: "rgba(255,255,255,0.3)" }}
          >
            How we collect and use your information
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
