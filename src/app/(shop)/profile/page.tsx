"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { type Rank } from "@/lib/ranks";

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
  avatarEmoji: string | null;
  createdAt: string;
  role: string;
};

/* ──────────────── style helpers ──────────────── */

const PRIMARY_BTN: React.CSSProperties = {
  fontFamily: "var(--font-medieval)",
  background: "rgba(255,255,255,0.96)",
  color: "#070707",
  border: "1px solid rgba(255,255,255,0.95)",
  letterSpacing: "0.4em",
  fontWeight: 500,
  boxShadow: "0 0 28px rgba(255,255,255,0.12)",
};

const GHOST_BTN: React.CSSProperties = {
  fontFamily: "var(--font-medieval)",
  background: "transparent",
  color: "rgba(255,255,255,0.85)",
  border: "1px solid rgba(255,255,255,0.28)",
  letterSpacing: "0.4em",
  fontWeight: 400,
};

const DANGER_GHOST_BTN: React.CSSProperties = {
  fontFamily: "var(--font-medieval)",
  background: "transparent",
  color: "rgba(255,170,170,0.85)",
  border: "1px solid rgba(255,170,170,0.25)",
  letterSpacing: "0.4em",
  fontWeight: 400,
};

const AVATAR_EMOJIS = [
  "🕯️", "⚔️", "🗡️", "🛡️", "🏹", "👁️", "🌙", "⚜️",
  "🩸", "🖤", "🥀", "🪦", "⛓️", "🔮", "✝️", "☠️",
];

/* ──────────────── building blocks ──────────────── */

function CornerOrnaments() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <line x1="0" y1="0" x2="5" y2="0" stroke="rgba(255,255,255,0.32)" strokeWidth="0.4" />
      <line x1="0" y1="0" x2="0" y2="5" stroke="rgba(255,255,255,0.32)" strokeWidth="0.4" />
      <line x1="100" y1="0" x2="95" y2="0" stroke="rgba(255,255,255,0.32)" strokeWidth="0.4" />
      <line x1="100" y1="0" x2="100" y2="5" stroke="rgba(255,255,255,0.32)" strokeWidth="0.4" />
      <line x1="0" y1="100" x2="5" y2="100" stroke="rgba(255,255,255,0.32)" strokeWidth="0.4" />
      <line x1="0" y1="100" x2="0" y2="95" stroke="rgba(255,255,255,0.32)" strokeWidth="0.4" />
      <line x1="100" y1="100" x2="95" y2="100" stroke="rgba(255,255,255,0.32)" strokeWidth="0.4" />
      <line x1="100" y1="100" x2="100" y2="95" stroke="rgba(255,255,255,0.32)" strokeWidth="0.4" />
    </svg>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.015)",
      }}
    >
      <CornerOrnaments />
      <div className="relative">{children}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
      <p
        className="text-[10px] tracking-[0.55em] uppercase text-white/55 whitespace-nowrap"
        style={{ fontFamily: "var(--font-medieval)" }}
      >
        {children}
      </p>
      <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[9px] tracking-[0.5em] uppercase text-white/40 mb-2"
      style={{ fontFamily: "var(--font-medieval)" }}
    >
      {children}
    </p>
  );
}

function Avatar({
  emoji,
  name,
  email,
  size = 112,
  onClick,
}: {
  emoji: string | null;
  name: string | null;
  email: string;
  size?: number;
  onClick?: () => void;
}) {
  const source = name || email;
  const fallback = source.trim().charAt(0).toUpperCase() || "?";
  const isInteractive = !!onClick;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isInteractive ? "Change avatar" : undefined}
      className={`relative ${isInteractive ? "cursor-pointer group" : ""}`}
      style={{ width: `${size}px`, height: `${size}px`, padding: 0, border: "none", background: "transparent" }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: "1px solid rgba(255,255,255,0.22)",
          boxShadow: "0 0 60px rgba(255,255,255,0.08)",
        }}
      />
      <div
        className="absolute flex items-center justify-center rounded-full overflow-hidden"
        style={{
          inset: "5px",
          background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        {emoji ? (
          <span style={{ fontSize: `${Math.round(size * 0.55)}px`, lineHeight: 1 }}>{emoji}</span>
        ) : (
          <span
            className="text-white"
            style={{
              fontSize: `${Math.round(size * 0.42)}px`,
              fontFamily: "var(--font-gothic)",
              fontWeight: 300,
              letterSpacing: "0.05em",
              textShadow: "0 0 26px rgba(255,255,255,0.2)",
            }}
          >
            {fallback}
          </span>
        )}
      </div>
      {isInteractive && (
        <div
          className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-full"
          style={{
            inset: "5px",
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          <span
            className="text-[9px] tracking-[0.35em] uppercase text-white"
            style={{ fontFamily: "var(--font-medieval)" }}
          >
            Edit
          </span>
        </div>
      )}
    </button>
  );
}

/* ──────────────── page ──────────────── */

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [rankData, setRankData] = useState<RankResponse | null>(null);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Name editor
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState("");

  // Avatar picker
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Password change
  const [pwOpen, setPwOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

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

  // Close avatar picker on outside click
  useEffect(() => {
    if (!pickerOpen) return;
    const onClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [pickerOpen]);

  async function handleSaveName() {
    setSavingName(true);
    setNameError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameDraft.trim() || null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setNameError(data.error || "Could not save");
        return;
      }
      const updated: ProfileResponse = await res.json();
      setProfile(updated);
      setEditingName(false);
      try { await update(); } catch {}
    } catch {
      setNameError("Network error");
    } finally {
      setSavingName(false);
    }
  }

  async function handlePickAvatar(emoji: string | null) {
    setPickerOpen(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarEmoji: emoji }),
      });
      if (res.ok) {
        const updated: ProfileResponse = await res.json();
        setProfile(updated);
      }
    } catch {}
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);
    if (newPw.length < 8) {
      setPwError("New password must be at least 8 characters");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("New passwords do not match");
      return;
    }
    setSavingPw(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPwError(data.error || "Could not change password");
        return;
      }
      setPwSuccess(true);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setTimeout(() => {
        setPwOpen(false);
        setPwSuccess(false);
      }, 1500);
    } catch {
      setPwError("Network error");
    } finally {
      setSavingPw(false);
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
  const displayName = profile?.name || null;
  const avatarEmoji = profile?.avatarEmoji || null;

  return (
    <div className="min-h-screen w-full" style={{ background: "#000000" }}>
      <div
        className="w-full mx-auto px-6 sm:px-10 pb-24"
        style={{ paddingTop: "140px", maxWidth: "1100px" }}
      >
        {/* ────────────── HERO ROW ────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_1fr)_minmax(0,_1.1fr)] gap-6 mb-12">
          {/* Identity panel */}
          <Panel className="px-7 py-8 sm:px-9 sm:py-10">
            <div className="flex flex-col items-center text-center">
              {/* Avatar with emoji picker */}
              <div className="relative" ref={pickerRef}>
                <Avatar
                  emoji={avatarEmoji}
                  name={displayName}
                  email={user.email!}
                  onClick={() => setPickerOpen((v) => !v)}
                />
                {pickerOpen && (
                  <div
                    className="absolute z-30 left-1/2 -translate-x-1/2 mt-4 p-4 grid grid-cols-4 gap-2"
                    style={{
                      width: "260px",
                      background: "rgba(10,10,10,0.98)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 20px rgba(255,255,255,0.04)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    {AVATAR_EMOJIS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => handlePickAvatar(e)}
                        className="w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-200"
                        style={{
                          fontSize: "26px",
                          background: avatarEmoji === e ? "rgba(255,255,255,0.1)" : "transparent",
                          border: avatarEmoji === e ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.06)",
                        }}
                        onMouseEnter={(ev) => { ev.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                        onMouseLeave={(ev) => { ev.currentTarget.style.background = avatarEmoji === e ? "rgba(255,255,255,0.1)" : "transparent"; }}
                      >
                        {e}
                      </button>
                    ))}
                    {avatarEmoji && (
                      <button
                        type="button"
                        onClick={() => handlePickAvatar(null)}
                        className="col-span-4 mt-1 py-2 text-[10px] tracking-[0.35em] uppercase text-white/55 hover:text-white cursor-pointer transition-colors"
                        style={{
                          fontFamily: "var(--font-medieval)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        Reset to initial
                      </button>
                    )}
                  </div>
                )}
              </div>

              <h1
                className="text-2xl sm:text-3xl tracking-[0.12em] uppercase text-white mt-6 mb-1"
                style={{
                  fontFamily: "var(--font-gothic)",
                  fontWeight: 300,
                  textShadow: "0 0 30px rgba(255,255,255,0.12)",
                }}
              >
                {displayName || "Unnamed Member"}
              </h1>

              <p
                className="text-[11px] sm:text-[12px] tracking-[0.35em] uppercase text-white/55 break-all"
                style={{ fontFamily: "var(--font-medieval)" }}
              >
                {user.email}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-8 justify-center">
                <Link
                  href="/shop"
                  className="px-7 py-3 text-[11px] uppercase transition-all duration-300"
                  style={PRIMARY_BTN}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,1)";
                    e.currentTarget.style.boxShadow = "0 0 36px rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.96)";
                    e.currentTarget.style.boxShadow = "0 0 28px rgba(255,255,255,0.12)";
                  }}
                >
                  Continue Shopping
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-7 py-3 text-[11px] uppercase transition-colors duration-300"
                    style={GHOST_BTN}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.55)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; }}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-7 py-3 text-[11px] uppercase transition-colors duration-300 cursor-pointer"
                  style={DANGER_GHOST_BTN}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,170,170,0.5)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,170,170,0.25)"; }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </Panel>

          {/* Standing panel */}
          <Panel className="px-7 py-8 sm:px-10 sm:py-10">
            {rankData ? (
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <span
                    className="text-[10px] tracking-[0.45em] uppercase text-white/45"
                    style={{ fontFamily: "var(--font-medieval)" }}
                  >
                    Rank {rankData.current.tier}
                  </span>
                  <span
                    className="text-[10px] tracking-[0.4em] uppercase text-white/55 whitespace-nowrap"
                    style={{ fontFamily: "var(--font-medieval)" }}
                  >
                    {rankData.pieces} {rankData.pieces === 1 ? "piece" : "pieces"}
                  </span>
                </div>

                <div className="flex items-center gap-5 mb-8">
                  <span
                    style={{
                      fontSize: "64px",
                      lineHeight: 1,
                      filter: "drop-shadow(0 0 30px rgba(255,255,255,0.18))",
                      flexShrink: 0,
                    }}
                  >
                    {rankData.current.emoji}
                  </span>
                  <div className="min-w-0">
                    <p
                      className="text-[10px] tracking-[0.5em] uppercase text-white/40 mb-1"
                      style={{ fontFamily: "var(--font-medieval)" }}
                    >
                      Standing
                    </p>
                    <h2
                      className="text-3xl sm:text-4xl tracking-[0.06em] uppercase text-white leading-none"
                      style={{
                        fontFamily: "var(--font-gothic)",
                        fontWeight: 300,
                        textShadow: "0 0 30px rgba(255,255,255,0.12)",
                      }}
                    >
                      {rankData.current.title}
                    </h2>
                  </div>
                </div>

                <div className="mb-2">
                  <div
                    className="relative w-full h-[6px]"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <div
                      className="absolute top-0 left-0 h-full transition-all duration-1000"
                      style={{
                        width: `${rankData.progress}%`,
                        background: "rgba(255,255,255,0.9)",
                        boxShadow: "0 0 12px rgba(255,255,255,0.55)",
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
                </div>

                {rankData.next ? (
                  <p
                    className="text-[11px] tracking-[0.25em] uppercase text-white/65 mt-3"
                    style={{ fontFamily: "var(--font-medieval)" }}
                  >
                    {rankData.next.threshold - rankData.pieces}{" "}
                    {rankData.next.threshold - rankData.pieces === 1 ? "piece" : "pieces"} until{" "}
                    <span className="text-white/95">
                      {rankData.next.emoji} {rankData.next.title}
                    </span>
                  </p>
                ) : (
                  <p
                    className="text-[11px] tracking-[0.35em] uppercase text-white/80 mt-3"
                    style={{ fontFamily: "var(--font-medieval)" }}
                  >
                    Max rank achieved — Legendary
                  </p>
                )}

                <div className="mt-auto pt-7 flex items-end justify-between gap-4 flex-wrap" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "32px" }}>
                  <div className="min-w-0">
                    <p
                      className="text-[9px] tracking-[0.5em] uppercase text-white/35 mb-1"
                      style={{ fontFamily: "var(--font-medieval)" }}
                    >
                      Current Perk
                    </p>
                    <p
                      className="text-sm sm:text-base text-white/90"
                      style={{ fontFamily: "var(--font-medieval)", letterSpacing: "0.04em" }}
                    >
                      {rankData.current.perk}
                    </p>
                  </div>
                  <Link
                    href="/rewards"
                    className="text-[10px] tracking-[0.4em] uppercase text-white/70 hover:text-white whitespace-nowrap transition-colors duration-300"
                    style={{
                      fontFamily: "var(--font-medieval)",
                      borderBottom: "1px solid rgba(255,255,255,0.25)",
                      paddingBottom: "2px",
                    }}
                  >
                    View All Ranks →
                  </Link>
                </div>
              </div>
            ) : (
              <p
                className="text-center text-[11px] tracking-[0.4em] uppercase text-white/30 py-16"
                style={{ fontFamily: "var(--font-medieval)" }}
              >
                Rank unavailable
              </p>
            )}
          </Panel>
        </div>

        {/* ────────────── ACCOUNT DETAILS ────────────── */}
        <div className="mb-12">
          <SectionLabel>Account Details</SectionLabel>
          <Panel className="px-6 py-7 sm:px-8 sm:py-8">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-x-10 gap-y-7">
              {/* Display Name */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <FieldLabel>Display Name</FieldLabel>
                  {!editingName && (
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-[9px] tracking-[0.35em] uppercase text-white/55 hover:text-white cursor-pointer transition-colors"
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
                      className="w-full px-3 py-2 text-lg text-white placeholder:text-white/25 focus:outline-none transition-colors duration-300"
                      style={{
                        fontFamily: "var(--font-medieval)",
                        background: "transparent",
                        borderBottom: "1px solid rgba(255,255,255,0.28)",
                        letterSpacing: "0.04em",
                      }}
                      autoFocus
                      onFocus={(e) => { e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.65)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.28)"; }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveName();
                        if (e.key === "Escape") {
                          setEditingName(false);
                          setNameDraft(profile?.name ?? "");
                        }
                      }}
                    />
                    {nameError && (
                      <p
                        className="text-[10px] tracking-wider"
                        style={{ color: "rgba(255,130,130,0.95)", fontFamily: "var(--font-medieval)" }}
                      >
                        {nameError}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveName}
                        disabled={savingName}
                        className="px-5 py-2 text-[10px] uppercase cursor-pointer disabled:opacity-40 transition-all duration-300"
                        style={PRIMARY_BTN}
                      >
                        {savingName ? "Saving…" : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingName(false);
                          setNameDraft(profile?.name ?? "");
                          setNameError("");
                        }}
                        className="px-5 py-2 text-[10px] uppercase cursor-pointer transition-colors duration-300"
                        style={GHOST_BTN}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p
                    className="text-lg text-white/95"
                    style={{ fontFamily: "var(--font-medieval)", letterSpacing: "0.03em" }}
                  >
                    {displayName || <span className="text-white/30 italic">Not set</span>}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <FieldLabel>Email</FieldLabel>
                <p
                  className="text-lg text-white/95 break-all"
                  style={{ fontFamily: "var(--font-medieval)", letterSpacing: "0.03em" }}
                >
                  {user.email}
                </p>
              </div>
            </div>
          </Panel>
        </div>

        {/* ────────────── SECURITY ────────────── */}
        <div className="mb-12">
          <SectionLabel>Security</SectionLabel>
          <Panel className="px-6 py-7 sm:px-8 sm:py-8">
            {!pwOpen ? (
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <FieldLabel>Password</FieldLabel>
                  <p
                    className="text-base text-white/85"
                    style={{ fontFamily: "var(--font-medieval)", letterSpacing: "0.05em" }}
                  >
                    ••••••••••••
                  </p>
                </div>
                <button
                  onClick={() => { setPwOpen(true); setPwError(""); setPwSuccess(false); }}
                  className="px-6 py-2.5 text-[10px] uppercase cursor-pointer transition-colors duration-300"
                  style={GHOST_BTN}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.55)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; }}
                >
                  Change Password
                </button>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="flex flex-col gap-4 max-w-md">
                <div>
                  <FieldLabel>Current Password</FieldLabel>
                  <input
                    type="password"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="w-full px-3 py-2.5 text-base text-white focus:outline-none transition-colors duration-300"
                    style={{
                      fontFamily: "var(--font-medieval)",
                      background: "transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.28)",
                      letterSpacing: "0.04em",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.65)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.28)"; }}
                  />
                </div>
                <div>
                  <FieldLabel>New Password</FieldLabel>
                  <input
                    type="password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="w-full px-3 py-2.5 text-base text-white focus:outline-none transition-colors duration-300"
                    style={{
                      fontFamily: "var(--font-medieval)",
                      background: "transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.28)",
                      letterSpacing: "0.04em",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.65)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.28)"; }}
                  />
                </div>
                <div>
                  <FieldLabel>Confirm New Password</FieldLabel>
                  <input
                    type="password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="w-full px-3 py-2.5 text-base text-white focus:outline-none transition-colors duration-300"
                    style={{
                      fontFamily: "var(--font-medieval)",
                      background: "transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.28)",
                      letterSpacing: "0.04em",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.65)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.28)"; }}
                  />
                </div>
                {pwError && (
                  <p
                    className="text-[11px] tracking-wider"
                    style={{ color: "rgba(255,130,130,0.95)", fontFamily: "var(--font-medieval)" }}
                  >
                    {pwError}
                  </p>
                )}
                {pwSuccess && (
                  <p
                    className="text-[11px] tracking-wider text-white/85"
                    style={{ fontFamily: "var(--font-medieval)" }}
                  >
                    Password updated.
                  </p>
                )}
                <div className="flex gap-3 mt-1">
                  <button
                    type="submit"
                    disabled={savingPw}
                    className="px-6 py-2.5 text-[10px] uppercase cursor-pointer disabled:opacity-40 transition-all duration-300"
                    style={PRIMARY_BTN}
                  >
                    {savingPw ? "Saving…" : "Update Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPwOpen(false);
                      setCurrentPw("");
                      setNewPw("");
                      setConfirmPw("");
                      setPwError("");
                      setPwSuccess(false);
                    }}
                    className="px-6 py-2.5 text-[10px] uppercase cursor-pointer transition-colors duration-300"
                    style={GHOST_BTN}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
