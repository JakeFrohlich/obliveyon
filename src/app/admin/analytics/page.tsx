"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
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

type PlatformLink = {
  platform: "tiktok" | "youtube" | "instagram";
  url: string;
};

type SortMode = "signups" | "views" | "conv" | "recent";

const PW_KEY = "obliveyon_admin_pw";

const PLATFORM_CONFIG = {
  youtube: { color: "#FF0000", bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", icon: "▶" },
  tiktok: { color: "#FF0050", bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", icon: "♪" },
  instagram: { color: "#E1306C", bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", icon: "◉" },
} as const;

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}

function getConvColor(rate: number): string {
  if (rate >= 5) return "text-emerald-400";
  if (rate >= 2) return "text-amber-400";
  if (rate > 0) return "text-orange-400";
  return "text-white/40";
}

function getConvBadge(rate: number): { text: string; bg: string } {
  if (rate >= 5) return { text: "Excellent", bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };
  if (rate >= 2) return { text: "Good", bg: "bg-amber-500/20 text-amber-300 border-amber-500/30" };
  if (rate > 0) return { text: "Fair", bg: "bg-orange-500/20 text-orange-300 border-orange-500/30" };
  return { text: "No Data", bg: "bg-white/5 text-white/40 border-white/10" };
}

export default function AnalyticsPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [toast, setToast] = useState<{ msg: string; id: number } | null>(null);
  const [tab, setTab] = useState<"ads" | "affiliates" | "overview">("overview");
  const [links, setLinks] = useState<Record<string, PlatformLink[]>>({});
  const [views, setViews] = useState<Record<string, number>>({});
  const [commission, setCommission] = useState<Record<string, number>>({});
  const [editingRef, setEditingRef] = useState<string | null>(null);
  const [editingViews, setEditingViews] = useState<string | null>(null);
  const [viewsInput, setViewsInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("signups");
  const [expandedRef, setExpandedRef] = useState<string | null>(null);
  const [newLink, setNewLink] = useState<{ platform: "tiktok" | "youtube" | "instagram"; url: string }>({
    platform: "youtube",
    url: "",
  });

  useEffect(() => {
    const saved = sessionStorage.getItem(PW_KEY);
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
    const savedLinks = localStorage.getItem("obliveyon_links");
    if (savedLinks) setLinks(JSON.parse(savedLinks));
    const savedViews = localStorage.getItem("obliveyon_views");
    if (savedViews) setViews(JSON.parse(savedViews));
    const savedCommission = localStorage.getItem("obliveyon_commission");
    if (savedCommission) setCommission(JSON.parse(savedCommission));
  }, []);

  useEffect(() => {
    localStorage.setItem("obliveyon_links", JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    localStorage.setItem("obliveyon_views", JSON.stringify(views));
  }, [views]);

  useEffect(() => {
    localStorage.setItem("obliveyon_commission", JSON.stringify(commission));
  }, [commission]);

  const fetchData = useCallback(
    async (pw: string, force = false) => {
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

        for (const ref in links) {
          if (links[ref].length > 0) {
            try {
              const scrapeRes = await fetch("/api/admin/scrape-views", {
                method: "POST",
                headers: { Authorization: `Bearer ${pw}`, "Content-Type": "application/json" },
                body: JSON.stringify({ links: links[ref] }),
              });
              if (scrapeRes.ok) {
                const { views: scrapedViews } = (await scrapeRes.json()) as { views: number };
                if (scrapedViews > 0) {
                  setViews((prev) => ({ ...prev, [ref]: scrapedViews }));
                }
              }
            } catch (e) {
              console.error(`Failed to scrape views for ${ref}:`, e);
            }
          }
        }
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    },
    [links]
  );

  useEffect(() => {
    if (authed) fetchData(password);
  }, [authed, password, fetchData]);

  useEffect(() => {
    if (!autoRefresh || !authed) return;
    const id = setInterval(() => fetchData(password, true), 60_000);
    return () => clearInterval(id);
  }, [autoRefresh, authed, password, fetchData]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  const showToast = (msg: string) => setToast({ msg, id: Date.now() });

  const allData = data?.data ?? [];
  const adRefs = allData.filter((r) => !r.ref.startsWith("aff_"));
  const affiliateRefs = allData.filter((r) => r.ref.startsWith("aff_"));

  const activeRefs = useMemo(() => {
    let refs: AggregatedRef[] = [];
    if (tab === "ads") refs = adRefs;
    else if (tab === "affiliates") refs = affiliateRefs;
    else refs = allData;

    if (search) refs = refs.filter((r) => r.ref.toLowerCase().includes(search.toLowerCase()));

    const sorted = [...refs].sort((a, b) => {
      if (sortMode === "signups") return b.count - a.count;
      if (sortMode === "views") return (views[b.ref] || 0) - (views[a.ref] || 0);
      if (sortMode === "conv") {
        const aConv = views[a.ref] ? a.count / views[a.ref] : 0;
        const bConv = views[b.ref] ? b.count / views[b.ref] : 0;
        return bConv - aConv;
      }
      return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime();
    });
    return sorted;
  }, [tab, adRefs, affiliateRefs, allData, search, sortMode, views]);

  const totalSignups = activeRefs.reduce((sum, r) => sum + r.count, 0);
  const totalViews = activeRefs.reduce((sum, r) => sum + (views[r.ref] || 0), 0);
  const avgConvRate = totalViews > 0 ? (totalSignups / totalViews) * 100 : 0;
  const topCampaign = activeRefs[0];

  const last7DaysData = useMemo(() => {
    const days: { date: string; signups: number; label: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      let signups = 0;
      for (const ref of activeRefs) {
        signups += ref.signupsByDay?.[key] || 0;
      }
      days.push({ date: key, signups, label });
    }
    return days;
  }, [activeRefs]);

  const platformBreakdown = useMemo(() => {
    const counts = { youtube: 0, tiktok: 0, instagram: 0 };
    for (const ref of activeRefs) {
      const refLinks = links[ref.ref] || [];
      const signups = ref.count;
      const platformsCount = refLinks.length || 1;
      for (const link of refLinks) {
        counts[link.platform] += signups / platformsCount;
      }
      if (refLinks.length === 0) {
        counts.youtube += signups / 3;
        counts.tiktok += signups / 3;
        counts.instagram += signups / 3;
      }
    }
    return [
      { name: "YouTube", value: Math.round(counts.youtube), fill: "#FF0000" },
      { name: "TikTok", value: Math.round(counts.tiktok), fill: "#FF0050" },
      { name: "Instagram", value: Math.round(counts.instagram), fill: "#E1306C" },
    ];
  }, [activeRefs, links]);

  const exportCSV = () => {
    const headers = ["Campaign", "Signups", "Views", "Conversion Rate %", "First Seen", "Last Seen", "Platforms", "Commission/Signup", "Total Payout"];
    const rows = activeRefs.map((r) => {
      const rowViews = views[r.ref] || 0;
      const conv = rowViews ? ((r.count / rowViews) * 100).toFixed(2) : "0";
      const platforms = (links[r.ref] || []).map((l) => l.platform).join(", ");
      const comm = commission[r.ref] || 0;
      return [r.ref, r.count, rowViews, conv, r.firstSeen, r.lastSeen, platforms, comm.toFixed(2), (r.count * comm).toFixed(2)];
    });
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `obliveyon-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported!");
  };

  if (!authed) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center px-4">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-emerald-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-teal-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchData(password);
          }}
          className="w-full max-w-sm relative z-10"
        >
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl px-8 py-12 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl tracking-[0.2em] uppercase text-white text-center font-light mb-2">Analytics</h1>
            <p className="text-[10px] text-white/40 text-center tracking-widest uppercase mb-8">Admin Access Required</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all mb-6"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs tracking-[0.15em] uppercase font-medium rounded-xl hover:from-emerald-400 hover:to-teal-400 hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Enter Dashboard"}
            </button>
            {error && <p className="text-xs text-red-400 text-center mt-4 animate-pulse">{error}</p>}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-black">
      {/* Ambient gradient background */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl tracking-[0.15em] uppercase text-white font-light">
                  Obliveyon <span className="text-emerald-400">/</span> Analytics
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase">
                    {loading ? "Syncing..." : `Live · ${data?.total ?? 0} profiles tracked`}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="hidden sm:flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/60 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="accent-emerald-500"
                />
                Auto-refresh
              </label>
              <button
                onClick={exportCSV}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] tracking-widest uppercase hover:bg-white/10 hover:border-white/20 transition-all text-white/70 flex items-center gap-1.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
              <button
                onClick={() => fetchData(password, true)}
                disabled={loading}
                className="px-3 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-lg text-[10px] tracking-widest uppercase hover:from-emerald-500/30 hover:to-teal-500/30 transition-all text-emerald-300 disabled:opacity-50 flex items-center gap-1.5"
              >
                <svg className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
            {(
              [
                { key: "overview", label: "Overview", icon: "◎" },
                { key: "ads", label: "Your Ads", icon: "◈" },
                { key: "affiliates", label: "Affiliates", icon: "◇" },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-2 rounded-lg text-[11px] tracking-[0.15em] uppercase font-medium transition-all flex items-center gap-2 ${
                  tab === t.key
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-sm">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Signups",
                value: totalSignups.toLocaleString(),
                accent: "from-emerald-500/20 to-emerald-500/5",
                border: "border-emerald-500/20",
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                sparkData: last7DaysData,
              },
              {
                label: "Total Views",
                value: formatNumber(totalViews),
                accent: "from-cyan-500/20 to-cyan-500/5",
                border: "border-cyan-500/20",
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
              },
              {
                label: "Avg. Conv. Rate",
                value: `${avgConvRate.toFixed(2)}%`,
                accent: "from-amber-500/20 to-amber-500/5",
                border: "border-amber-500/20",
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
              },
              {
                label: "Active Campaigns",
                value: activeRefs.length.toString(),
                accent: "from-purple-500/20 to-purple-500/5",
                border: "border-purple-500/20",
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className={`relative overflow-hidden backdrop-blur-xl bg-gradient-to-br ${kpi.accent} bg-white/[0.02] border ${kpi.border} rounded-2xl p-5 hover:border-white/20 transition-all group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:text-white transition-all">
                    {kpi.icon}
                  </div>
                </div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-white/40 font-medium mb-1">{kpi.label}</p>
                <p className="text-3xl text-white font-light tracking-tight">{kpi.value}</p>
                {kpi.sparkData && kpi.sparkData.length > 0 && (
                  <div className="h-8 mt-3 -mx-1" style={{ minWidth: 0 }}>
                    <ResponsiveContainer width="99%" height={32}>
                      <AreaChart data={kpi.sparkData}>
                        <defs>
                          <linearGradient id={`spark-${kpi.label}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="signups" stroke="#10b981" strokeWidth={1.5} fill={`url(#spark-${kpi.label})`} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Overview Charts (only on overview tab) */}
          {tab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
              {/* 7-day trend */}
              <div className="lg:col-span-2 backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium">Signups · Last 7 Days</h3>
                    <p className="text-2xl text-white font-light mt-1">{last7DaysData.reduce((s, d) => s + d.signups, 0)}</p>
                  </div>
                  <div className="text-[10px] text-white/40 tracking-widest uppercase">Daily Trend</div>
                </div>
                <div className="h-56" style={{ minWidth: 0 }}>
                  <ResponsiveContainer width="99%" height={224}>
                    <AreaChart data={last7DaysData}>
                      <defs>
                        <linearGradient id="mainGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.6} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="label"
                        stroke="rgba(255,255,255,0.3)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.95)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          color: "white",
                          fontSize: "11px",
                          backdropFilter: "blur(12px)",
                        }}
                        cursor={{ stroke: "rgba(16, 185, 129, 0.3)", strokeWidth: 1 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="signups"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="url(#mainGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Platform breakdown */}
              <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                <h3 className="text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-6">Platform Mix</h3>
                <div className="space-y-4">
                  {platformBreakdown.map((p) => {
                    const total = platformBreakdown.reduce((s, x) => s + x.value, 0);
                    const pct = total > 0 ? (p.value / total) * 100 : 0;
                    return (
                      <div key={p.name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }} />
                            <span className="text-xs text-white/80">{p.name}</span>
                          </div>
                          <span className="text-xs text-white/60 tabular-nums">{pct.toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${pct}%`, backgroundColor: p.fill, boxShadow: `0 0 12px ${p.fill}80` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard / Top performers */}
          {tab === "overview" && activeRefs.length > 0 && (
            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium">Top Performers</h3>
                <span className="text-[10px] text-white/30 tracking-widest uppercase">Top 5 by Signups</span>
              </div>
              <div className="space-y-2">
                {activeRefs.slice(0, 5).map((row, idx) => {
                  const rowViews = views[row.ref] || 0;
                  const convRate = rowViews ? (row.count / rowViews) * 100 : 0;
                  const maxSignups = activeRefs[0]?.count || 1;
                  const barPct = (row.count / maxSignups) * 100;
                  const medals = ["🥇", "🥈", "🥉", "4", "5"];

                  return (
                    <div
                      key={row.ref}
                      className="relative group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all"
                    >
                      <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold ${
                        idx < 3 ? "" : "bg-white/5 text-white/40"
                      }`}>
                        {idx < 3 ? <span className="text-lg">{medals[idx]}</span> : medals[idx]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-1.5">
                          <span className="font-mono text-sm text-white truncate">{row.ref}</span>
                          <div className="flex items-center gap-4 text-xs tabular-nums">
                            <span className="text-white/90">{row.count} signups</span>
                            <span className="text-white/50 hidden sm:inline">{formatNumber(rowViews)} views</span>
                            <span className={`${getConvColor(convRate)} font-medium`}>{convRate.toFixed(2)}%</span>
                          </div>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                            style={{ width: `${barPct}%`, boxShadow: "0 0 8px rgba(16, 185, 129, 0.5)" }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search & Filters */}
          {tab !== "overview" && (
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search campaigns..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
              <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
                {(
                  [
                    { key: "signups", label: "Signups" },
                    { key: "views", label: "Views" },
                    { key: "conv", label: "Conv %" },
                    { key: "recent", label: "Recent" },
                  ] as const
                ).map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSortMode(s.key)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] tracking-widest uppercase font-medium transition-all ${
                      sortMode === s.key
                        ? "bg-white/10 text-white"
                        : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Campaign Cards Grid */}
          {activeRefs.length === 0 ? (
            <div className="text-center py-20 backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-white/40 text-sm mb-1">No campaigns yet</p>
              <p className="text-white/30 text-xs">Share a link with <code className="px-2 py-0.5 bg-white/5 rounded text-emerald-400">?ref=name</code> to track</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {activeRefs.map((row, idx) => {
                const rowViews = views[row.ref] || 0;
                const convRate = rowViews ? (row.count / rowViews) * 100 : 0;
                const convRateStr = rowViews ? convRate.toFixed(2) : null;
                const rowLinks = links[row.ref] || [];
                const rowCommission = commission[row.ref] || 0;
                const payout = row.count * rowCommission;
                const isEditingLinks = editingRef === row.ref;
                const isExpanded = expandedRef === row.ref;
                const badge = getConvBadge(convRate);

                const sparkData = Object.entries(row.signupsByDay || {})
                  .sort(([a], [b]) => a.localeCompare(b))
                  .slice(-7)
                  .map(([date, signups]) => ({ date, signups }));

                return (
                  <div
                    key={row.ref}
                    className="relative group backdrop-blur-xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-2xl p-5 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300"
                  >
                    {/* Rank badge */}
                    {idx < 3 && (
                      <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-emerald-500/50 z-10">
                        #{idx + 1}
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-mono text-base text-white truncate" title={row.ref}>{row.ref}</h3>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full border tracking-widest uppercase whitespace-nowrap ${badge.bg}`}>
                            {badge.text}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/40 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-white/30" />
                          Last: {new Date(row.lastSeen).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`https://obliveyon.com/?ref=${row.ref}`);
                            showToast(`Link copied for ${row.ref}`);
                          }}
                          className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all flex items-center justify-center text-white/60 hover:text-emerald-300"
                          title="Copy link"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setExpandedRef(isExpanded ? null : row.ref)}
                          className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center text-white/60 hover:text-white"
                          title="Details"
                        >
                          <svg className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                        <p className="text-[9px] text-white/40 tracking-widest uppercase mb-1">Signups</p>
                        <p className="text-xl text-white font-light tabular-nums">{row.count}</p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 relative group/views">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[9px] text-white/40 tracking-widest uppercase">Views</p>
                          <button
                            onClick={() => {
                              setEditingViews(row.ref);
                              setViewsInput(String(rowViews));
                            }}
                            className="opacity-0 group-hover/views:opacity-100 text-[9px] text-emerald-400 hover:text-emerald-300 transition-all"
                          >
                            Edit
                          </button>
                        </div>
                        {editingViews === row.ref ? (
                          <div className="flex items-center gap-1 mt-0.5">
                            <input
                              type="number"
                              value={viewsInput}
                              onChange={(e) => setViewsInput(e.target.value)}
                              className="text-sm bg-white/10 border border-emerald-500/30 rounded px-1.5 py-0.5 text-white flex-1 min-w-0 focus:outline-none tabular-nums"
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                const num = parseInt(viewsInput) || 0;
                                setViews({ ...views, [row.ref]: num });
                                setEditingViews(null);
                                showToast("Views updated!");
                              }}
                              className="text-[9px] text-emerald-400 font-medium"
                            >
                              ✓
                            </button>
                            <button onClick={() => setEditingViews(null)} className="text-[9px] text-white/40">
                              ✕
                            </button>
                          </div>
                        ) : (
                          <p className="text-xl text-white font-light tabular-nums">{formatNumber(rowViews)}</p>
                        )}
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                        <p className="text-[9px] text-white/40 tracking-widest uppercase mb-1">Conv.</p>
                        <p className={`text-xl font-light tabular-nums ${getConvColor(convRate)}`}>
                          {convRateStr ? `${convRateStr}%` : "—"}
                        </p>
                      </div>
                    </div>

                    {/* Sparkline */}
                    {sparkData.length > 0 && (
                      <div className="mb-4 -mx-1">
                        <div className="flex items-center justify-between mb-1 px-1">
                          <span className="text-[9px] text-white/40 tracking-widest uppercase">7-day signups</span>
                          <span className="text-[9px] text-white/30 tabular-nums">{sparkData.reduce((s, d) => s + d.signups, 0)} total</span>
                        </div>
                        <div className="h-12" style={{ minWidth: 0 }}>
                          <ResponsiveContainer width="99%" height={48}>
                            <AreaChart data={sparkData}>
                              <defs>
                                <linearGradient id={`card-spark-${row.ref}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <Area type="monotone" dataKey="signups" stroke="#10b981" strokeWidth={1.5} fill={`url(#card-spark-${row.ref})`} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                                  border: "1px solid rgba(16, 185, 129, 0.3)",
                                  borderRadius: "8px",
                                  fontSize: "10px",
                                  padding: "4px 8px",
                                }}
                                cursor={{ stroke: "rgba(16, 185, 129, 0.3)", strokeWidth: 1 }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Platform pills */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[9px] text-white/40 tracking-widest uppercase font-medium">Platforms · {rowLinks.length}</p>
                        {!isEditingLinks && (
                          <button
                            onClick={() => {
                              setEditingRef(row.ref);
                              setNewLink({ platform: "youtube", url: "" });
                            }}
                            className="text-[9px] text-emerald-400 hover:text-emerald-300 tracking-widest uppercase"
                          >
                            + Add
                          </button>
                        )}
                      </div>

                      {isEditingLinks ? (
                        <div className="space-y-1.5">
                          {rowLinks.map((link, i) => {
                            const cfg = PLATFORM_CONFIG[link.platform];
                            return (
                              <div key={i} className={`flex items-center gap-2 p-1.5 ${cfg.bg} border ${cfg.border} rounded-lg`}>
                                <span className={`${cfg.text} text-sm w-4 text-center`}>{cfg.icon}</span>
                                <span className="text-[10px] text-white/60 flex-1 truncate">{link.url}</span>
                                <button
                                  onClick={() =>
                                    setLinks({ ...links, [row.ref]: rowLinks.filter((_, x) => x !== i) })
                                  }
                                  className="text-red-400 hover:text-red-300 text-xs px-1"
                                >
                                  ✕
                                </button>
                              </div>
                            );
                          })}
                          <div className="flex gap-1 pt-1.5 border-t border-white/5">
                            <select
                              value={newLink.platform}
                              onChange={(e) =>
                                setNewLink({ ...newLink, platform: e.target.value as "tiktok" | "youtube" | "instagram" })
                              }
                              className="text-[10px] bg-white/5 border border-white/10 rounded px-1.5 py-1 text-white focus:outline-none"
                            >
                              <option value="youtube">YouTube</option>
                              <option value="tiktok">TikTok</option>
                              <option value="instagram">Instagram</option>
                            </select>
                            <input
                              type="text"
                              value={newLink.url}
                              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                              placeholder="Paste URL..."
                              className="text-[10px] flex-1 min-w-0 bg-white/5 border border-white/10 rounded px-2 py-1 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/30"
                            />
                            <button
                              onClick={() => {
                                if (newLink.url.trim()) {
                                  setLinks({
                                    ...links,
                                    [row.ref]: [...rowLinks, { platform: newLink.platform, url: newLink.url }],
                                  });
                                  setNewLink({ platform: "youtube", url: "" });
                                }
                              }}
                              className="text-[10px] text-emerald-400 hover:text-emerald-300 font-medium px-2"
                            >
                              Add
                            </button>
                          </div>
                          <button
                            onClick={() => setEditingRef(null)}
                            className="w-full text-[9px] text-white/40 hover:text-white tracking-widest uppercase pt-1.5"
                          >
                            Done
                          </button>
                        </div>
                      ) : rowLinks.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {rowLinks.map((link, i) => {
                            const cfg = PLATFORM_CONFIG[link.platform];
                            return (
                              <a
                                key={i}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-1.5 text-[10px] ${cfg.text} px-2 py-1 ${cfg.bg} border ${cfg.border} rounded-md hover:bg-white/10 transition-all capitalize`}
                              >
                                <span className="text-xs">{cfg.icon}</span>
                                {link.platform}
                              </a>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-[10px] text-white/30 italic py-1">No links. Click +Add.</div>
                      )}
                    </div>

                    {/* Affiliate commission */}
                    {row.ref.startsWith("aff_") && (
                      <div className="pt-4 border-t border-white/5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <label className="text-[9px] text-white/40 tracking-widest uppercase block mb-1">Commission $</label>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={rowCommission || ""}
                              onChange={(e) =>
                                setCommission({
                                  ...commission,
                                  [row.ref]: e.target.value ? parseFloat(e.target.value) : 0,
                                })
                              }
                              className="w-full text-sm bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white tabular-nums focus:outline-none focus:border-emerald-500/30"
                            />
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] text-white/40 tracking-widest uppercase mb-1">Payout</p>
                            <p className="text-lg text-emerald-400 font-light tabular-nums">${payout.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-[9px] text-white/40 tracking-widest uppercase mb-1">First Seen</p>
                            <p className="text-white/80">{new Date(row.firstSeen).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-white/40 tracking-widest uppercase mb-1">Last Seen</p>
                            <p className="text-white/80">{new Date(row.lastSeen).toLocaleString()}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[9px] text-white/40 tracking-widest uppercase mb-2">Recent Emails ({row.emails.length})</p>
                          <div className="max-h-32 overflow-y-auto space-y-0.5">
                            {row.emails.slice(0, 10).map((email, i) => (
                              <div key={i} className="text-[10px] text-white/60 font-mono px-2 py-1 bg-white/[0.02] rounded">
                                {email}
                              </div>
                            ))}
                            {row.emails.length > 10 && (
                              <div className="text-[9px] text-white/30 text-center pt-1">
                                + {row.emails.length - 10} more
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] text-white/30 tracking-widest uppercase">
              Obliveyon Analytics · Local Dev Only
            </p>
            <p className="text-[10px] text-white/30 tracking-widest uppercase tabular-nums">
              {data?.fetchedAt ? new Date(data.fetchedAt).toLocaleTimeString() : "--"}
            </p>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-[slideIn_0.3s_ease-out]">
          <div className="backdrop-blur-xl bg-gradient-to-r from-emerald-500/90 to-teal-500/90 border border-emerald-400/50 text-white px-4 py-3 rounded-xl text-xs tracking-widest font-medium shadow-2xl shadow-emerald-500/30 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {toast.msg}
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-6 right-6 z-50 backdrop-blur-xl bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-xs">
          {error}
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
