import Link from "next/link";
import Footer from "@/components/shop/Footer";

const STATIC_PRODUCTS = [
  {
    name: "The Original Obliveyon",
    href: "/product/the-original-obliveyon",
    image: "/The orginal Obliveyon.png",
    price: "$65+",
    category: "Hoodie",
  },
  {
    name: "Acid Wash",
    href: "/product/the-original-obliveyon?color=0",
    image: "/try 2.png",
    price: "$65+",
    category: "Hoodie",
  },
  {
    name: "White",
    href: "/product/the-original-obliveyon?color=1",
    image: "/White 1.png",
    price: "$65+",
    category: "Hoodie",
  },
  {
    name: "Black",
    href: "/product/the-original-obliveyon?color=2",
    image: "/black 1st.png",
    price: "$65+",
    category: "Hoodie",
  },
];

export default function ShopPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#000000" }}
    >
      {/* Header */}
      <div className="px-6 sm:px-10 lg:px-16 pb-8" style={{ paddingTop: "110px" }}>
        <div className="text-center mt-6">
          <h1
            className="text-2xl sm:text-3xl tracking-[0.25em] uppercase text-white"
            style={{
              fontFamily: "var(--font-gothic)",
              fontWeight: 300,
              textShadow: "0 0 40px rgba(255,255,255,0.06)",
            }}
          >
            Collection
          </h1>
        </div>
        <div className="h-px mt-6" style={{ background: "rgba(255,255,255,0.06)" }} />

        <div className="flex justify-center mt-6">
          <p
            className="text-[10px] tracking-[0.35em] uppercase pb-2"
            style={{
              fontFamily: "var(--font-medieval)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.7)",
              borderBottom: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            All
          </p>
        </div>
      </div>

      {/* Product grid — small squares with borders */}
      <div className="px-6 sm:px-10 lg:px-16 pb-16">
        {/* Row 1 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {STATIC_PRODUCTS.map((product) => (
            <Link
              key={product.name}
              href={product.href}
              className="group block"
            >
              <div
                className="aspect-square overflow-hidden relative"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  style={{ filter: "brightness(0.9)" }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }}
                />
                {/* Corner accents */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="0" y1="0" x2="12" y2="0" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                  <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                  <line x1="100" y1="0" x2="88" y2="0" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                  <line x1="100" y1="0" x2="100" y2="12" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                  <line x1="0" y1="100" x2="12" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                  <line x1="0" y1="100" x2="0" y2="88" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                  <line x1="100" y1="100" x2="88" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                  <line x1="100" y1="100" x2="100" y2="88" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                  <polygon points="50,2 52,4 50,6 48,4" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
                  <polygon points="50,94 52,96 50,98 48,96" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
                </svg>
              </div>
              <div className="mt-2">
                <p
                  className="text-[10px] tracking-[0.2em] uppercase text-white/70 group-hover:text-white/90 transition-colors duration-300 truncate"
                  style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
                >
                  {product.name}
                </p>
                <p
                  className="text-[8px] tracking-wider text-white/40 mt-0.5"
                  style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
                >
                  {product.price}
                </p>
              </div>
            </Link>
          ))}

          {/* Empty slot for row 1 */}
          <div className="aspect-square relative" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ pointerEvents: "none" }}>
              <line x1="0" y1="0" x2="12" y2="0" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
              <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
              <line x1="100" y1="0" x2="88" y2="0" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
              <line x1="100" y1="0" x2="100" y2="12" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
              <line x1="0" y1="100" x2="12" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
              <line x1="0" y1="100" x2="0" y2="88" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
              <line x1="100" y1="100" x2="88" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
              <line x1="100" y1="100" x2="100" y2="88" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
              <polygon points="50,2 52,4 50,6 48,4" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
              <polygon points="50,94 52,96 50,98 48,96" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
            </svg>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px my-4" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* Row 2 — empty slots for future products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`empty-2-${i}`}
              className="aspect-square relative"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ pointerEvents: "none" }}>
                <line x1="0" y1="0" x2="12" y2="0" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                <line x1="100" y1="0" x2="88" y2="0" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                <line x1="100" y1="0" x2="100" y2="12" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                <line x1="0" y1="100" x2="12" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                <line x1="0" y1="100" x2="0" y2="88" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                <line x1="100" y1="100" x2="88" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                <line x1="100" y1="100" x2="100" y2="88" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                <polygon points="50,2 52,4 50,6 48,4" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
                <polygon points="50,94 52,96 50,98 48,96" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
              </svg>
            </div>
          ))}
        </div>

      </div>

      <Footer />
    </div>
  );
}
