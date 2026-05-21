"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RANKS, type Rank } from "@/lib/ranks";

type RankResponse = {
  pieces: number;
  current: Rank;
  next: Rank | null;
  progress: number;
};

type ProfileResponse = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  role: string;
};

function Divider() {
  return (
    <div className="flex items-center gap-3 w-full my-12">
      <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
      <div className="w-1 h-1 rotate-45" style={{ background: "rgba(255,255,255,0.18)" }} />
      <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] sm:text-[11px] tracking-[0.55em] uppercase text-white/40 text-center mb-8"
      style={{ fontFamily: "var(--font-medieval)" }}
    >
      {children}
    </p>
  );
}

function Avatar({ name, email }: { name: string | null; email: string }) {
  const source = name || email;
  const first = source.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className="relative" style={{ width: "120px", height: "120px" }}>
      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 0 80px rgba(255,255,255,0.05)",
        }}
      />
      {/* Inner circle with initial */}
      <div
        className="absolute flex items-center justify-center rounded-full"
        style={{
          inset: "6px",
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 70%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span
          className="text-5xl text-white/90"
          style={{
            fontFamily: "var(--font-gothic)",
            fontWeight: 300,
            letterSpacing: "0.05em",
            textShadow: "0 0 30px rgba(255,255,255,0.15)",
          }}
        >
          {first}
        </span>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [rankData, setRankData] = useState<RankResponse | null>(null);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/account");
    }
  }, [status, router]);

  const loadRank = useCallback(async () => {
    try {
      const res = await fetch("/api/rank", { cache: "no-store" });
      if (res.ok) setRankData(await res.json());
    } catch {}
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile", { cache: "no-store" });
      if (res.ok) {
        const data: ProfileResponse = await res.json();
        setProfile(data);
        setNameDraft(data.name ?? "");
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    Promise.all([loadRank(), loadProfile()]).finally(() => setLoading(false));
  }, [session, loadRank, loadProfile]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const onFocus = () => loadRank();
    const interval = setInterval(() => {
      if (!document.hidden) loadRank();
    }, 60_000);
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [status, loadRank]);

  async function handleSaveName() {
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameDraft.trim() || null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSaveError(data.error || "Could not save");
        return;
      }
      const updated: ProfileResponse = await res.json();
      setProfile(updated);
      setEditingName(false);
      try {
        await update();
      } catch {}
    } catch {
      setSaveError("Network error");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#000000" }}>
        <p
          className="text-[11px] tracking-[0.4em] uppercase text-white/40"
          style={{ fontFamily: "var(--font-medieval)" }}
        >
          Loading…
        </p>
      </div>
    );
  }

  if (!session?.user) return null;

  const user = session.user;
  const isAdmin = (user as { role?: string }).role === "ADMIN";
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
    : null;
  const displayName = profile?.name || null;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center"
      style={{ background: "#000000" }}
    >
      <div
        className="w-full px-6 sm:px-10 pb-24"
        style={{ paddingTop: "140px", maxWidth: "880px", marginLeft: "auto", marginRight: "auto" }}
      >
        {/* ── HERO ── centered avatar + name + meta */}
        <section className="flex flex-col items-center text-center mb-4">
          <Avatar name={displayName} email={user.email!} />

          <h1
            className="text-3xl sm:text-5xl tracking-[0.1em] uppercase text-white mt-10 mb-2"
            style={{
              fontFamily: "var(--font-gothic)",
              fontWeight: 300,
              textShadow: "0 0 30px rgba(255,255,255,0.1)",
            }}
          >
            {displayName || "Unnamed Member"}
          </h1>

          <p
            className="text-[11px] tracking-[0.4em] uppercase text-white/45 mb-2"
            style={{ fontFamily: "var(--font-medieval)" }}
          >
            {user.email}
          </p>

          {memberSince && (
            <p
              className="text-[10px] tracking-[0.35em] uppercase text-white/25"
              style={{ fontFamily: "var(--font-medieval)" }}
            >
              Member since {memberSince}
            </p>
          )}

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2 mt-8 justify-center">
            <Link
              href="/shop"
              className="px-6 py-3 text-[10px] sm:text-[11px] tracking-[0.4em] uppercase transition-all duration-300"
              style={{
                fontFamily: "var(--font-medieval)",
                background: "rgba(255,255,255,0.92)",
                color: "#080808",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.92)"; }}
            >
              Continue Shopping
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="px-6 py-3 text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-white/70 hover:text-white transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-medieval)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                Admin
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-6 py-3 text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-white/50 hover:text-white transition-colors duration-300 cursor-pointer"
              style={{
                fontFamily: "var(--font-medieval)",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "transparent",
              }}
            >
              Sign Out
            </button>
          </div>
        </section>

        <Divider />

        {/* ── RANK ── large emoji + title + progress */}
        <section>
          <SectionTitle>Standing</SectionTitle>
          {rankData ? (
            <div className="flex flex-col items-center">
              {/* Emoji */}
              <div
                className="flex items-center justify-center mb-6"
                style={{ fontSize: "72px", lineHeight: 1, filter: "drop-shadow(0 0 40px rgba(255,255,255,0.15))" }}
              >
                {rankData.current.emoji}
              </div>

              <p
                className="text-[10px] tracking-[0.5em] uppercase text-white/35 mb-2"
                style={{ fontFamily: "var(--font-medieval)" }}
              >
                Rank {rankData.current.tier} of {RANKS.length}
              </p>
              <h2
                className="text-4xl sm:text-6xl tracking-[0.08em] uppercase text-white text-center mb-4"
                style={{
                  fontFamily: "var(--font-gothic)",
                  fontWeight: 300,
                  textShadow: "0 0 40px rgba(255,255,255,0.1)",
                }}
              >
                {rankData.current.title}
              </h2>
              <p
                className="text-[11px] sm:text-[12px] tracking-[0.35em] uppercase text-white/55 mb-10"
                style={{ fontFamily: "var(--font-medieval)" }}
              >
                {rankData.pieces} {rankData.pieces === 1 ? "piece" : "pieces"} acquired
              </p>

              {/* Progress bar */}
              <div className="w-full" style={{ maxWidth: "520px" }}>
                <div className="relative w-full h-[6px] mb-4" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="absolute top-0 left-0 h-full transition-all duration-1000"
                    style={{
                      width: `${rankData.progress}%`,
                      background: "rgba(255,255,255,0.9)",
                      boxShadow: "0 0 12px rgba(255,255,255,0.5)",
                    }}
                  />
                  {[25, 50, 75].map((tick) => (
                    <div
                      key={tick}
                      className="absolute top-0 h-full w-px"
                      style={{ left: `${tick}%`, background: "rgba(255,255,255,0.12)" }}
                    />
                  ))}
                </div>

                {rankData.next ? (
                  <p
                    className="text-[11px] sm:text-[12px] tracking-[0.3em] uppercase text-white/60 text-center"
                    style={{ fontFamily: "var(--font-medieval)" }}
                  >
                    {rankData.next.threshold - rankData.pieces}{" "}
                    {rankData.next.threshold - rankData.pieces === 1 ? "piece" : "pieces"} until{" "}
                    <span className="text-white/90">{rankData.next.emoji} {rankData.next.title}</span>
                  </p>
                ) : (
                  <p
                    className="text-[12px] tracking-[0.4em] uppercase text-white/75 text-center"
                    style={{ fontFamily: "var(--font-medieval)" }}
                  >
                    Legendary — max rank achieved
                  </p>
                )}
              </div>

              {/* Perk callout */}
              <div
                className="mt-10 px-8 py-5 text-center"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.015)",
                  maxWidth: "520px",
                }}
              >
                <p
                  className="text-[9px] tracking-[0.45em] uppercase text-white/30 mb-2"
                  style={{ fontFamily: "var(--font-medieval)" }}
                >
                  Current perk
                </p>
                <p
                  className="text-sm sm:text-base text-white/85"
                  style={{ fontFamily: "var(--font-medieval)", letterSpacing: "0.04em" }}
                >
                  {rankData.current.perk}
                </p>
              </div>
            </div>
          ) : (
            <p
              className="text-center text-[11px] tracking-[0.4em] uppercase text-white/30"
              style={{ fontFamily: "var(--font-medieval)" }}
            >
              Rank unavailable
            </p>
          )}
        </section>

        <Divider />

        {/* ── ACCOUNT DETAILS ── */}
        <section>
          <SectionTitle>Account Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Display name */}
            <div className="px-6 py-5" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between mb-3">
                <p
                  className="text-[9px] tracking-[0.45em] uppercase text-white/35"
                  style={{ fontFamily: "var(--font-medieval)" }}
                >
                  Display Name
                </p>
                {!editingName && (
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-[9px] tracking-[0.3em] uppercase text-white/50 hover:text-white cursor-pointer transition-colors"
                    style={{ fontFamily: "var(--font-medieval)" }}
                  >
                    Edit
                  </button>
                )}
              </div>
              {editingName ? (
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    maxLength={80}
                    placeholder="Your name"
                    className="w-full px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors duration-300"
                    style={{
                      fontFamily: "var(--font-medieval)",
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.15)",
                      letterSpacing: "0.04em",
                    }}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveName();
                      if (e.key === "Escape") {
                        setEditingName(false);
                        setNameDraft(profile?.name ?? "");
                      }
                    }}
                  />
                  {saveError && (
                    <p
                      className="text-[10px] tracking-wider"
                      style={{ color: "rgba(255,130,130,0.9)", fontFamily: "var(--font-medieval)" }}
                    >
                      {saveError}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveName}
                      disabled={saving}
                      className="px-4 py-1.5 text-[10px] tracking-[0.3em] uppercase cursor-pointer disabled:opacity-40"
                      style={{
                        fontFamily: "var(--font-medieval)",
                        background: "rgba(255,255,255,0.92)",
                        color: "#080808",
                      }}
                    >
                      {saving ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingName(false);
                        setNameDraft(profile?.name ?? "");
                        setSaveError("");
                      }}
                      className="px-4 py-1.5 text-[10px] tracking-[0.3em] uppercase text-white/60 hover:text-white cursor-pointer transition-colors"
                      style={{
                        fontFamily: "var(--font-medieval)",
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p
                  className="text-base text-white/90"
                  style={{ fontFamily: "var(--font-medieval)" }}
                >
                  {displayName || <span className="text-white/30 italic">Not set</span>}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="px-6 py-5" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <p
                className="text-[9px] tracking-[0.45em] uppercase text-white/35 mb-3"
                style={{ fontFamily: "var(--font-medieval)" }}
              >
                Email
              </p>
              <p
                className="text-base text-white/90 truncate"
                style={{ fontFamily: "var(--font-medieval)" }}
              >
                {user.email}
              </p>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── ALL RANKS LADDER ── */}
        <section>
          <SectionTitle>The Order</SectionTitle>
          <div className="flex flex-col gap-2">
            {RANKS.map((r) => {
              const reached = rankData ? rankData.pieces >= r.threshold : false;
              const isCurrent = rankData?.current.tier === r.tier;
              return (
                <div
                  key={r.tier}
                  className="flex items-center gap-5 px-5 sm:px-7 py-5 transition-all duration-300"
                  style={{
                    border: isCurrent
                      ? "1px solid rgba(255,255,255,0.3)"
                      : "1px solid rgba(255,255,255,0.06)",
                    background: isCurrent ? "rgba(255,255,255,0.025)" : "transparent",
                    opacity: reached ? 1 : 0.4,
                  }}
                >
                  <span style={{ fontSize: "28px", lineHeight: 1, flexShrink: 0 }}>{r.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
                      <p
                        className="text-sm sm:text-base tracking-[0.12em] uppercase text-white truncate"
                        style={{ fontFamily: "var(--font-medieval)" }}
                      >
                        {r.title}
                      </p>
                      <p
                        className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-white/45 whitespace-nowrap"
                        style={{ fontFamily: "var(--font-medieval)" }}
                      >
                        {r.threshold} {r.threshold === 1 ? "piece" : "pieces"}
                      </p>
                    </div>
                    <p
                      className="text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-white/40"
                      style={{ fontFamily: "var(--font-medieval)" }}
                    >
                      {r.perk}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
