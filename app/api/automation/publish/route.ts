import { NextResponse } from "next/server";
import { fetchTrendingTopics, filterOnBrandTopics, publishSpecificTopic } from "@/lib/automation/autoPublisher";
import { timingSafeEqual } from "crypto";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 min — enough for multiple Gemini calls

const POSTS_PER_RUN = 1; // publishes 1 post at once

function safeCompare(a: string, b: string) {
  try {
    return a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

function isAuthorized(request: Request) {
  const secret = process.env.AUTOMATION_CRON_SECRET;
  if (!secret) return false;
  const authHeader = request.headers.get("authorization") ?? "";
  const headerSecret = request.headers.get("x-cron-secret") ?? "";
  const querySecret = new URL(request.url).searchParams.get("secret") ?? "";
  return (
    safeCompare(authHeader, `Bearer ${secret}`) ||
    safeCompare(headerSecret, secret) ||
    safeCompare(querySecret, secret)
  );
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const count = Math.min(
    parseInt(new URL(request.url).searchParams.get("count") ?? String(POSTS_PER_RUN), 10),
    12 // hard cap
  );

  const results = [];
  let topics: string[] = [];

  try {
    // Google Trends returns generic daily trends (sports, celebrities, etc.), so we pull a wider
    // raw pool and filter it down to topics that actually fit Trendly's tech/AI/science/business beat.
    const rawTopics = await fetchTrendingTopics(Math.min(count * 5, 40));
    topics = await filterOnBrandTopics(rawTopics, count);
  } catch (error) {
    return NextResponse.json({
      error: "Failed to fetch topics",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }

  if (topics.length === 0) {
    return NextResponse.json({ published: 0, skipped: 0, failed: 0, results: [], note: "No on-brand trending topics found this cycle" });
  }

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    try {
      const result = await publishSpecificTopic(topic);
      results.push(result);
      // Small delay between posts to avoid Gemini rate limits
      if (i < topics.length - 1) await new Promise((r) => setTimeout(r, 3000));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      results.push({
        status: "failed",
        topic,
        error: errorMessage.length > 1000 ? errorMessage.substring(0, 1000) + "...[truncated]" : errorMessage
      });
    }
  }

  const published = results.filter((r) => r.status === "published").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const failed = results.filter((r) => r.status === "failed").length;

  return NextResponse.json({ published, skipped, failed, results });
}

