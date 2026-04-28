"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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

type SortMode = "signups" | "views" | "conv" | "recent" | "payout" | "name";
type ViewMode = "cards" | "table";
type TabMode = "overview" | "ads" | "affiliates";

const PW_KEY = "obliveyon_admin_pw";

const PLATFORM_CONFIG = {
  youtube: {
    color: "#FF0000",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    icon: "▶",
  },
  tiktok: {
    color: "#FF0050",
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
    text: "text-pink-400",
    icon: "♪",
  },
  instagram: {
    color: "#E1306C",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    icon: "◉",
  },
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
  return "text-white/30";
}

function getConvBadge(rate: number): { text: string; bg: string } {
  if (rate >= 5) return { text: "Excellent", bg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25" };
  if (rate >= 2) return { text: "Good", bg: "bg-amber-500/15 text-amber-300 border-amber-500/25" };
  if (rate > 0) return { text: "Fair", bg: "bg-orange-500/15 text-orange-300 border-orange-500/25" };
  return { text: "No Data", bg: "bg-white/5 text-white/40 border-white/10" };
}

export default function AnalyticsPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [toast, setToast] = useState<{ msg: string; id: number; kind?: "success" | "error" } | null>(null);
  const [tab, setTab] = useState<TabMode>("overview");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [links, setLinks] = useState<Record<string, PlatformLink[]>>({});
  const [views, setViews] = useState<Record<string, number>>({});
  const [commission, setCommission] = useState<Record<string, number>>({});
  const [editingCell, setEditingCell] = useState<{ ref: string; field: "views" | "commission" } | null>(null);
  const [cellInput, setCellInput] = useState("");
  const [selectedRefs, setSelectedRefs] = useState<Set<string>>(new Set());
  const [detailRef, setDetailRef] = useState<string | null>(null);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [bulkImportText, setBulkImportText] = useState("");
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("signups");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [editingLinksRef, setEditingLinksRef] = useState<string | null>(null);
  const [newLink, setNewLink] = useState<{ platform: "tiktok" | "youtube" | "instagram"; url: string }>({
    platform: "youtube",
    url: "",
  });
  const listRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(600);

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
    const savedViewMode = localStorage.getItem("obliveyon_view_mode");
    if (savedViewMode === "cards" || savedViewMode === "table") setViewMode(savedViewMode);
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
  useEffect(() => {
    localStorage.setItem("obliveyon_view_mode", viewMode);
  }, [viewMode]);

  // Measure available height for virtualized list
  useEffect(() => {
    const updateHeight = () => {
      if (listRef.current) {
        const rect = listRef.current.getBoundingClientRect();
        const available = window.innerHeight - rect.top - 100;
        setListHeight(Math.max(400, available));
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [tab, viewMode, authed]);

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
                if (scrapedViews > 0) setViews((prev) => ({ ...prev, [ref]: scrapedViews }));
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

  const showToast = (msg: string, kind: "success" | "error" = "success") =>
    setToast({ msg, id: Date.now(), kind });

  const allData = data?.data ?? [];
  const adRefs = allData.filter((r) => !r.ref.startsWith("aff_"));
  const affiliateRefs = allData.filter((r) => r.ref.startsWith("aff_"));

  const activeRefs = useMemo(() => {
    let refs: AggregatedRef[] = [];
    if (tab === "ads") refs = adRefs;
    else if (tab === "affiliates") refs = affiliateRefs;
    else refs = allData;

    if (search) refs = refs.filter((r) => r.ref.toLowerCase().includes(search.toLowerCase()));

    const dir = sortDir === "desc" ? 1 : -1;
    const sorted = [...refs].sort((a, b) => {
      if (sortMode === "signups") return (b.count - a.count) * dir;
      if (sortMode === "views") return ((views[b.ref] || 0) - (views[a.ref] || 0)) * dir;
      if (sortMode === "conv") {
        const aConv = views[a.ref] ? a.count / views[a.ref] : 0;
        const bConv = views[b.ref] ? b.count / views[b.ref] : 0;
        return (bConv - aConv) * dir;
      }
      if (sortMode === "payout") {
        const ap = a.count * (commission[a.ref] || 0);
        const bp = b.count * (commission[b.ref] || 0);
        return (bp - ap) * dir;
      }
      if (sortMode === "name") return a.ref.localeCompare(b.ref) * (dir === 1 ? 1 : -1);
      return (new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()) * dir;
    });
    return sorted;
  }, [tab, adRefs, affiliateRefs, allData, search, sortMode, sortDir, views, commission]);

  const totalSignups = activeRefs.reduce((sum, r) => sum + r.count, 0);
  const totalViews = activeRefs.reduce((sum, r) => sum + (views[r.ref] || 0), 0);
  const avgConvRate = totalViews > 0 ? (totalSignups / totalViews) * 100 : 0;
  const totalPayout = activeRefs.reduce((sum, r) => sum + r.count * (commission[r.ref] || 0), 0);

  const last7DaysData = useMemo(() => {
    const days: { date: string; signups: number; label: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      let signups = 0;
      for (const ref of activeRefs) signups += ref.signupsByDay?.[key] || 0;
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
      for (const link of refLinks) counts[link.platform] += signups / platformsCount;
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
    const headers = [
      "Campaign",
      "Signups",
      "Views",
      "Conversion Rate %",
      "First Seen",
      "Last Seen",
      "Platforms",
      "Commission/Signup",
      "Total Payout",
    ];
    const rows = activeRefs.map((r) => {
      const rowViews = views[r.ref] || 0;
      const conv = rowViews ? ((r.count / rowViews) * 100).toFixed(2) : "0";
      const platforms = (links[r.ref] || []).map((l) => l.platform).join("; ");
      const comm = commission[r.ref] || 0;
      return [
        r.ref,
        r.count,
        rowViews,
        conv,
        r.firstSeen,
        r.lastSeen,
        platforms,
        comm.toFixed(2),
        (r.count * comm).toFixed(2),
      ];
    });
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `obliveyon-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported");
  };

  const handleBulkImport = () => {
    const lines = bulkImportText.trim().split("\n");
    let imported = 0;
    let errors = 0;
    const newViews = { ...views };
    const newCommission = { ...commission };

    for (const line of lines) {
      const [ref, viewsStr, commStr] = line.split(",").map((s) => s.trim());
      if (!ref) continue;
      const v = parseInt(viewsStr);
      if (!isNaN(v)) {
        newViews[ref] = v;
        imported++;
      } else {
        errors++;
      }
      const c = parseFloat(commStr);
      if (!isNaN(c)) newCommission[ref] = c;
    }

    setViews(newViews);
    setCommission(newCommission);
    setBulkImportOpen(false);
    setBulkImportText("");
    showToast(`Imported ${imported} rows${errors ? ` (${errors} errors)` : ""}`, errors ? "error" : "success");
  };

  const toggleSort = (mode: SortMode) => {
    if (sortMode === mode) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else {
      setSortMode(mode);
      setSortDir("desc");
    }
  };

  const toggleSelectAll = () => {
    if (selectedRefs.size === activeRefs.length) setSelectedRefs(new Set());
    else setSelectedRefs(new Set(activeRefs.map((r) => r.ref)));
  };

  const detailData = detailRef ? activeRefs.find((r) => r.ref === detailRef) : null;

  if (!authed) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center px-4">
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

  // Table row component for virtualization
  const TableRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const row = activeRefs[index];
    const rowViews = views[row.ref] || 0;
    const convRate = rowViews ? (row.count / rowViews) * 100 : 0;
    const rowCommission = commission[row.ref] || 0;
    const payout = row.count * rowCommission;
    const rowLinks = links[row.ref] || [];
    const isSelected = selectedRefs.has(row.ref);
    const isEven = index % 2 === 0;

    return (
      <div
        style={style}
        className={`flex items-center px-4 border-b border-white/5 hover:bg-white/[0.03] transition-colors ${
          isEven ? "bg-white/[0.01]" : "bg-transparent"
        } ${isSelected ? "bg-emerald-500/5" : ""}`}
      >
        {/* Checkbox */}
        <div className="w-8 flex-shrink-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {
              const next = new Set(selectedRefs);
              if (next.has(row.ref)) next.delete(row.ref);
              else next.add(row.ref);
              setSelectedRefs(next);
            }}
            className="accent-emerald-500"
          />
        </div>

        {/* Rank */}
        <div className="w-10 flex-shrink-0 text-[10px] text-white/30 font-mono tabular-nums">
          #{index + 1}
        </div>

        {/* Campaign name */}
        <div className="flex-1 min-w-0 pr-3">
          <button
            onClick={() => setDetailRef(row.ref)}
            className="font-mono text-sm text-white hover:text-emerald-400 transition-colors truncate block text-left w-full"
            title={row.ref}
          >
            {row.ref}
          </button>
          <p className="text-[9px] text-white/30 truncate">
            {new Date(row.lastSeen).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
        </div>

        {/* Platforms */}
        <div className="w-28 flex-shrink-0 flex gap-1">
          {rowLinks.length > 0 ? (
            rowLinks.slice(0, 3).map((l, i) => {
              const cfg = PLATFORM_CONFIG[l.platform];
              return (
                <span
                  key={i}
                  className={`w-5 h-5 rounded flex items-center justify-center text-[10px] ${cfg.bg} ${cfg.text} border ${cfg.border}`}
                  title={l.platform}
                >
                  {cfg.icon}
                </span>
              );
            })
          ) : (
            <span className="text-[10px] text-white/20">—</span>
          )}
          <button
            onClick={() => {
              setEditingLinksRef(row.ref);
              setNewLink({ platform: "youtube", url: "" });
            }}
            className="w-5 h-5 rounded bg-white/5 border border-white/10 text-white/40 hover:text-emerald-400 hover:border-emerald-500/30 text-[10px] flex items-center justify-center"
            title="Edit platform links"
          >
            +
          </button>
        </div>

        {/* Signups */}
        <div className="w-20 flex-shrink-0 text-right">
          <p className="text-sm text-white font-light tabular-nums">{row.count}</p>
        </div>

        {/* Views (editable) */}
        <div className="w-24 flex-shrink-0 text-right pr-2">
          {editingCell?.ref === row.ref && editingCell?.field === "views" ? (
            <input
              type="number"
              value={cellInput}
              onChange={(e) => setCellInput(e.target.value)}
              onBlur={() => {
                const num = parseInt(cellInput) || 0;
                setViews({ ...views, [row.ref]: num });
                setEditingCell(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const num = parseInt(cellInput) || 0;
                  setViews({ ...views, [row.ref]: num });
                  setEditingCell(null);
                }
                if (e.key === "Escape") setEditingCell(null);
              }}
              className="w-full text-sm bg-white/10 border border-emerald-500/30 rounded px-2 py-0.5 text-white text-right tabular-nums focus:outline-none"
              autoFocus
            />
          ) : (
            <button
              onClick={() => {
                setEditingCell({ ref: row.ref, field: "views" });
                setCellInput(String(rowViews));
              }}
              className="text-sm text-white/80 hover:text-emerald-400 hover:bg-white/5 rounded px-2 py-0.5 font-light tabular-nums w-full text-right transition-colors"
            >
              {formatNumber(rowViews)}
            </button>
          )}
        </div>

        {/* Conversion rate */}
        <div className="w-24 flex-shrink-0 text-right pr-2">
          <p className={`text-sm font-light tabular-nums ${getConvColor(convRate)}`}>
            {rowViews > 0 ? `${convRate.toFixed(2)}%` : "—"}
          </p>
        </div>

        {/* Commission (editable, affiliates only) */}
        <div className="w-24 flex-shrink-0 text-right pr-2">
          {row.ref.startsWith("aff_") ? (
            editingCell?.ref === row.ref && editingCell?.field === "commission" ? (
              <input
                type="number"
                step="0.01"
                value={cellInput}
                onChange={(e) => setCellInput(e.target.value)}
                onBlur={() => {
                  const num = parseFloat(cellInput) || 0;
                  setCommission({ ...commission, [row.ref]: num });
                  setEditingCell(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const num = parseFloat(cellInput) || 0;
                    setCommission({ ...commission, [row.ref]: num });
                    setEditingCell(null);
                  }
                  if (e.key === "Escape") setEditingCell(null);
                }}
                className="w-full text-sm bg-white/10 border border-emerald-500/30 rounded px-2 py-0.5 text-white text-right tabular-nums focus:outline-none"
                autoFocus
              />
            ) : (
              <button
                onClick={() => {
                  setEditingCell({ ref: row.ref, field: "commission" });
                  setCellInput(String(rowCommission || ""));
                }}
                className="text-sm text-white/80 hover:text-emerald-400 hover:bg-white/5 rounded px-2 py-0.5 font-light tabular-nums w-full text-right transition-colors"
              >
                {rowCommission ? `$${rowCommission.toFixed(2)}` : <span className="text-white/30">—</span>}
              </button>
            )
          ) : (
            <span className="text-white/20 text-xs">—</span>
          )}
        </div>

        {/* Payout */}
        <div className="w-24 flex-shrink-0 text-right pr-2">
          {row.ref.startsWith("aff_") && payout > 0 ? (
            <p className="text-sm text-emerald-400 font-light tabular-nums">${payout.toFixed(2)}</p>
          ) : (
            <span className="text-white/20 text-xs">—</span>
          )}
        </div>

        {/* Actions */}
        <div className="w-20 flex-shrink-0 flex justify-end gap-1">
          <button
            onClick={() => {
              navigator.clipboard.writeText(`https://obliveyon.com/?ref=${row.ref}`);
              showToast(`Link copied: ${row.ref}`);
            }}
            className="w-6 h-6 rounded bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 text-white/40 flex items-center justify-center transition-colors"
            title="Copy link"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={() => setDetailRef(row.ref)}
            className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 hover:text-white text-white/40 flex items-center justify-center transition-colors"
            title="Details"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-black">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-6 lg:px-10 py-6">
        <div className="max-w-[1800px] mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl tracking-[0.15em] uppercase text-white font-light leading-none">
                  Obliveyon <span className="text-emerald-400/60">·</span> Analytics
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${loading ? "bg-amber-400" : "bg-emerald-400"} animate-pulse`} />
                  <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase">
                    {loading ? "Syncing..." : `${data?.total ?? 0} profiles · ${activeRefs.length} campaigns`}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="hidden md:flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/60 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="accent-emerald-500" />
                Auto-refresh
              </label>
              <button
                onClick={() => setBulkImportOpen(true)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] tracking-widest uppercase hover:bg-white/10 transition-all text-white/70 flex items-center gap-1.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import
              </button>
              <button
                onClick={exportCSV}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] tracking-widest uppercase hover:bg-white/10 transition-all text-white/70 flex items-center gap-1.5"
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

          {/* Tabs + View toggle */}
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
              {(
                [
                  { key: "overview", label: "Overview", icon: "◎" },
                  { key: "ads", label: "Your Ads", icon: "◈", count: adRefs.length },
                  { key: "affiliates", label: "Affiliates", icon: "◇", count: affiliateRefs.length },
                ] as const
              ).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-4 py-2 rounded-lg text-[11px] tracking-[0.15em] uppercase font-medium transition-all flex items-center gap-2 ${
                    tab === t.key ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20" : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-sm">{t.icon}</span>
                  {t.label}
                  {"count" in t && t.count !== undefined && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full tabular-nums ${tab === t.key ? "bg-white/20" : "bg-white/10"}`}>
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {tab !== "overview" && (
              <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
                {(
                  [
                    { key: "table", icon: (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    ), label: "Table" },
                    { key: "cards", icon: (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    ), label: "Cards" },
                  ] as const
                ).map((v) => (
                  <button
                    key={v.key}
                    onClick={() => setViewMode(v.key)}
                    className={`px-3 py-2 rounded-lg text-[10px] tracking-widest uppercase font-medium transition-all flex items-center gap-1.5 ${
                      viewMode === v.key ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {v.icon}
                    {v.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              {
                label: "Signups",
                value: totalSignups.toLocaleString(),
                sub: last7DaysData.reduce((s, d) => s + d.signups, 0) + " this week",
                accent: "from-emerald-500/15 to-transparent",
                border: "border-emerald-500/20",
                iconColor: "text-emerald-400",
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
                sub: Object.keys(views).length + " campaigns tracked",
                accent: "from-cyan-500/15 to-transparent",
                border: "border-cyan-500/20",
                iconColor: "text-cyan-400",
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
                sub: avgConvRate >= 5 ? "Excellent performance" : avgConvRate >= 2 ? "Good" : avgConvRate > 0 ? "Needs optimization" : "No data yet",
                accent: "from-amber-500/15 to-transparent",
                border: "border-amber-500/20",
                iconColor: "text-amber-400",
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
              },
              {
                label: tab === "affiliates" ? "Total Payout" : "Campaigns",
                value: tab === "affiliates" ? `$${totalPayout.toFixed(2)}` : activeRefs.length.toString(),
                sub: tab === "affiliates" ? `${affiliateRefs.filter((r) => commission[r.ref]).length} with commission set` : `${adRefs.length} ads · ${affiliateRefs.length} affiliates`,
                accent: "from-purple-500/15 to-transparent",
                border: "border-purple-500/20",
                iconColor: "text-purple-400",
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className={`relative overflow-hidden backdrop-blur-xl bg-gradient-to-br ${kpi.accent} bg-white/[0.02] border ${kpi.border} rounded-2xl p-5 hover:border-white/20 transition-all group`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center ${kpi.iconColor}`}>
                    {kpi.icon}
                  </div>
                  {kpi.sparkData && kpi.sparkData.length > 0 && (
                    <div className="w-20 h-10" style={{ minWidth: 0 }}>
                      <ResponsiveContainer width="99%" height={40}>
                        <AreaChart data={kpi.sparkData}>
                          <defs>
                            <linearGradient id={`spark-${kpi.label}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="signups" stroke="#10b981" strokeWidth={1.5} fill={`url(#spark-${kpi.label})`} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-white/40 font-medium mb-1">{kpi.label}</p>
                <p className="text-3xl text-white font-light tracking-tight mb-1">{kpi.value}</p>
                <p className="text-[10px] text-white/40">{kpi.sub}</p>
              </div>
            ))}
          </div>

          {/* Overview Charts */}
          {tab === "overview" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
                <div className="lg:col-span-2 backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium">Signups · Last 7 Days</h3>
                      <p className="text-2xl text-white font-light mt-1 tabular-nums">{last7DaysData.reduce((s, d) => s + d.signups, 0)}</p>
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
                        <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
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
                        <Area type="monotone" dataKey="signups" stroke="#10b981" strokeWidth={2} fill="url(#mainGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium mb-5">Platform Mix</h3>
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

              {activeRefs.length > 0 && (
                <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium">Top Performers</h3>
                    <span className="text-[10px] text-white/30 tracking-widest uppercase">Top 10 by Signups</span>
                  </div>
                  <div className="space-y-1.5">
                    {activeRefs.slice(0, 10).map((row, idx) => {
                      const rowViews = views[row.ref] || 0;
                      const convRate = rowViews ? (row.count / rowViews) * 100 : 0;
                      const maxSignups = activeRefs[0]?.count || 1;
                      const barPct = (row.count / maxSignups) * 100;

                      return (
                        <button
                          key={row.ref}
                          onClick={() => setDetailRef(row.ref)}
                          className="w-full relative group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left"
                        >
                          <div className={`w-7 h-7 flex items-center justify-center rounded-lg text-[10px] font-bold tabular-nums ${
                            idx === 0 ? "bg-gradient-to-br from-amber-400 to-yellow-600 text-amber-950 shadow-lg shadow-amber-500/30" :
                            idx === 1 ? "bg-gradient-to-br from-slate-300 to-slate-500 text-slate-900 shadow-lg shadow-slate-400/30" :
                            idx === 2 ? "bg-gradient-to-br from-orange-400 to-amber-700 text-orange-950 shadow-lg shadow-orange-500/30" :
                            "bg-white/5 text-white/40"
                          }`}>
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-4 mb-1.5">
                              <span className="font-mono text-sm text-white truncate">{row.ref}</span>
                              <div className="flex items-center gap-4 text-xs tabular-nums shrink-0">
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
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Search & Filters (for ads/affiliates tabs) */}
          {tab !== "overview" && (
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${activeRefs.length} campaigns...`}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
              {selectedRefs.size > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <span className="text-xs text-emerald-300 tracking-wider">{selectedRefs.size} selected</span>
                  <button
                    onClick={() => setSelectedRefs(new Set())}
                    className="text-[10px] text-white/60 hover:text-white tracking-widest uppercase"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Campaign Display */}
          {tab !== "overview" && (
            <>
              {activeRefs.length === 0 ? (
                <div className="text-center py-20 backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-white/40 text-sm mb-1">No campaigns found</p>
                  <p className="text-white/30 text-xs">{search ? "Try a different search term" : "Share a link with ?ref=name to start tracking"}</p>
                </div>
              ) : viewMode === "table" ? (
                <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
                  {/* Table header */}
                  <div className="flex items-center px-4 py-3 bg-white/[0.03] border-b border-white/10 sticky top-0 z-10">
                    <div className="w-8 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={selectedRefs.size === activeRefs.length && activeRefs.length > 0}
                        onChange={toggleSelectAll}
                        className="accent-emerald-500"
                      />
                    </div>
                    <div className="w-10 flex-shrink-0 text-[9px] text-white/40 tracking-widest uppercase font-medium">#</div>
                    <button
                      onClick={() => toggleSort("name")}
                      className="flex-1 min-w-0 pr-3 text-left text-[9px] text-white/40 tracking-widest uppercase font-medium hover:text-white flex items-center gap-1"
                    >
                      Campaign
                      {sortMode === "name" && <span>{sortDir === "desc" ? "↓" : "↑"}</span>}
                    </button>
                    <div className="w-28 flex-shrink-0 text-[9px] text-white/40 tracking-widest uppercase font-medium">Platforms</div>
                    <button
                      onClick={() => toggleSort("signups")}
                      className="w-20 flex-shrink-0 text-right text-[9px] text-white/40 tracking-widest uppercase font-medium hover:text-white flex items-center justify-end gap-1"
                    >
                      Signups
                      {sortMode === "signups" && <span>{sortDir === "desc" ? "↓" : "↑"}</span>}
                    </button>
                    <button
                      onClick={() => toggleSort("views")}
                      className="w-24 flex-shrink-0 text-right pr-2 text-[9px] text-white/40 tracking-widest uppercase font-medium hover:text-white flex items-center justify-end gap-1"
                    >
                      Views
                      {sortMode === "views" && <span>{sortDir === "desc" ? "↓" : "↑"}</span>}
                    </button>
                    <button
                      onClick={() => toggleSort("conv")}
                      className="w-24 flex-shrink-0 text-right pr-2 text-[9px] text-white/40 tracking-widest uppercase font-medium hover:text-white flex items-center justify-end gap-1"
                    >
                      Conv %
                      {sortMode === "conv" && <span>{sortDir === "desc" ? "↓" : "↑"}</span>}
                    </button>
                    <div className="w-24 flex-shrink-0 text-right pr-2 text-[9px] text-white/40 tracking-widest uppercase font-medium">Commission</div>
                    <button
                      onClick={() => toggleSort("payout")}
                      className="w-24 flex-shrink-0 text-right pr-2 text-[9px] text-white/40 tracking-widest uppercase font-medium hover:text-white flex items-center justify-end gap-1"
                    >
                      Payout
                      {sortMode === "payout" && <span>{sortDir === "desc" ? "↓" : "↑"}</span>}
                    </button>
                    <div className="w-20 flex-shrink-0 text-right text-[9px] text-white/40 tracking-widest uppercase font-medium">Actions</div>
                  </div>

                  {/* Rows */}
                  <div ref={listRef} style={{ maxHeight: listHeight, overflowY: "auto" }}>
                    {activeRefs.map((_, index) => (
                      <TableRow key={activeRefs[index].ref} index={index} style={{ height: 52 }} />
                    ))}
                  </div>

                  {/* Table footer */}
                  <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-t border-white/10 text-[10px] text-white/40 tracking-widest uppercase">
                    <span>{activeRefs.length} campaigns · {activeRefs.length > 50 ? "virtualized" : "loaded"}</span>
                    <span className="tabular-nums">
                      Totals: {totalSignups} signups · {formatNumber(totalViews)} views{tab === "affiliates" && ` · $${totalPayout.toFixed(2)} payout`}
                    </span>
                  </div>
                </div>
              ) : (
                /* Cards view */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {activeRefs.slice(0, 60).map((row, idx) => {
                    const rowViews = views[row.ref] || 0;
                    const convRate = rowViews ? (row.count / rowViews) * 100 : 0;
                    const rowLinks = links[row.ref] || [];
                    const rowCommission = commission[row.ref] || 0;
                    const payout = row.count * rowCommission;
                    const badge = getConvBadge(convRate);
                    const sparkData = Object.entries(row.signupsByDay || {})
                      .sort(([a], [b]) => a.localeCompare(b))
                      .slice(-7)
                      .map(([date, signups]) => ({ date, signups }));

                    return (
                      <div
                        key={row.ref}
                        className="relative group backdrop-blur-xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-2xl p-5 hover:border-emerald-500/30 transition-all"
                      >
                        {idx < 3 && (
                          <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-[10px] font-bold text-amber-950 shadow-lg shadow-amber-500/50 z-10 tabular-nums">
                            {idx + 1}
                          </div>
                        )}
                        <div className="flex items-start justify-between mb-4 gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-mono text-base text-white truncate" title={row.ref}>{row.ref}</h3>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full border tracking-widest uppercase whitespace-nowrap ${badge.bg}`}>
                                {badge.text}
                              </span>
                            </div>
                            <p className="text-[10px] text-white/40">
                              Last: {new Date(row.lastSeen).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                          </div>
                          <button
                            onClick={() => setDetailRef(row.ref)}
                            className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                            <p className="text-[9px] text-white/40 tracking-widest uppercase mb-1">Signups</p>
                            <p className="text-xl text-white font-light tabular-nums">{row.count}</p>
                          </div>
                          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                            <p className="text-[9px] text-white/40 tracking-widest uppercase mb-1">Views</p>
                            <p className="text-xl text-white font-light tabular-nums">{formatNumber(rowViews)}</p>
                          </div>
                          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                            <p className="text-[9px] text-white/40 tracking-widest uppercase mb-1">Conv.</p>
                            <p className={`text-xl font-light tabular-nums ${getConvColor(convRate)}`}>
                              {rowViews ? `${convRate.toFixed(2)}%` : "—"}
                            </p>
                          </div>
                        </div>

                        {sparkData.length > 0 && (
                          <div className="mb-4">
                            <div className="h-10" style={{ minWidth: 0 }}>
                              <ResponsiveContainer width="99%" height={40}>
                                <AreaChart data={sparkData}>
                                  <defs>
                                    <linearGradient id={`cs-${row.ref}`} x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                  </defs>
                                  <Area type="monotone" dataKey="signups" stroke="#10b981" strokeWidth={1.5} fill={`url(#cs-${row.ref})`} />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex gap-1.5">
                            {rowLinks.slice(0, 3).map((l, i) => {
                              const cfg = PLATFORM_CONFIG[l.platform];
                              return (
                                <span key={i} className={`w-5 h-5 rounded flex items-center justify-center ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                                  {cfg.icon}
                                </span>
                              );
                            })}
                            {rowLinks.length === 0 && <span className="text-white/20">No platforms</span>}
                          </div>
                          {row.ref.startsWith("aff_") && payout > 0 && (
                            <span className="text-emerald-400 tabular-nums">${payout.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {activeRefs.length > 60 && (
                    <div className="col-span-full text-center py-6 text-[10px] text-white/40 tracking-widest uppercase">
                      Showing 60 of {activeRefs.length} · <button onClick={() => setViewMode("table")} className="text-emerald-400 hover:text-emerald-300">Switch to table view</button> to see all
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] text-white/30 tracking-widest uppercase">
              Obliveyon Analytics · Local Dev Only · Built for scale
            </p>
            <p className="text-[10px] text-white/30 tracking-widest uppercase tabular-nums">
              Last sync: {data?.fetchedAt ? new Date(data.fetchedAt).toLocaleTimeString() : "--"}
            </p>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detailData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60"
          onClick={() => setDetailRef(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto backdrop-blur-2xl bg-slate-950/90 border border-white/10 rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <h2 className="font-mono text-xl text-white">{detailData.ref}</h2>
                <p className="text-[10px] text-white/40 tracking-widest uppercase mt-1">Campaign Details</p>
              </div>
              <button onClick={() => setDetailRef(null)} className="text-white/40 hover:text-white text-2xl leading-none">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-[9px] text-white/40 tracking-widest uppercase mb-1">First Seen</p>
                <p className="text-sm text-white">{new Date(detailData.firstSeen).toLocaleString()}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-[9px] text-white/40 tracking-widest uppercase mb-1">Last Seen</p>
                <p className="text-sm text-white">{new Date(detailData.lastSeen).toLocaleString()}</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] text-white/40 tracking-widest uppercase font-medium">Platform Links</p>
                <button
                  onClick={() => setEditingLinksRef(detailData.ref)}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 tracking-widest uppercase"
                >
                  Edit Links
                </button>
              </div>
              {(links[detailData.ref] || []).length > 0 ? (
                <div className="space-y-2">
                  {(links[detailData.ref] || []).map((link, i) => {
                    const cfg = PLATFORM_CONFIG[link.platform];
                    return (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 p-3 ${cfg.bg} border ${cfg.border} rounded-xl hover:bg-white/10 transition-colors`}
                      >
                        <span className={`text-lg ${cfg.text}`}>{cfg.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white capitalize font-medium">{link.platform}</p>
                          <p className="text-[10px] text-white/50 truncate">{link.url}</p>
                        </div>
                        <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-white/30 italic">No platform links added yet</p>
              )}
            </div>

            <div>
              <p className="text-[10px] text-white/40 tracking-widest uppercase font-medium mb-3">
                Signups · {detailData.emails.length}
              </p>
              <div className="max-h-64 overflow-y-auto space-y-1 bg-white/[0.02] border border-white/5 rounded-xl p-3">
                {detailData.emails.map((email, i) => (
                  <div key={i} className="text-xs text-white/70 font-mono px-2 py-1 hover:bg-white/5 rounded">
                    {email}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Links Modal */}
      {editingLinksRef && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60"
          onClick={() => setEditingLinksRef(null)}
        >
          <div
            className="relative w-full max-w-md backdrop-blur-2xl bg-slate-950/90 border border-white/10 rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-sm tracking-widest uppercase text-white font-medium">Platform Links</h2>
                <p className="text-[10px] text-white/40 tracking-wider uppercase mt-1 font-mono">{editingLinksRef}</p>
              </div>
              <button onClick={() => setEditingLinksRef(null)} className="text-white/40 hover:text-white text-xl leading-none">
                ✕
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {(links[editingLinksRef] || []).map((link, i) => {
                const cfg = PLATFORM_CONFIG[link.platform];
                return (
                  <div key={i} className={`flex items-center gap-2 p-2 ${cfg.bg} border ${cfg.border} rounded-lg`}>
                    <span className={`${cfg.text} text-sm w-4 text-center`}>{cfg.icon}</span>
                    <input type="text" value={link.url} readOnly className="text-[10px] text-white/60 flex-1 bg-transparent truncate focus:outline-none" />
                    <button
                      onClick={() =>
                        setLinks({
                          ...links,
                          [editingLinksRef]: (links[editingLinksRef] || []).filter((_, x) => x !== i),
                        })
                      }
                      className="text-red-400 hover:text-red-300 text-xs px-2"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="flex gap-2">
                <select
                  value={newLink.platform}
                  onChange={(e) => setNewLink({ ...newLink, platform: e.target.value as "tiktok" | "youtube" | "instagram" })}
                  className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white focus:outline-none"
                >
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                </select>
                <input
                  type="text"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="https://..."
                  className="text-xs flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/30"
                />
                <button
                  onClick={() => {
                    if (newLink.url.trim()) {
                      setLinks({
                        ...links,
                        [editingLinksRef]: [...(links[editingLinksRef] || []), { platform: newLink.platform, url: newLink.url }],
                      });
                      setNewLink({ platform: "youtube", url: "" });
                    }
                  }}
                  className="text-xs text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg px-4 font-medium hover:from-emerald-400 hover:to-teal-400 transition-all"
                >
                  Add
                </button>
              </div>
            </div>

            <button
              onClick={() => setEditingLinksRef(null)}
              className="w-full mt-4 py-2 text-[10px] text-white/60 hover:text-white tracking-widest uppercase border border-white/10 rounded-lg hover:bg-white/5"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {bulkImportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60"
          onClick={() => setBulkImportOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl backdrop-blur-2xl bg-slate-950/90 border border-white/10 rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-sm tracking-widest uppercase text-white font-medium">Bulk Import</h2>
                <p className="text-[10px] text-white/40 tracking-wider uppercase mt-1">CSV Format · ref,views,commission</p>
              </div>
              <button onClick={() => setBulkImportOpen(false)} className="text-white/40 hover:text-white text-xl leading-none">
                ✕
              </button>
            </div>

            <div className="mb-4 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-[10px] text-emerald-200/70 font-mono">
              <p className="mb-1 tracking-widest uppercase text-emerald-400">Example:</p>
              <p>aff_john,15000,1.50</p>
              <p>aff_sarah,23500,2.00</p>
              <p>tiktok_drop1,8900</p>
            </div>

            <textarea
              value={bulkImportText}
              onChange={(e) => setBulkImportText(e.target.value)}
              placeholder={"aff_john,15000,1.50\naff_sarah,23500,2.00\n..."}
              rows={12}
              className="w-full text-xs font-mono bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/30"
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setBulkImportOpen(false)}
                className="flex-1 py-2.5 text-[10px] text-white/60 hover:text-white tracking-widest uppercase border border-white/10 rounded-lg hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkImport}
                disabled={!bulkImportText.trim()}
                className="flex-1 py-2.5 text-[10px] text-white tracking-widest uppercase bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg hover:from-emerald-400 hover:to-teal-400 transition-all disabled:opacity-50"
              >
                Import Rows
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-[slideIn_0.3s_ease-out]">
          <div className={`backdrop-blur-xl ${
            toast.kind === "error"
              ? "bg-gradient-to-r from-red-500/90 to-orange-500/90 border-red-400/50 shadow-red-500/30"
              : "bg-gradient-to-r from-emerald-500/90 to-teal-500/90 border-emerald-400/50 shadow-emerald-500/30"
          } border text-white px-4 py-3 rounded-xl text-xs tracking-widest font-medium shadow-2xl flex items-center gap-2`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={toast.kind === "error" ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" : "M5 13l4 4L19 7"} />
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
