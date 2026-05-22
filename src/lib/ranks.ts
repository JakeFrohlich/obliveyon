export type Rank = {
  tier: number;
  title: string;
  emoji: string;
  threshold: number;
  perk: string;
  discount: number;
};

// Emojis available to each tier (cumulative — higher tiers include lower tiers' emojis).
// Tier 1 = only the candle (rank emoji). Tier 2+ unlocks all non-rank emojis + candle.
// Each rank emoji unlocks at that tier.
export const EMOJI_UNLOCKS: { emoji: string; minTier: number; label: string }[] = [
  // Rank emojis — locked to their own rank or higher
  { emoji: "🕯️", minTier: 1, label: "Candle"      },
  { emoji: "⚔️", minTier: 2, label: "Swords"      },
  { emoji: "👁️", minTier: 3, label: "Eye"         },
  { emoji: "🩸", minTier: 4, label: "Blood Drop"  },
  { emoji: "🖤", minTier: 5, label: "Black Heart"  },
  // Non-rank emojis — unlocked at tier 2 (any purchase)
  { emoji: "🗡️", minTier: 2, label: "Dagger"      },
  { emoji: "🛡️", minTier: 2, label: "Shield"      },
  { emoji: "🏹", minTier: 2, label: "Bow"          },
  { emoji: "🌙", minTier: 2, label: "Moon"         },
  { emoji: "⚜️", minTier: 2, label: "Fleur-de-lis" },
  { emoji: "🥀", minTier: 2, label: "Wilted Rose"  },
  { emoji: "🪦", minTier: 2, label: "Tombstone"    },
  { emoji: "⛓️", minTier: 2, label: "Chains"       },
  { emoji: "🔮", minTier: 2, label: "Orb"          },
  { emoji: "✝️", minTier: 2, label: "Cross"        },
  { emoji: "☠️", minTier: 2, label: "Skull"        },
];

export function getUnlockedEmojis(tier: number): typeof EMOJI_UNLOCKS {
  return EMOJI_UNLOCKS.filter((e) => tier >= e.minTier);
}

export const RANKS: Rank[] = [
  { tier: 1, title: "The Wanderer",  emoji: "🕯️", threshold: 0,  perk: "Early access to drops",                  discount: 0  },
  { tier: 2, title: "The Forgotten", emoji: "⚔️", threshold: 1,  perk: "5% off next order",                       discount: 5  },
  { tier: 3, title: "The Hunter",    emoji: "👁️", threshold: 5,  perk: "Exclusive discounts and rewards",         discount: 10 },
  { tier: 4, title: "The Initiate",  emoji: "🩸", threshold: 10, perk: "15% off + exclusive colorways",           discount: 15 },
  { tier: 5, title: "The Obliveyon", emoji: "🖤", threshold: 30, perk: "15% off every order",                     discount: 15 },
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
