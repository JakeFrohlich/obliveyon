"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "tees", label: "Tees" },
  { value: "hoodies", label: "Hoodies" },
  { value: "pants", label: "Pants" },
  { value: "outerwear", label: "Outerwear" },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

const PRICE_RANGES = [
  { value: "", label: "Any Price" },
  { value: "0-100", label: "Under $100" },
  { value: "100-200", label: "$100 – $200" },
  { value: "200-500", label: "$200+" },
];

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentSize = searchParams.get("size") || "";
  const currentPrice = searchParams.get("price") || "";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all" && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Also clean up price params
      if (key === "price") {
        params.delete("minPrice");
        params.delete("maxPrice");
        if (value) {
          const [min, max] = value.split("-");
          if (min) params.set("minPrice", min);
          if (max) params.set("maxPrice", max);
        }
      }
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap items-center gap-6 mb-10">
      {/* Categories */}
      <div className="flex items-center gap-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => updateFilter("category", cat.value)}
            className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-colors ${
              currentCategory === cat.value
                ? "bg-white text-black"
                : "text-text-secondary hover:text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Size Filter */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-text-muted tracking-wider uppercase mr-2">Size:</span>
        {SIZES.map((size) => (
          <button
            key={size}
            onClick={() => updateFilter("size", currentSize === size ? "" : size)}
            className={`w-8 h-8 text-xs flex items-center justify-center border transition-colors ${
              currentSize === size
                ? "border-white text-white"
                : "border-border text-text-secondary hover:border-border-hover"
            }`}
          >
            {size}
          </button>
        ))}
      </div>

      {/* Price Filter */}
      <select
        value={currentPrice}
        onChange={(e) => updateFilter("price", e.target.value)}
        className="bg-bg-secondary border border-border px-3 py-1.5 text-xs text-text-secondary focus:outline-none focus:border-border-hover"
      >
        {PRICE_RANGES.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>
    </div>
  );
}
