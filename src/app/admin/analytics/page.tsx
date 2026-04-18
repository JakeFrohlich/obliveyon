"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

const PW_KEY = "obliveyon_admin_pw";

export default function AnalyticsPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [toast, setToast] = useState<{ msg: string; id: number } | null>(null);
  const [tab, setTab] = useState<"ads" | "affiliates">("ads");
  const [links, setLinks] = useState<Record<string, PlatformLink[]>>({});
  const [views, setViews] = useState<Record<string, number>>({});
  const [commission, setCommission] = useState<Record<string, number>>({});
  const [editingRef, setEditingRef] = useState<string | null>(null);
  const [editingViews, setEditingViews] = useState<string | null>(null);
  const [viewsInput, setViewsInput] = useState("");
  const [newLink, setNewLink] = useState<{ platform: "tiktok" | "youtube" | "instagram"; url: string }>({
    platform: "youtube",
    url: "",
  });

  // Hydrate from sessionStorage/localStorage
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

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("obliveyon_links", JSON.stringify(links));
  }, [links]);

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

      // Scrape views for refs with links
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
              setViews((prev) => ({ ...prev, [ref]: scrapedViews }));
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
  }, [links]);

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
    const id = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(id);
  }, [toast]);

  const showToast = (msg: string) => {
    setToast({ msg, id: Date.now() });
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchData(password);
          }}
          className="w-full max-w-sm"
        >
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-8 py-12 shadow-2xl">
            <h1 className="text-2xl tracking-[0.2em] uppercase text-white text-center font-light mb-8">
              Analytics
            </h1>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all mb-6"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs tracking-[0.15em] uppercase font-medium rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 shadow-lg"
            >
              {loading ? "..." : "Enter"}
            </button>
            {error && <p className="text-xs text-red-400 text-center mt-4">{error}</p>}
          </div>
        </form>
      </div>
    );
  }

  const allData = data?.data ?? [];
  const adRefs = allData.filter((r) => !r.ref.startsWith("aff_"));
  const affiliateRefs = allData.filter((r) => r.ref.startsWith("aff_"));
  const activeRefs = tab === "ads" ? adRefs : affiliateRefs;

  const totalSignups = activeRefs.reduce((sum, r) => sum + r.count, 0);
  const totalViews = activeRefs.reduce((sum, r) => sum + (views[r.ref] || 0), 0);
  const avgConvRate = totalViews > 0 ? ((totalSignups / totalViews) * 100).toFixed(2) : "0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl sm:text-5xl tracking-[0.15em] uppercase text-white font-light">
                Campaign Analytics
              </h1>
              <p className="text-xs text-white/50 tracking-[0.1em] mt-2">Real-time ad performance</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs tracking-wider text-white/70">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="accent-emerald-500"
                />
                Auto-refresh
              </label>
              <button
                onClick={() => fetchData(password, true)}
                disabled={loading}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-xs tracking-wider uppercase hover:bg-white/20 transition-all disabled:opacity-50"
              >
                {loading ? "..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mb-8 p-3 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white/60 space-y-1">
            <p>✓ YouTube: Auto-scraping available (requires API key)</p>
            <p>○ TikTok & Instagram: Use manual override (click pencil icon next to Views)</p>
            <p className="text-white/40 text-[9px] pt-1">Tip: Check your TikTok/Instagram insights, paste the view count into the editor.</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {(["ads", "affiliates"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-2 rounded-lg text-xs tracking-[0.15em] uppercase font-medium transition-all ${
                  tab === t
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                    : "bg-white/10 border border-white/20 text-white/60 hover:text-white"
                }`}
              >
                {t === "ads" ? "Your Ads" : "Affiliates"}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Signups", value: totalSignups },
            { label: "Total Views", value: totalViews.toLocaleString() },
            { label: "Conv. Rate", value: `${avgConvRate}%` },
            { label: "Active Campaigns", value: activeRefs.length },
          ].map((kpi) => (
            <div key={kpi.label} className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-[10px] tracking-[0.15em] uppercase text-white/50 font-medium">{kpi.label}</p>
              <p className="text-2xl sm:text-3xl text-white mt-2 font-light">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Campaign Cards */}
        {activeRefs.length === 0 ? (
          <div className="text-center py-16 backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-white/40 text-sm">No campaigns yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeRefs.map((row) => {
              const rowViews = views[row.ref] || 0;
              const convRate = rowViews ? ((row.count / rowViews) * 100).toFixed(2) : null;
              const rowLinks = links[row.ref] || [];
              const rowCommission = commission[row.ref] || 0;
              const payout = row.count * rowCommission;
              const isEditing = editingRef === row.ref;

              return (
                <div
                  key={row.ref}
                  className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-white/30 hover:from-white/15 hover:to-white/10 transition-all shadow-xl"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-mono text-lg text-white">{row.ref}</h3>
                      <p className="text-xs text-white/50 mt-1">
                        {new Date(row.lastSeen).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://obliveyon.com/?ref=${row.ref}`);
                        showToast("Copied!");
                      }}
                      className="text-[10px] tracking-widest uppercase px-3 py-1 rounded bg-white/10 border border-white/20 hover:bg-white/20 transition-all text-white/60 hover:text-white"
                    >
                      Copy
                    </button>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-white/10">
                    <div>
                      <p className="text-[10px] text-white/50 tracking-wider uppercase">Signups</p>
                      <p className="text-2xl text-white font-light mt-1">{row.count}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/50 tracking-wider uppercase flex items-center gap-1">
                        Views
                        <button
                          onClick={() => {
                            setEditingViews(row.ref);
                            setViewsInput(String(rowViews));
                          }}
                          className="text-emerald-400 hover:text-emerald-300 transition-all"
                          title="Click to edit views"
                        >
                          ✏️
                        </button>
                      </p>
                      {editingViews === row.ref ? (
                        <div className="flex gap-1 mt-1">
                          <input
                            type="number"
                            value={viewsInput}
                            onChange={(e) => setViewsInput(e.target.value)}
                            className="text-sm bg-white/10 border border-white/20 rounded px-2 py-1 text-white w-24 focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              const num = parseInt(viewsInput) || 0;
                              setViews({ ...views, [row.ref]: num });
                              setEditingViews(null);
                              showToast("Views updated!");
                            }}
                            className="text-[10px] text-emerald-400 hover:text-emerald-300 font-medium px-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingViews(null)}
                            className="text-[10px] text-white/50 hover:text-white px-2"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <p className="text-2xl text-white font-light mt-1 cursor-pointer hover:text-emerald-400/80 transition-all">
                          {rowViews.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] text-white/50 tracking-wider uppercase">Conv.</p>
                      <p className={`text-2xl font-light mt-1 ${convRate ? "text-emerald-400" : "text-white/40"}`}>
                        {convRate ? `${convRate}%` : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Platform Links */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-white/50 tracking-wider uppercase font-medium">Platforms</p>
                      {!isEditing && (
                        <button
                          onClick={() => {
                            setEditingRef(row.ref);
                            setNewLink({ platform: "youtube", url: "" });
                          }}
                          className="text-[10px] text-emerald-400 hover:text-emerald-300 transition-all"
                        >
                          Edit
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        {rowLinks.map((link, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-[10px] text-white/60 px-2 py-1 bg-white/5 rounded capitalize">
                              {link.platform}
                            </span>
                            <input
                              type="text"
                              value={link.url}
                              readOnly
                              className="text-[10px] text-white/60 flex-1 bg-transparent truncate"
                            />
                            <button
                              onClick={() => {
                                setLinks({
                                  ...links,
                                  [row.ref]: rowLinks.filter((_, i) => i !== idx),
                                });
                              }}
                              className="text-red-400 text-xs hover:text-red-300"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <div className="flex gap-2 pt-2 border-t border-white/10">
                          <select
                            value={newLink.platform}
                            onChange={(e) =>
                              setNewLink({
                                ...newLink,
                                platform: e.target.value as "tiktok" | "youtube" | "instagram",
                              })
                            }
                            className="text-[10px] bg-white/5 border border-white/20 rounded px-2 py-1 text-white focus:outline-none"
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
                            className="text-[10px] flex-1 bg-white/5 border border-white/20 rounded px-2 py-1 text-white placeholder:text-white/40 focus:outline-none"
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
                            className="text-emerald-400 text-xs hover:text-emerald-300 font-medium"
                          >
                            Add
                          </button>
                        </div>
                        <button
                          onClick={() => setEditingRef(null)}
                          className="w-full text-[10px] text-white/50 hover:text-white transition-all py-2 border-t border-white/10"
                        >
                          Done
                        </button>
                      </div>
                    ) : rowLinks.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {rowLinks.map((link, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] text-white/60 px-2 py-1 bg-white/5 border border-white/10 rounded capitalize"
                          >
                            {link.platform}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-white/40">No links added yet</p>
                    )}
                  </div>

                  {/* Affiliate Commission */}
                  {tab === "affiliates" && (
                    <div className="pt-6 border-t border-white/10">
                      <label className="text-xs text-white/50 tracking-wider uppercase block mb-2 font-medium">
                        Commission ($/signup)
                      </label>
                      <div className="flex gap-2">
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
                          className="flex-1 text-sm bg-white/5 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500/50"
                        />
                        <div className="text-right">
                          <p className="text-[10px] text-white/50 uppercase">Payout</p>
                          <p className="text-lg text-emerald-400 font-light">${payout.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 bg-emerald-500/90 text-white px-4 py-3 rounded-lg text-xs tracking-widest font-medium backdrop-blur-sm shadow-lg">
            {toast.msg}
          </div>
        )}

        {error && <p className="text-xs text-red-400 mt-8 text-center">{error}</p>}
      </div>
    </div>
  );
}
