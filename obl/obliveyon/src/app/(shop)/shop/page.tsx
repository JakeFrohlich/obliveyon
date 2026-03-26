import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/shop/ProductCard";
import ProductFilters from "@/components/shop/ProductFilters";
import { Suspense } from "react";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    size?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
  }>;
}

async function ProductGrid({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const where: Record<string, unknown> = {};

  if (params.category && params.category !== "all") {
    where.category = params.category;
  }
  if (params.size) {
    where.sizes = { has: params.size };
  }
  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice)
      (where.price as Record<string, number>).gte = parseFloat(params.minPrice);
    if (params.maxPrice)
      (where.price as Record<string, number>).lte = parseFloat(params.maxPrice);
  }
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  let products;
  try {
    products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary text-sm">Unable to load products — database is currently unavailable.</p>
        <p className="text-text-muted text-xs mt-2">Please try again later.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary text-sm">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}

export default function ShopPage(props: ShopPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-[0.15em] uppercase mb-2">Shop</h1>
      <p className="text-text-secondary text-sm mb-8">Browse the full collection</p>

      <Suspense fallback={null}>
        <ProductFilters />
      </Suspense>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-bg-secondary rounded-lg mb-3" />
                <div className="h-4 bg-bg-secondary rounded w-3/4 mb-2" />
                <div className="h-3 bg-bg-secondary rounded w-1/4" />
              </div>
            ))}
          </div>
        }
      >
        <ProductGrid searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
