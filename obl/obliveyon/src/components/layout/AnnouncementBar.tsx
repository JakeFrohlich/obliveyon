"use client";

// Sitewide announcement strip — fixed to the very top of every page.
// Sits at z-[60] above the Navbar (z-50) and any page overlays (which use z-50 max).
// Has a slow "breathing" pulse (4s loop) to gently draw the eye without being annoying.

export default function AnnouncementBar() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center px-3 sm:px-10 announcement-breathe"
      style={{
        height: "28px",
        background: "rgba(255,255,255,0.94)",
        color: "#060504",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <span
        className="inline-flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.45em] uppercase"
        style={{ fontFamily: "var(--font-medieval)", fontWeight: 500 }}
      >
        <svg width="6" height="6" viewBox="0 0 6 6" className="opacity-60 announcement-diamond">
          <polygon points="3,0 6,3 3,6 0,3" fill="currentColor" />
        </svg>
        <span className="whitespace-nowrap">Free US Shipping</span>
        <span className="hidden sm:inline opacity-50">·</span>
        <span className="hidden sm:inline whitespace-nowrap opacity-70">International Calculated at Checkout</span>
        <svg width="6" height="6" viewBox="0 0 6 6" className="opacity-60 announcement-diamond">
          <polygon points="3,0 6,3 3,6 0,3" fill="currentColor" />
        </svg>
      </span>

      <style jsx>{`
        @keyframes announcementBreathe {
          0%, 100% {
            box-shadow: 0 0 12px rgba(255, 255, 255, 0.08), 0 1px 0 rgba(255, 255, 255, 0.04);
            filter: brightness(1);
          }
          50% {
            box-shadow: 0 0 28px rgba(255, 255, 255, 0.32), 0 2px 4px rgba(255, 255, 255, 0.12);
            filter: brightness(1.06);
          }
        }
        @keyframes diamondBreathe {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50%      { opacity: 0.9;  transform: scale(1.15); }
        }
        .announcement-breathe {
          animation: announcementBreathe 4s ease-in-out infinite;
        }
        .announcement-diamond {
          animation: diamondBreathe 4s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
}
