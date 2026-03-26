"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    category: string;
  };
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="aspect-[3/4] bg-bg-secondary rounded-lg overflow-hidden mb-3 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-bg-tertiary flex items-center justify-center text-text-muted text-xs tracking-wider uppercase">
              {product.name}
            </div>
          )}
        </div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium group-hover:text-accent-dim transition-colors">
            {product.name}
          </h3>
          <span className="text-sm text-text-secondary flex-shrink-0">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="text-xs text-text-muted mt-1 capitalize">{product.category}</p>
      </Link>
    </motion.div>
  );
}
