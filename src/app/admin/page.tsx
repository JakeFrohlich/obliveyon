"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Order {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  user: { email: string; name: string | null };
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user && session.user.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user && session.user.role === "ADMIN") {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((data) => {
          setOrders(data);
          setStats({
            totalOrders: data.length,
            totalRevenue: data
              .filter((o: Order) => o.status !== "CANCELLED")
              .reduce((sum: number, o: Order) => sum + o.totalPrice, 0),
            pendingOrders: data.filter((o: Order) => o.status === "PENDING").length,
          });
        })
        .catch(() => {});
    }
  }, [session]);

  if (status === "loading") return null;
  if (!session?.user || session.user.role !== "ADMIN") return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold tracking-[0.15em] uppercase">Admin</h1>
        <Link
          href="/admin/products"
          className="px-4 py-2 bg-white text-black text-xs font-medium tracking-wider uppercase hover:bg-accent-dim transition-colors"
        >
          Manage Products
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {[
          { label: "Total Orders", value: stats.totalOrders },
          { label: "Revenue", value: `$${stats.totalRevenue.toFixed(2)}` },
          { label: "Pending", value: stats.pendingOrders },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-bg-secondary border border-border p-6 rounded-lg"
          >
            <p className="text-xs text-text-muted tracking-wider uppercase">{stat.label}</p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <h2 className="text-xs font-medium tracking-[0.3em] uppercase text-text-muted mb-4">
        Recent Orders
      </h2>

      <div className="bg-bg-secondary border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-text-muted tracking-wider uppercase px-6 py-3">Order</th>
                <th className="text-left text-xs text-text-muted tracking-wider uppercase px-6 py-3">Customer</th>
                <th className="text-left text-xs text-text-muted tracking-wider uppercase px-6 py-3">Total</th>
                <th className="text-left text-xs text-text-muted tracking-wider uppercase px-6 py-3">Status</th>
                <th className="text-left text-xs text-text-muted tracking-wider uppercase px-6 py-3">Date</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} onUpdate={(updated) => {
                  setOrders((prev) =>
                    prev.map((o) => (o.id === updated.id ? { ...o, status: updated.status } : o))
                  );
                }} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrderRow({ order, onUpdate }: { order: Order; onUpdate: (o: { id: string; status: string }) => void }) {
  const [updating, setUpdating] = useState(false);

  async function updateStatus(status: string) {
    setUpdating(true);
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status }),
      });
      if (res.ok) {
        onUpdate({ id: order.id, status });
      }
    } catch {
      // ignore
    }
    setUpdating(false);
  }

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-6 py-4 text-sm font-mono">#{order.id.slice(-8).toUpperCase()}</td>
      <td className="px-6 py-4 text-sm text-text-secondary">{order.user.email}</td>
      <td className="px-6 py-4 text-sm">${order.totalPrice.toFixed(2)}</td>
      <td className="px-6 py-4">
        <select
          value={order.status}
          onChange={(e) => updateStatus(e.target.value)}
          disabled={updating}
          className="bg-bg border border-border text-xs px-2 py-1 text-text-secondary focus:outline-none"
        >
          {["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </td>
      <td className="px-6 py-4 text-xs text-text-muted">
        {new Date(order.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4"></td>
    </tr>
  );
}
