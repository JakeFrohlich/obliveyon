import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

const TIKTOK_KEY = process.env.TIKTOK_API_KEY;
const YOUTUBE_KEY = process.env.YOUTUBE_API_KEY;
const INSTAGRAM_KEY = process.env.INSTAGRAM_GRAPH_API_KEY;
const ENABLE_PUPPETEER = process.env.ENABLE_PUPPETEER === "true";

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
    // Try TikTok oEmbed API first (public, no auth needed)
    const oEmbedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
    const res = await fetch(oEmbedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (res.ok) {
      const data = (await res.json()) as { html?: string };
      // oEmbed returns HTML embed code; view count may be in the HTML
      if (data.html) {
        // TikTok's oEmbed doesn't include view count, so fall back to Puppeteer
        // if enabled
      }
    }

    // Fall back to Puppeteer if enabled
    if (!ENABLE_PUPPETEER) {
      console.warn("TikTok scraping disabled (ENABLE_PUPPETEER=false) — use manual entry");
      return 0;
    }

    let browser;
    try {
      const videoIdMatch = url.match(/(?:tiktok\.com|vm\.tiktok\.com)\/(?:v\/)?(\d+)|\/video\/(\d+)/);
      if (!videoIdMatch) return 0;

      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-blink-features=AutomationControlled"],
      });
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      );
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Try multiple selectors for view count
      const viewCount = await page.evaluate(() => {
        // Method 1: Look for data-e2e attribute
        let elem = document.querySelector('span[data-e2e="video-views"]');
        if (elem?.textContent) return parseInt(elem.textContent.replace(/[^\d]/g, "")) || 0;

        // Method 2: Look in all span elements for view patterns
        const spanElems = document.querySelectorAll("span");
        for (const el of spanElems) {
          const text = el.textContent || "";
          // Match patterns like "1.2M" or "123.4K"
          const match = text.match(/^([\d.]+[KM])\s*$/);
          if (match && !text.includes("Like") && !text.includes("Comment")) {
            let num = parseFloat(match[1]);
            if (text.includes("K")) num *= 1000;
            if (text.includes("M")) num *= 1000000;
            return Math.round(num);
          }
        }

        // Method 3: Search all text nodes
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let currentNode;
        while ((currentNode = walker.nextNode())) {
          const text = (currentNode.textContent || "").trim();
          const match = text.match(/^([\d.]+[KM])$/);
          if (match) {
            let num = parseFloat(match[1]);
            if (text.includes("K")) num *= 1000;
            if (text.includes("M")) num *= 1000000;
            return Math.round(num);
          }
        }

        return 0;
      });

      return viewCount;
    } finally {
      if (browser) await browser.close();
    }
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
  if (!ENABLE_PUPPETEER) {
    console.warn("Instagram scraping disabled (ENABLE_PUPPETEER=false) — use manual entry");
    return 0;
  }

  let browser;
  try {
    const postMatch = url.match(/\/(?:p|reel)\/([A-Za-z0-9_-]+)\//);
    if (!postMatch) return 0;

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-blink-features=AutomationControlled"],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // Wait for view count element to load
    await page.waitForTimeout(2000);

    // Extract view count from page
    const viewCount = await page.evaluate(() => {
      // Method 1: Look for aria-label with view count
      const allElements = document.querySelectorAll("*");
      for (const el of allElements) {
        const ariaLabel = el.getAttribute("aria-label") || "";
        // Match patterns like "123,456 views" or "1.2M views"
        const match = ariaLabel.match(/([\d,]+|[\d.]+[KM])\s*views?/i);
        if (match) {
          let num = match[1];
          num = num.replace(/,/g, "");
          let parsed = parseFloat(num);
          if (num.includes("K")) parsed *= 1000;
          if (num.includes("M")) parsed *= 1000000;
          return Math.round(parsed);
        }
      }

      // Method 2: Look in all text content
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let currentNode;
      while ((currentNode = walker.nextNode())) {
        const text = currentNode.textContent || "";
        const match = text.match(/([\d,]+|[\d.]+[KM])\s*views?/i);
        if (match) {
          let num = match[1];
          num = num.replace(/,/g, "");
          let parsed = parseFloat(num);
          if (num.includes("K")) parsed *= 1000;
          if (num.includes("M")) parsed *= 1000000;
          return Math.round(parsed);
        }
      }

      return 0;
    });

    return viewCount;
  } catch (err) {
    console.error("Instagram scrape failed:", err);
    return 0;
  } finally {
    if (browser) await browser.close();
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
