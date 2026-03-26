import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/shop/ProductDetail";
import RelatedProducts from "@/components/shop/RelatedProducts";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!product) return { title: "Product Not Found" };

    return {
      title: `${product.name} — Obliveyon`,
      description: product.description,
    };
  } catch {
    return { title: "Obliveyon" };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  let product;
  try {
    product = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });
  } catch {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-text-secondary text-sm">Unable to load product — database is currently unavailable.</p>
        <p className="text-text-muted text-xs mt-2">Please try again later.</p>
      </div>
    );
  }

  if (!product) notFound();

  let related;
  try {
    related = await prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: product.id },
      },
      take: 4,
    });
  } catch {
    related = [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProductDetail product={product} />
      {related.length > 0 && <RelatedProducts products={related} />}
    </div>
  );
}
