"use client";

import { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

type AggregatedRef = {
  ref: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  emails: string[];
};

type AnalyticsResponse = {
  data: AggregatedRef[];
  total: number;
  fetchedAt: number;
  cached: boolean;
};

const PW_KEY = "obliveyon_admin_pw";

const COLORS = [
  "#ffffff",
  "#e5e7eb",
  "#d1d5db",
  "#9ca3af",
  "#6b7280",
  "#4b5563",
];

export default function AnalyticsPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [toast, setToast] = useState<{ msg: string; id: number } | null>(null);

  // Hydrate password from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem(PW_KEY);
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
  }, []);

  const fetchData = useCallback(async (pw: string, force = false) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/analytics${force ? "?refresh=1" : ""}`, {
        headers: { Authorization: `Bearer ${pw}` },
      });
      if (res.status === 401) {
        sessionStorage.removeItem(PW_KEY);
        setAuthed(false);
        setError("Wrong password.");
        return;
      }
      if (!res.ok) {
        setError(`Error ${res.status}`);
        return;
      }
      const json = (await res.json()) as AnalyticsResponse;
      setData(json);
      sessionStorage.setItem(PW_KEY, pw);
      setAuthed(true);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load after auth
  useEffect(() => {
    if (authed) fetchData(password);
  }, [authed, password, fetchData]);

  // Auto-refresh every 60s
  useEffect(() => {
    if (!autoRefresh || !authed) return;
    const id = setInterval(() => fetchData(password, true), 60_000);
    return () => clearInterval(id);
  }, [autoRefresh, authed, password, fetchData]);

  // Toast cleanup
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(id);
  }, [toast]);

  const showToast = (msg: string) => {
    setToast({ msg, id: Date.now() });
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchData(password);
          }}
          className="w-full max-w-sm flex flex-col gap-4"
        >
          <h1 className="text-xl tracking-[0.3em] uppercase text-white text-center">
            Analytics
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/60"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="py-3 bg-white text-black text-xs tracking-[0.3em] uppercase disabled:opacity-40"
          >
            {loading ? "..." : "Enter"}
          </button>
          {error && <p className="text-xs text-red-400 text-center">{error}</p>}
        </form>
      </div>
    );
  }

  // Filter by date range
  let filteredData = data?.data ?? [];
  if (dateFrom || dateTo) {
    const fromDate = dateFrom ? new Date(dateFrom).getTime() : 0;
    const toDate = dateTo ? new Date(dateTo).getTime() : Infinity;
    filteredData = filteredData.filter((row) => {
      const lastSeenTime = new Date(row.lastSeen).getTime();
      return lastSeenTime >= fromDate && lastSeenTime <= toDate;
    });
  }

  const totalSignups = filteredData.reduce((sum, r) => sum + r.count, 0);
  const totalProfiles = data?.total ?? 0;
  const fetchedAgo = data ? Math.round((Date.now() - data.fetchedAt) / 1000) : 0;

  // Pie chart data
  const pieData = filteredData.map((row) => ({
    name: row.ref,
    value: row.count,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/5 to-black/20 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl tracking-[0.15em] uppercase text-white font-light">
              Ad Analytics
            </h1>
            <p className="text-xs text-white/50 tracking-wider mt-2">
              Attribution by <code className="text-white/70">?ref=</code> param on signup
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs tracking-wider text-white/70">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="accent-white"
              />
              Auto-refresh
            </label>
            <button
              onClick={() => fetchData(password, true)}
              disabled={loading}
              className="px-4 py-2 border border-white/20 text-xs tracking-wider uppercase hover:bg-white/5 transition-colors disabled:opacity-40"
            >
              {loading ? "..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 border border-white/10 bg-white/[0.02]">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/50 tracking-wider uppercase">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-white/5 border border-white/20 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/40"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/50 tracking-wider uppercase">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-white/5 border border-white/20 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/40"
            />
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
              className="px-4 py-2 text-xs text-white/60 hover:text-white transition-colors self-end"
            >
              Clear
            </button>
          )}
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <Stat label="Tracked signups" value={totalSignups} />
          <Stat label="Total profiles" value={totalProfiles} />
          <Stat label="Unique refs" value={filteredData.length} />
          <Stat
            label="Last fetch"
            value={data ? `${fetchedAgo}s ago${data.cached ? " (cached)" : ""}` : "—"}
          />
        </div>

        {/* Pie Chart */}
        {filteredData.length > 0 && (
          <div className="border border-white/10 p-6 mb-10 bg-white/[0.02]">
            <h2 className="text-sm tracking-[0.2em] uppercase text-white/60 mb-6">
              Breakdown by Channel
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#ffffff"
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #4b5563" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Ref Cards */}
        {filteredData.length === 0 ? (
          <div className="text-center py-12 border border-white/10 bg-white/[0.02]">
            <p className="text-white/40 text-sm">
              {dateFrom || dateTo
                ? "No signups in this date range."
                : "No tracked signups yet. Share a link with ?ref=your_code."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((row) => {
              const isExpanded = expanded.has(row.ref);
              const percentage = totalSignups > 0 ? ((row.count / totalSignups) * 100).toFixed(1) : "0";
              return (
                <div
                  key={row.ref}
                  className="border border-white/10 p-6 bg-gradient-to-br from-white/[0.08] to-white/[0.02] hover:from-white/[0.12] hover:to-white/[0.04] transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-mono text-sm text-white break-all">{row.ref}</h3>
                      <p className="text-xs text-white/50 tracking-wider mt-1">
                        {new Date(row.lastSeen).toLocaleDateString()}
                      </p>
                    </div>
                    <CopyBtn
                      value={`https://obliveyon.com/?ref=${row.ref}`}
                      onCopy={() => showToast("Link copied!")}
                    />
                  </div>

                  <div className="mb-4">
                    <p className="text-3xl font-light text-white">{row.count}</p>
                    <p className="text-xs text-white/50 tracking-wider uppercase mt-1">
                      Signups ({percentage}%)
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const next = new Set(expanded);
                      if (next.has(row.ref)) next.delete(row.ref);
                      else next.add(row.ref);
                      setExpanded(next);
                    }}
                    className="text-xs text-white/60 hover:text-white transition-colors tracking-wider uppercase"
                  >
                    {isExpanded ? "Hide emails" : `Show ${row.emails.length} emails`}
                  </button>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/10 max-h-48 overflow-y-auto">
                      {row.emails.map((e, i) => (
                        <div key={i} className="text-xs text-white/60 font-mono py-1 truncate">
                          {e}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-4 right-4 bg-white text-black px-4 py-3 text-xs tracking-wider font-medium animate-pulse">
            {toast.msg}
          </div>
        )}

        {error && <p className="text-xs text-red-400 mt-8 text-center">{error}</p>}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-white/10 p-4 bg-white/[0.02]">
      <p className="text-[10px] tracking-[0.2em] uppercase text-white/40">{label}</p>
      <p className="text-xl sm:text-2xl text-white mt-2 font-light">{value}</p>
    </div>
  );
}

function CopyBtn({
  value,
  onCopy,
}: {
  value: string;
  onCopy: () => void;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          onCopy();
          setTimeout(() => setCopied(false), 1200);
        });
      }}
      className="text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors ml-2"
    >
      {copied ? "✓" : "Copy"}
    </button>
  );
}
