import Link from "next/link";
import Footer from "@/components/shop/Footer";
import MobileRankCard from "@/components/shop/MobileRankCard";

const STATIC_PRODUCTS = [
  {
    name: "The Original Obliveyon",
    href: "/product/the-original-obliveyon",
    image: "/The orginal Obliveyon.png",
    price: "$70",
    category: "Hoodie",
  },
  {
    name: "Acid Wash Zip Up",
    href: "/product/the-original-obliveyon?color=0",
    image: "/try 2.png",
    price: "$70",
    category: "Hoodie",
  },
  {
    name: "White Zip Up",
    href: "/product/the-original-obliveyon?color=1",
    image: "/White 1.png",
    price: "$70",
    category: "Hoodie",
  },
  {
    name: "Black Zip Up",
    href: "/product/the-original-obliveyon?color=2",
    image: "/black 1st.png",
    price: "$70",
    category: "Hoodie",
  },
  {
    name: "The Obliveyon Hoodie",
    href: "/product/the-obliveyon-hoodie",
    image: "/hoodie-front.jpg",
    price: "$70",
    category: "Hoodie",
  },
];

export default function ShopPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#000000" }}
    >
      {/* Main content — grows to push footer down */}
      <main className="flex-1">
        {/* Header — Collection title sits well below the navbar */}
        <div className="px-6 sm:px-10 lg:px-16 pt-[180px] sm:pt-[120px] pb-10">
          <div className="text-center mt-6">
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl tracking-[0.25em] uppercase text-white"
              style={{
                fontFamily: "var(--font-gothic)",
                fontWeight: 300,
                textShadow: "0 0 40px rgba(255,255,255,0.06)",
              }}
            >
              Collection
            </h1>
          </div>
          <div className="h-px mt-8 mx-auto" style={{ background: "rgba(255,255,255,0.08)", maxWidth: "520px" }} />

          <div className="flex justify-center mt-6">
            <p
              className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase pb-2"
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

        {/* Product grid — single row on desktop, bigger tiles */}
        <div className="px-6 sm:px-10 lg:px-16 pb-24 mx-auto" style={{ maxWidth: "1600px" }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
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
              <div className="mt-3">
                <p
                  className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-white/75 group-hover:text-white transition-colors duration-300 truncate"
                  style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
                >
                  {product.name}
                </p>
                <p
                  className="text-base sm:text-lg tracking-[0.15em] text-white/55 mt-2"
                  style={{ fontFamily: "var(--font-medieval)", fontWeight: 400 }}
                >
                  {product.price}
                </p>
              </div>
            </Link>
          ))}

        </div>

        </div>
      </main>

      {/* Mobile-only: rank info just above the footer (matches LevelBar content) */}
      <MobileRankCard />

      <Footer />
    </div>
  );
}
