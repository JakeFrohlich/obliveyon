"use client";

import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: string;
}

export default function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <section className="mt-24 pt-12 border-t border-border">
      <h2 className="text-xs font-medium tracking-[0.3em] uppercase text-text-muted mb-8">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}
