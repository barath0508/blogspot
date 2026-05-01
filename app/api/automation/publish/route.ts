import { NextResponse } from "next/server";
import { publishTrendingPost } from "@/lib/automation/autoPublisher";
import { timingSafeEqual } from "crypto";

export const runtime = "nodejs";

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

  return safeCompare(authHeader, `Bearer ${secret}`) || safeCompare(headerSecret, secret) || safeCompare(querySecret, secret);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await publishTrendingPost();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
