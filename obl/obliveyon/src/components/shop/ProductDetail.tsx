"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes: string[];
  stock: number;
}

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  function handleAddToCart() {
    if (!selectedSize) return;

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity: 1,
      image: product.images[0] || "",
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
    >
      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="aspect-[3/4] bg-bg-secondary rounded-lg overflow-hidden">
          {product.images[selectedImage] ? (
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted text-sm tracking-wider uppercase">
              {product.name}
            </div>
          )}
        </div>

        {product.images.length > 1 && (
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-24 rounded-md overflow-hidden border-2 transition-colors ${
                  selectedImage === i ? "border-white" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col">
        <p className="text-xs text-text-muted tracking-[0.2em] uppercase mb-2">
          {product.category}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          {product.name}
        </h1>
        <p className="text-xl mb-8">{formatPrice(product.price)}</p>

        <p className="text-sm text-text-secondary leading-relaxed mb-8">
          {product.description}
        </p>

        {/* Size Selector */}
        <div className="mb-8">
          <p className="text-xs text-text-muted tracking-[0.2em] uppercase mb-3">
            Size {selectedSize && `— ${selectedSize}`}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[3rem] px-4 py-2.5 text-sm border transition-colors ${
                  selectedSize === size
                    ? "border-white bg-white text-black"
                    : "border-border text-text-secondary hover:border-border-hover hover:text-white"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize || product.stock === 0}
          className={`w-full py-4 text-sm font-medium tracking-[0.2em] uppercase transition-all ${
            added
              ? "bg-green-600 text-white"
              : product.stock === 0
                ? "bg-bg-tertiary text-text-muted cursor-not-allowed"
                : "bg-white text-black hover:bg-accent-dim"
          } disabled:opacity-50`}
        >
          {product.stock === 0
            ? "Sold Out"
            : added
              ? "Added to Cart"
              : !selectedSize
                ? "Select a Size"
                : "Add to Cart"}
        </button>

        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-xs text-text-muted mt-3 text-center">
            Only {product.stock} left in stock
          </p>
        )}
      </div>
    </motion.div>
  );
}
