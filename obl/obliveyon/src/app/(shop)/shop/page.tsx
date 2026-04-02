import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";
import { Suspense } from "react";
import Link from "next/link";
import Footer from "@/components/shop/Footer";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    size?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
  }>;
}

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
    href: "/product/the-original-obliveyon?color=1",
    image: "/try 2.png",
    price: "$65+",
    category: "Hoodie",
  },
  {
    name: "White",
    href: "/product/the-original-obliveyon?color=2",
    image: "/White 1.png",
    price: "$65+",
    category: "Hoodie",
  },
  {
    name: "Black",
    href: "/product/the-original-obliveyon?color=3",
    image: "/black 1st.png",
    price: "$65+",
    category: "Hoodie",
  },
];

async function ProductGrid({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const where: Record<string, unknown> = {};
  if (params.category && params.category !== "all") where.category = params.category;
  if (params.size) where.sizes = { has: params.size };
  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) (where.price as Record<string, number>).gte = parseFloat(params.minPrice);
    if (params.maxPrice) (where.price as Record<string, number>).lte = parseFloat(params.maxPrice);
  }
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  let products;
  try {
    products = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
  } catch {
    return null;
  }

  if (products.length === 0) return null;

  return (
    <>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </>
  );
}

export default function ShopPage(props: ShopPageProps) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#000000" }}
    >
      {/* Header */}
      <div className="px-6 sm:px-10 lg:px-16 pt-12 pb-8">
        <Link
          href="/"
          className="return-btn text-[11px] tracking-[0.4em] uppercase transition-colors duration-300"
          style={{ fontFamily: "var(--font-medieval)", fontWeight: 400, color: "rgba(255,255,255,0.85)" }}
        >
          ← Return
        </Link>
        <style>{`.return-btn:hover { color: rgba(255,255,255,1) !important; }`}</style>
        <div className="text-center mt-6">
          <p
            className="text-[9px] tracking-[0.5em] uppercase text-white/20 mb-3"
            style={{ fontFamily: "var(--font-medieval)", fontWeight: 300 }}
          >
            Obliveyon
          </p>
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

        {/* DB products below */}
        <Suspense
          fallback={null}
        >
          <ProductGrid searchParams={props.searchParams} />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
