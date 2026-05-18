import { NextResponse } from "next/server";
import { publishSpecificTopic } from "@/lib/automation/autoPublisher";
import { timingSafeEqual } from "crypto";

export const runtime = "nodejs";
export const maxDuration = 300;

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
