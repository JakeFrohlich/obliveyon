"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  stock: number;
  featured: boolean;
  images: string[];
  sizes: string[];
  description: string;
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (session?.user && session.user.role !== "ADMIN") router.push("/");
  }, [status, session, router]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => {});
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  if (status === "loading") return null;
  if (!session?.user || session.user.role !== "ADMIN") return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-text-muted hover:text-white transition-colors">
            ← Back
          </Link>
          <h1 className="text-3xl font-bold tracking-[0.15em] uppercase">Products</h1>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-4 py-2 bg-white text-black text-xs font-medium tracking-wider uppercase hover:bg-accent-dim transition-colors"
        >
          Add Product
        </button>
      </div>

      {showForm && (
        <ProductForm
          product={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={(product) => {
            if (editing) {
              setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
            } else {
              setProducts((prev) => [product, ...prev]);
            }
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-bg-secondary border border-border p-5 rounded-lg"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium">{product.name}</h3>
                <p className="text-xs text-text-muted capitalize">{product.category}</p>
              </div>
              <span className="text-sm">{formatPrice(product.price)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">Stock: {product.stock}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing(product); setShowForm(true); }}
                  className="text-xs text-text-secondary hover:text-white transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ProductForm({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: (p: Product) => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    category: product?.category || "tees",
    sizes: product?.sizes?.join(", ") || "S, M, L, XL",
    stock: product?.stock?.toString() || "0",
    images: product?.images?.join(", ") || "",
    featured: product?.featured || false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      stock: parseInt(form.stock),
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      featured: form.featured,
    };

    try {
      const url = product ? `/api/products/${product.id}` : "/api/products";
      const res = await fetch(url, {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        setLoading(false);
        return;
      }

      const saved = await res.json();
      onSaved(saved);
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="bg-bg-secondary border border-border p-6 rounded-lg mb-8 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-medium tracking-[0.2em] uppercase">
          {product ? "Edit Product" : "New Product"}
        </h2>
        <button onClick={onClose} className="text-text-muted hover:text-white text-sm">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <Field label="Price" value={form.price} onChange={(v) => setForm({ ...form, price: v })} type="number" required />
        <Field label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} required />
        <Field label="Stock" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} type="number" required />
        <Field label="Sizes (comma-separated)" value={form.sizes} onChange={(v) => setForm({ ...form, sizes: v })} />
        <Field label="Image URLs (comma-separated)" value={form.images} onChange={(v) => setForm({ ...form, images: v })} />
        <div className="sm:col-span-2">
          <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea required />
        </div>
        <div className="sm:col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="accent-white"
          />
          <label htmlFor="featured" className="text-xs text-text-secondary">Featured product</label>
        </div>

        {error && <p className="sm:col-span-2 text-xs text-red-400">{error}</p>}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-white text-black text-xs font-medium tracking-wider uppercase hover:bg-accent-dim transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const className =
    "w-full bg-bg border border-border px-3 py-2 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-border-hover transition-colors";

  return (
    <div>
      <label className="block text-xs text-text-muted tracking-wider uppercase mb-1.5">
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={3}
          className={className}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          step={type === "number" ? "0.01" : undefined}
          className={className}
        />
      )}
    </div>
  );
}
