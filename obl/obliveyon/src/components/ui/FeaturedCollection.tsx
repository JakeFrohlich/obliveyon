"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

const FEATURED_PRODUCTS = [
  {
    id: "1",
    name: "Void Hoodie",
    price: 185,
    image: "/images/placeholder-1.jpg",
    slug: "void-hoodie",
  },
  {
    id: "2",
    name: "Shadow Cargo Pants",
    price: 165,
    image: "/images/placeholder-2.jpg",
    slug: "shadow-cargo-pants",
  },
  {
    id: "3",
    name: "Eclipse Tee",
    price: 85,
    image: "/images/placeholder-3.jpg",
    slug: "eclipse-tee",
  },
  {
    id: "4",
    name: "Abyss Jacket",
    price: 320,
    image: "/images/placeholder-4.jpg",
    slug: "abyss-jacket",
  },
];

export default function FeaturedCollection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-12"
      >
        <h2 className="text-xs font-medium tracking-[0.3em] uppercase text-text-muted">
          Featured
        </h2>
        <Link
          href="/shop"
          className="text-xs tracking-[0.2em] uppercase text-text-secondary hover:text-white transition-colors"
        >
          View All →
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURED_PRODUCTS.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/product/${product.slug}`} className="group block">
              <div className="aspect-[3/4] bg-bg-secondary rounded-lg overflow-hidden mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                <div className="w-full h-full bg-bg-tertiary flex items-center justify-center text-text-muted text-xs tracking-wider uppercase">
                  {product.name}
                </div>
              </div>
              <h3 className="text-sm font-medium group-hover:text-accent-dim transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                {formatPrice(product.price)}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
