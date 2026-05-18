import { NextResponse } from "next/server";
import { publishTrendingPost, publishSpecificTopic } from "@/lib/automation/autoPublisher";
import { timingSafeEqual } from "crypto";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 min — enough for multiple Gemini calls

const POSTS_PER_RUN = 6; // publishes 6 posts at once (~1 every 4 hours equivalent)

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

  for (let i = 0; i < count; i++) {
    try {
      const result = await publishTrendingPost();
      results.push(result);
      // Small delay between posts to avoid Gemini rate limits
      if (i < count - 1) await new Promise((r) => setTimeout(r, 3000));
    } catch (error) {
      results.push({
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  const published = results.filter((r) => r.status === "published").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const failed = results.filter((r) => r.status === "failed").length;

  return NextResponse.json({ published, skipped, failed, results });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { topic } = body;

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'topic' in request body" },
        { status: 400 }
      );
    }

    const result = await publishSpecificTopic(topic);

    return NextResponse.json({
      success: true,
      topic,
      ...result
    });
  } catch (error: any) {
    console.error("publish-topic error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
