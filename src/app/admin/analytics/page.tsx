"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type AggregatedRef = {
  ref: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  emails: string[];
  signupsByDay: Record<string, number>;
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

const CHANNEL_COLORS: Record<string, string> = {
  tiktok: "bg-purple-600/20 border-purple-500",
  ig: "bg-pink-600/20 border-pink-500",
  instagram: "bg-pink-600/20 border-pink-500",
  discord: "bg-indigo-600/20 border-indigo-500",
  yt: "bg-red-600/20 border-red-500",
  youtube: "bg-red-600/20 border-red-500",
  aff: "bg-amber-600/20 border-amber-500",
  affiliate: "bg-amber-600/20 border-amber-500",
};

const CHANNEL_TEXT_COLORS: Record<string, string> = {
  tiktok: "text-purple-400",
  ig: "text-pink-400",
  instagram: "text-pink-400",
  discord: "text-indigo-400",
  yt: "text-red-400",
  youtube: "text-red-400",
  aff: "text-amber-400",
  affiliate: "text-amber-400",
};

type SortBy = "signups" | "conversion_rate" | "recent" | "oldest";

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
  const [chartType, setChartType] = useState<"pie" | "bar">("bar");
  const [sortBy, setSortBy] = useState<SortBy>("signups");
  const [views, setViews] = useState<Record<string, number>>({});
  const [commission, setCommission] = useState<Record<string, number>>({});

  // Hydrate password, views, and commissions from localStorage
  useEffect(() => {
    const saved = sessionStorage.getItem(PW_KEY);
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
    // Load views and commission from localStorage
    const savedViews = localStorage.getItem("obliveyon_views");
    if (savedViews) setViews(JSON.parse(savedViews));
    const savedCommission = localStorage.getItem("obliveyon_commission");
    if (savedCommission) setCommission(JSON.parse(savedCommission));
  }, []);

  // Persist views and commission to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("obliveyon_views", JSON.stringify(views));
  }, [views]);

  useEffect(() => {
    localStorage.setItem("obliveyon_commission", JSON.stringify(commission));
  }, [commission]);

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

  const getChannelInfo = (ref: string) => {
    const prefix = ref.split("_")[0].toLowerCase();
    const colorClass = CHANNEL_COLORS[prefix] || "bg-gray-600/20 border-gray-500";
    const textColor = CHANNEL_TEXT_COLORS[prefix] || "text-gray-400";
    const displayName =
      {
        tiktok: "TikTok",
        ig: "Instagram",
        instagram: "Instagram",
        discord: "Discord",
        yt: "YouTube",
        youtube: "YouTube",
        aff: "Affiliate",
      }[prefix] || "Other";
    return { colorClass, textColor, displayName };
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

  // Separate ads and affiliates
  const adRefs = filteredData.filter((r) => !r.ref.startsWith("aff_"));
  const affiliateRefs = filteredData.filter((r) => r.ref.startsWith("aff_"));

  // Sort function
  const sortRefs = (refs: AggregatedRef[]): AggregatedRef[] => {
    const sorted = [...refs];
    switch (sortBy) {
      case "conversion_rate":
        return sorted.sort((a, b) => {
          const aRate = views[a.ref] ? (a.count / views[a.ref]) * 100 : -1;
          const bRate = views[b.ref] ? (b.count / views[b.ref]) * 100 : -1;
          return bRate - aRate;
        });
      case "recent":
        return sorted.sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());
      case "oldest":
        return sorted.sort((a, b) => new Date(a.firstSeen).getTime() - new Date(b.firstSeen).getTime());
      default:
        return sorted.sort((a, b) => b.count - a.count);
    }
  };

  const sortedAds = sortRefs(adRefs);
  const sortedAffiliates = sortRefs(affiliateRefs);

  const totalSignups = filteredData.reduce((sum, r) => sum + r.count, 0);
  const totalProfiles = data?.total ?? 0;
  const fetchedAgo = data ? Math.round((Date.now() - data.fetchedAt) / 1000) : 0;

  // Charts data
  const pieData = filteredData.map((row) => ({
    name: row.ref,
    value: row.count,
  }));

  const barChartData = sortedAds.map((row) => ({
    ref: row.ref.slice(0, 15),
    signups: row.count,
  }));

  const exportCSV = () => {
    const headers = ["ref", "signups", "views", "conversion_rate", "first_seen", "last_seen", "emails"];
    const rows = filteredData.map((r) => [
      r.ref,
      r.count,
      views[r.ref] || "",
      views[r.ref] ? `${((r.count / views[r.ref]) * 100).toFixed(2)}%` : "",
      r.firstSeen,
      r.lastSeen,
      r.emails.join(";"),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `obliveyon-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported!");
  };

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
            <button
              onClick={exportCSV}
              className="px-4 py-2 border border-white/20 text-xs tracking-wider uppercase hover:bg-white/5 transition-colors"
            >
              Export CSV
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

        {/* Sort Controls */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["signups", "conversion_rate", "recent", "oldest"] as SortBy[]).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-4 py-2 text-xs tracking-wider uppercase transition-all ${
                sortBy === option
                  ? "bg-white text-black"
                  : "border border-white/20 text-white/60 hover:text-white"
              }`}
            >
              {option === "conversion_rate" ? "Conv. Rate" : option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        {/* Chart Toggle */}
        <div className="flex gap-2 mb-8">
          {(["bar", "pie"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-4 py-2 text-xs tracking-wider uppercase transition-all ${
                chartType === type
                  ? "bg-white/20 border border-white/40"
                  : "border border-white/10 text-white/60 hover:text-white"
              }`}
            >
              {type === "bar" ? "Bar Chart" : "Pie Chart"}
            </button>
          ))}
        </div>

        {/* Charts */}
        {sortedAds.length > 0 && (
          <div className="border border-white/10 p-6 mb-10 bg-white/[0.02]">
            <h2 className="text-sm tracking-[0.2em] uppercase text-white/60 mb-6">
              {chartType === "bar" ? "Signups by Ad Channel" : "Share by Channel"}
            </h2>
            {chartType === "bar" ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={barChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis type="number" stroke="#ffffff60" />
                  <YAxis dataKey="ref" type="category" stroke="#ffffff60" width={90} />
                  <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #4b5563" }} />
                  <Bar dataKey="signups" fill="#ffffff" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
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
            )}
          </div>
        )}

        {/* Ads Section */}
        {sortedAds.length === 0 ? (
          <div className="text-center py-12 border border-white/10 bg-white/[0.02] mb-10">
            <p className="text-white/40 text-sm">
              {dateFrom || dateTo ? "No signups in this date range." : "No tracked ads yet."}
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-sm tracking-[0.2em] uppercase text-white/60 mb-4">Your Ads</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {sortedAds.map((row) => (
                <RefCard
                  key={row.ref}
                  row={row}
                  views={views[row.ref]}
                  onViewsChange={(v) => setViews({ ...views, [row.ref]: v })}
                  expanded={expanded}
                  onExpandedChange={setExpanded}
                  getChannelInfo={getChannelInfo}
                />
              ))}
            </div>
          </>
        )}

        {/* Affiliate Leaderboard */}
        {sortedAffiliates.length > 0 && (
          <>
            <h2 className="text-sm tracking-[0.2em] uppercase text-white/60 mb-4">Affiliates</h2>
            <div className="border border-white/10 bg-white/[0.02] overflow-hidden mb-10">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b border-white/10 bg-white/[0.05]">
                    <tr>
                      {[
                        "Rank",
                        "Affiliate",
                        "Signups",
                        "Views",
                        "Conv. Rate",
                        "Commission",
                        "Est. Payout",
                        "",
                      ].map((h) => (
                        <th key={h} className="text-left px-4 py-3 tracking-wider text-white/40 font-normal">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAffiliates.map((row, idx) => {
                      const rowViews = views[row.ref] || 0;
                      const convRate = rowViews ? ((row.count / rowViews) * 100).toFixed(2) : "—";
                      const rowCommission = commission[row.ref] || 0;
                      const payout = rowViews ? row.count * rowCommission : 0;
                      return (
                        <tr key={row.ref} className="border-b border-white/10 last:border-0">
                          <td className="px-4 py-3 text-white/70">{idx + 1}</td>
                          <td className="px-4 py-3 font-mono text-white">{row.ref.replace("aff_", "")}</td>
                          <td className="px-4 py-3 text-white">{row.count}</td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={rowViews || ""}
                              onChange={(e) =>
                                setViews({
                                  ...views,
                                  [row.ref]: e.target.value ? parseInt(e.target.value) : 0,
                                })
                              }
                              placeholder="—"
                              className="bg-white/5 border border-white/10 px-2 py-1 text-white w-20 text-center focus:outline-none focus:border-white/40"
                            />
                          </td>
                          <td className={`px-4 py-3 ${convRate !== "—" ? "text-green-400" : "text-white/60"}`}>
                            {convRate !== "—" ? `${convRate}%` : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              step="0.01"
                              value={rowCommission || ""}
                              onChange={(e) =>
                                setCommission({
                                  ...commission,
                                  [row.ref]: e.target.value ? parseFloat(e.target.value) : 0,
                                })
                              }
                              placeholder="$0"
                              className="bg-white/5 border border-white/10 px-2 py-1 text-white w-20 text-center focus:outline-none focus:border-white/40"
                            />
                          </td>
                          <td className="px-4 py-3 text-amber-400 font-mono">
                            ${payout.toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            <CopyBtn
                              value={`https://obliveyon.com/?ref=${row.ref}`}
                              onCopy={() => showToast("Link copied!")}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
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

function RefCard({
  row,
  views: viewCount,
  onViewsChange,
  expanded,
  onExpandedChange,
  getChannelInfo,
}: {
  row: AggregatedRef;
  views: number | undefined;
  onViewsChange: (v: number) => void;
  expanded: Set<string>;
  onExpandedChange: (s: Set<string>) => void;
  getChannelInfo: (ref: string) => { colorClass: string; textColor: string; displayName: string };
}) {
  const isExpanded = expanded.has(row.ref);
  const { colorClass, textColor, displayName } = getChannelInfo(row.ref);
  const percentage = 0; // Will be calculated by parent
  const convRate = viewCount ? ((row.count / viewCount) * 100).toFixed(2) : null;

  // Velocity sparkline data (last 7 days)
  const today = new Date();
  const sparklineData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    const dateKey = date.toISOString().split("T")[0];
    return { date: dateKey.slice(5), value: row.signupsByDay[dateKey] || 0 };
  });

  return (
    <div className={`border p-6 transition-all duration-300 ${colorClass}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-mono text-sm text-white break-all">{row.ref}</h3>
            <span className={`text-[10px] tracking-wider uppercase px-2 py-1 rounded ${textColor}`}>
              {displayName}
            </span>
          </div>
          <p className="text-xs text-white/50 tracking-wider">
            {new Date(row.lastSeen).toLocaleDateString()}
          </p>
        </div>
        <CopyBtn
          value={`https://obliveyon.com/?ref=${row.ref}`}
          onCopy={() => {}}
        />
      </div>

      <div className="mb-4">
        <p className="text-3xl font-light text-white">{row.count}</p>
        <p className="text-xs text-white/50 tracking-wider uppercase mt-1">Signups</p>
      </div>

      {/* Velocity Sparkline */}
      <div className="mb-4 pb-4 border-b border-white/10">
        <p className="text-xs text-white/50 tracking-wider uppercase mb-2">7-day trend</p>
        <ResponsiveContainer width="100%" height={30}>
          <BarChart data={sparklineData}>
            <Bar dataKey="value" fill="currentColor" radius={1} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* View Count Input */}
      <div className="mb-4">
        <label className="text-xs text-white/50 tracking-wider uppercase block mb-1">
          Views
        </label>
        <input
          type="number"
          value={viewCount || ""}
          onChange={(e) => onViewsChange(e.target.value ? parseInt(e.target.value) : 0)}
          placeholder="Enter view count"
          className="w-full bg-white/5 border border-white/20 px-3 py-2 text-xs text-white focus:outline-none focus:border-white/40"
        />
        {convRate && (
          <p className="text-xs text-green-400 mt-2">
            Conversion rate: <strong>{convRate}%</strong>
          </p>
        )}
      </div>

      <button
        onClick={() => {
          const next = new Set(expanded);
          if (next.has(row.ref)) next.delete(row.ref);
          else next.add(row.ref);
          onExpandedChange(next);
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
