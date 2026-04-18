import { NextRequest, NextResponse } from "next/server";

const TIKTOK_KEY = process.env.TIKTOK_API_KEY;
const YOUTUBE_KEY = process.env.YOUTUBE_API_KEY;
const INSTAGRAM_KEY = process.env.INSTAGRAM_GRAPH_API_KEY;

type PlatformLink = {
  platform: "tiktok" | "youtube" | "instagram";
  url: string;
};

type ViewCache = {
  views: number;
  fetchedAt: number;
};

// Simple in-memory cache: key = JSON.stringify(links), value = { views, fetchedAt }
const cache = new Map<string, ViewCache>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

async function extractTikTokViews(url: string): Promise<number> {
  try {
    const videoIdMatch = url.match(/(?:tiktok\.com|vm\.tiktok\.com)\/(?:v\/)?(\d+)/);
    if (!videoIdMatch) return 0;
    const videoId = videoIdMatch[1];

    // TikTok API requires OAuth — simplified for now
    // In production, you'd need proper OAuth flow or use a proxy service
    // For MVP, return 0 or prompt user to enter manually
    console.warn("TikTok API requires OAuth setup — skipping auto-fetch");
    return 0;
  } catch (err) {
    console.error("TikTok scrape failed:", err);
    return 0;
  }
}

async function extractYouTubeViews(url: string): Promise<number> {
  try {
    const videoIdMatch = url.match(/(?:youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&\n?#]+)/);
    if (!videoIdMatch) return 0;
    const videoId = videoIdMatch[1];

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_KEY}&part=statistics`
    );
    if (!res.ok) return 0;

    const data = (await res.json()) as {
      items?: Array<{ statistics?: { viewCount?: string } }>;
    };
    const viewCount = data.items?.[0]?.statistics?.viewCount;
    return viewCount ? parseInt(viewCount) : 0;
  } catch (err) {
    console.error("YouTube scrape failed:", err);
    return 0;
  }
}

async function extractInstagramViews(url: string): Promise<number> {
  try {
    // Instagram Graph API requires post access token and business account setup
    // Simplified: return 0 for now, user can enter manually
    console.warn("Instagram Graph API requires business account setup — skipping auto-fetch");
    return 0;
  } catch (err) {
    console.error("Instagram scrape failed:", err);
    return 0;
  }
}

async function scrapeViews(links: PlatformLink[]): Promise<number> {
  if (!links || links.length === 0) return 0;

  let total = 0;
  for (const link of links) {
    try {
      switch (link.platform) {
        case "tiktok":
          total += await extractTikTokViews(link.url);
          break;
        case "youtube":
          total += await extractYouTubeViews(link.url);
          break;
        case "instagram":
          total += await extractInstagramViews(link.url);
          break;
      }
    } catch (err) {
      console.error(`Error scraping ${link.platform}:`, err);
    }
  }
  return total;
}

export async function POST(req: NextRequest) {
  // Admin endpoints are local-dev only
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { links } = body as { links?: PlatformLink[] };
  if (!Array.isArray(links)) {
    return NextResponse.json({ error: "links must be an array" }, { status: 400 });
  }

  const cacheKey = JSON.stringify(links);
  const cached = cache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return NextResponse.json({ views: cached.views, cached: true });
  }

  try {
    const views = await scrapeViews(links);
    cache.set(cacheKey, { views, fetchedAt: now });
    return NextResponse.json({ views, cached: false });
  } catch (err) {
    console.error("Scrape error:", err);
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
