"use client";

import { useState, useEffect, useCallback } from "react";

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

export default function AnalyticsPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [autoRefresh, setAutoRefresh] = useState(false);

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

  const totalSignups = data?.data.reduce((sum, r) => sum + r.count, 0) ?? 0;
  const totalProfiles = data?.total ?? 0;
  const fetchedAgo = data ? Math.round((Date.now() - data.fetchedAt) / 1000) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl tracking-[0.15em] uppercase text-white">
            Ad Analytics
          </h1>
          <p className="text-xs text-white/50 tracking-wider mt-1">
            Attribution by <code>?ref=</code> param on signup
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs tracking-wider text-white/70">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="accent-white"
            />
            Auto-refresh (60s)
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

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Stat label="Tracked signups" value={totalSignups} />
        <Stat label="Total profiles" value={totalProfiles} />
        <Stat label="Unique refs" value={data?.data.length ?? 0} />
        <Stat
          label="Last fetch"
          value={data ? `${fetchedAgo}s ago${data.cached ? " (cached)" : ""}` : "—"}
        />
      </div>

      {/* Table */}
      <div className="border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                {["Ref code", "Signups", "First seen", "Last seen", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[10px] tracking-[0.2em] uppercase text-white/40 px-4 py-3 font-normal"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!data && loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-white/40">
                    Fetching profiles from Klaviyo...
                  </td>
                </tr>
              )}
              {data?.data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-white/40">
                    No tracked signups yet. Share a link with{" "}
                    <code className="text-white/70">?ref=your_code</code>.
                  </td>
                </tr>
              )}
              {data?.data.map((row) => (
                <tr key={row.ref} className="border-b border-white/10 last:border-0">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        const next = new Set(expanded);
                        if (next.has(row.ref)) next.delete(row.ref);
                        else next.add(row.ref);
                        setExpanded(next);
                      }}
                      className="flex items-center gap-2 font-mono text-white hover:text-white/70 transition-colors"
                    >
                      <span className="text-white/40 text-xs">
                        {expanded.has(row.ref) ? "▼" : "▶"}
                      </span>
                      {row.ref}
                    </button>
                    {expanded.has(row.ref) && (
                      <div className="mt-2 ml-5 max-h-40 overflow-y-auto">
                        {row.emails.map((e, i) => (
                          <div key={i} className="text-xs text-white/60 font-mono py-0.5">
                            {e}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono">{row.count}</td>
                  <td className="px-4 py-3 text-white/60 text-xs">
                    {new Date(row.firstSeen).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs">
                    {new Date(row.lastSeen).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <CopyBtn value={`https://obliveyon.com/?ref=${row.ref}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400 mt-4">{error}</p>
      )}

      <p className="mt-6 text-xs text-white/40 tracking-wider">
        Tracked signups = profiles with an <code>ad_ref</code> property set.
        Total profiles = all Klaviyo profiles (including ones without attribution).
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-white/10 p-4">
      <p className="text-[10px] tracking-[0.2em] uppercase text-white/40">{label}</p>
      <p className="text-xl sm:text-2xl text-white mt-1 font-mono">{value}</p>
    </div>
  );
}

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        });
      }}
      className="text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors"
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
