export type Rank = {
  tier: number;
  title: string;
  emoji: string;
  threshold: number;
  perk: string;
  discount: number;
};

export const RANKS: Rank[] = [
  { tier: 1, title: "The Wanderer",  emoji: "🕯️", threshold: 0,  perk: "Early access to drops",                  discount: 0  },
  { tier: 2, title: "The Forgotten", emoji: "⚔️", threshold: 1,  perk: "5% off all orders",                       discount: 5  },
  { tier: 3, title: "The Hunter",    emoji: "👁️", threshold: 5,  perk: "10% off + free shipping",                 discount: 10 },
  { tier: 4, title: "The Initiate",  emoji: "🩸", threshold: 10, perk: "15% off + exclusive colorways",           discount: 15 },
  { tier: 5, title: "The Obliveyon", emoji: "🖤", threshold: 30, perk: "20% off + limited pieces + name in lore", discount: 20 },
];

export function getRank(pieces: number): Rank {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (pieces >= rank.threshold) current = rank;
  }
  return current;
}

export function getNextRank(current: Rank): Rank | null {
  return RANKS.find((r) => r.tier === current.tier + 1) || null;
}

export function getProgress(pieces: number, current: Rank, next: Rank | null): number {
  if (!next) return 100;
  const range = next.threshold - current.threshold;
  const progress = pieces - current.threshold;
  return Math.min(100, Math.round((progress / range) * 100));
}
