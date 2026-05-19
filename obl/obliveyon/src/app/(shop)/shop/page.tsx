import Link from "next/link";
import Footer from "@/components/shop/Footer";

const STATIC_PRODUCTS = [
  {
    name: "The Original Obliveyon Zip Up",
    href: "/product/the-original-obliveyon",
    image: "/The orginal Obliveyon.png",
    price: "$65+",
    category: "Zip Up",
  },
  {
    name: "Acid Wash Zip Up",
    href: "/product/the-original-obliveyon?color=1",
    image: "/try 2.png",
    price: "$65+",
    category: "Zip Up",
  },
  {
    name: "White Zip Up",
    href: "/product/the-original-obliveyon?color=2",
    image: "/White 1.png",
    price: "$65+",
    category: "Zip Up",
  },
  {
    name: "Black Zip Up",
    href: "/product/the-original-obliveyon?color=3",
    image: "/black 1st.png",
    price: "$65+",
    category: "Zip Up",
  },
  {
    name: "The Obliveyon Hoodie",
    href: "/product/the-obliveyon-hoodie",
    image: "/hoodie-front.jpg",
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
      <div className="px-5 sm:px-10 lg:px-16 pb-10" style={{ paddingTop: "96px" }}>
        <div className="text-center mt-8 sm:mt-10">
          {/* Ornamental flourish above */}
          <div className="flex items-center gap-3 justify-center mb-5 opacity-60">
            <div className="h-px w-10 sm:w-16" style={{ background: "rgba(255,255,255,0.18)" }} />
            <svg width="8" height="8" viewBox="0 0 8 8">
              <polygon points="4,0 8,4 4,8 0,4" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
            </svg>
            <div className="h-px w-10 sm:w-16" style={{ background: "rgba(255,255,255,0.18)" }} />
          </div>

          <h1
            className="text-3xl sm:text-4xl tracking-[0.3em] uppercase text-white"
            style={{
              fontFamily: "var(--font-gothic)",
              fontWeight: 300,
              textShadow: "0 0 40px rgba(255,255,255,0.08)",
            }}
          >
            Collection
          </h1>
        </div>

        <div className="flex justify-center mt-7">
          <p
            className="text-[10px] tracking-[0.4em] uppercase pb-2"
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
      <div className="px-5 sm:px-10 lg:px-16 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
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
              <div className="mt-4 px-1">
                <p
                  className="text-[12px] sm:text-[13px] tracking-[0.18em] uppercase text-white/80 group-hover:text-white transition-colors duration-300 leading-snug"
                  style={{ fontFamily: "var(--font-medieval)", fontWeight: 400 }}
                >
                  {product.name}
                </p>
                <p
                  className="text-[10px] sm:text-[11px] tracking-[0.25em] text-white/50 mt-2"
                  style={{ fontFamily: "var(--font-medieval)", fontWeight: 400 }}
                >
                  {product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>

      <Footer />
    </div>
  );
}
