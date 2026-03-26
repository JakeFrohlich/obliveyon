"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface OrderItem {
  id: string;
  quantity: number;
  size: string;
  price: number;
  product: { name: string; images: string[] };
}

interface Order {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/orders")
        .then((res) => res.json())
        .then(setOrders)
        .catch(() => {})
        .finally(() => setLoadingOrders(false));
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-text-secondary text-sm">Loading...</p>
      </div>
    );
  }

  if (!session?.user) return null;

  const user = session.user;
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-[0.15em] uppercase mb-2">
              Account
            </h1>
            <p className="text-text-secondary text-sm">{user.email}</p>
            {user.name && (
              <p className="text-text-muted text-xs mt-1">{user.name}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 border border-border text-xs tracking-wider uppercase hover:border-white transition-colors"
              >
                Admin
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 text-xs text-text-muted tracking-wider uppercase hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Order History */}
        <div>
          <h2 className="text-xs font-medium tracking-[0.3em] uppercase text-text-muted mb-6">
            Order History
          </h2>

          {loadingOrders ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse bg-bg-secondary h-24 rounded-lg" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-bg-secondary rounded-lg">
              <p className="text-text-secondary text-sm mb-4">No orders yet</p>
              <Link
                href="/shop"
                className="inline-block px-6 py-2 bg-white text-black text-xs font-medium tracking-wider uppercase hover:bg-accent-dim transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-bg-secondary border border-border p-6 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-text-muted">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-1 text-xs tracking-wider uppercase ${
                          order.status === "PAID"
                            ? "bg-green-500/10 text-green-400"
                            : order.status === "SHIPPED"
                              ? "bg-blue-500/10 text-blue-400"
                              : order.status === "DELIVERED"
                                ? "bg-white/10 text-white"
                                : order.status === "CANCELLED"
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {order.status}
                      </span>
                      <p className="text-sm font-medium mt-2">
                        {formatPrice(order.totalPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">
                          {item.product.name} — {item.size} &times; {item.quantity}
                        </span>
                        <span className="text-text-muted">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
