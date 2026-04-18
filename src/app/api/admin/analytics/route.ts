import { NextRequest, NextResponse } from "next/server";

const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

type KlaviyoProfile = {
  id: string;
  attributes: {
    email: string | null;
    created: string;
    properties: Record<string, unknown>;
  };
};

type AggregatedRef = {
  ref: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  emails: string[];
  signupsByDay: Record<string, number>;
};

// In-memory cache — shared across all requests in this Vercel function instance
let cache: { data: AggregatedRef[]; total: number; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 60_000; // 60s

async function fetchAllProfiles(): Promise<KlaviyoProfile[]> {
  const profiles: KlaviyoProfile[] = [];
  let cursor: string | null = null;
  const maxPages = 100; // Safety cap: 100 pages × 100 profiles = 10k max per fetch
  let pageCount = 0;

  do {
    const url = new URL("https://a.klaviyo.com/api/profiles/");
    url.searchParams.set("page[size]", "100");
    if (cursor) url.searchParams.set("page[cursor]", cursor);

    const res: Response = await fetch(url.toString(), {
      headers: {
        Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        revision: "2025-01-15",
        accept: "application/vnd.api+json",
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Klaviyo ${res.status}: ${body}`);
    }

    const json = (await res.json()) as {
      data: KlaviyoProfile[];
      links: { next: string | null };
    };
    profiles.push(...json.data);

    // Parse cursor from next link
    if (json.links.next) {
      const nextUrl = new URL(json.links.next);
      cursor = nextUrl.searchParams.get("page[cursor]");
    } else {
      cursor = null;
    }
    pageCount++;
  } while (cursor && pageCount < maxPages);

  return profiles;
}

function aggregate(profiles: KlaviyoProfile[]): AggregatedRef[] {
  const byRef = new Map<string, AggregatedRef>();
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  for (const p of profiles) {
    const ref = p.attributes.properties?.ad_ref;
    if (typeof ref !== "string" || !ref) continue;

    const email = p.attributes.email ?? "(no email)";
    const created = p.attributes.created;
    const createdDate = new Date(created);

    const existing = byRef.get(ref);
    if (!existing) {
      byRef.set(ref, {
        ref,
        count: 1,
        firstSeen: created,
        lastSeen: created,
        emails: [email],
        signupsByDay: {},
      });
    } else {
      existing.count += 1;
      existing.emails.push(email);
      if (created < existing.firstSeen) existing.firstSeen = created;
      if (created > existing.lastSeen) existing.lastSeen = created;
    }

    // Track signups by day (last 7 days only)
    if (createdDate.getTime() >= sevenDaysAgo) {
      const dayKey = createdDate.toISOString().split("T")[0];
      const row = byRef.get(ref)!;
      row.signupsByDay[dayKey] = (row.signupsByDay[dayKey] ?? 0) + 1;
    }
  }

  return Array.from(byRef.values()).sort((a, b) => b.count - a.count);
}

export async function GET(req: NextRequest) {
  // Admin endpoints are local-dev only
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }

  // Password check via Authorization header
  const auth = req.headers.get("authorization");
  if (!ADMIN_PASSWORD || auth !== `Bearer ${ADMIN_PASSWORD}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!KLAVIYO_API_KEY) {
    return NextResponse.json({ error: "Klaviyo not configured" }, { status: 500 });
  }

  const force = req.nextUrl.searchParams.get("refresh") === "1";
  const now = Date.now();

  if (!force && cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return NextResponse.json({
      data: cache.data,
      total: cache.total,
      fetchedAt: cache.fetchedAt,
      cached: true,
    });
  }

  try {
    const profiles = await fetchAllProfiles();
    const data = aggregate(profiles);
    cache = { data, total: profiles.length, fetchedAt: now };
    return NextResponse.json({ data, total: profiles.length, fetchedAt: now, cached: false });
  } catch (err) {
    console.error("Analytics fetch failed:", err);
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
