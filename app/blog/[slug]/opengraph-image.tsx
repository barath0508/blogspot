import { ImageResponse } from "next/og";
import { getPublishedPostBySlug } from "@/lib/posts";

export const runtime = "edge";
export const alt = "Insight Daily Blog Post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            background: "linear-gradient(to bottom right, #4f46e5, #9333ea)",
            color: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif",
            fontWeight: 800,
          }}
        >
          Insight Daily
        </div>
      ),
      { ...size }
    );
  }

  const wordCount = (post.content ?? "").trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));
  const category = post.categories?.[0]?.name ?? "Technology";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #ffffff, #f3f4f6)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: 16,
                background: "linear-gradient(to bottom right, #6366f1, #9333ea)",
                color: "white",
                fontSize: 24,
                fontWeight: 900,
              }}
            >
              I
            </div>
            <span
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#111827",
                letterSpacing: "-0.02em",
              }}
            >
              Insight<span style={{ color: "#4f46e5" }}>Daily</span>
            </span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              color: "#4f46e5",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginTop: 40,
            }}
          >
            {category}
          </div>

          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "#111827",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 24,
            fontWeight: 600,
            color: "#6b7280",
          }}
        >
          <span>{readTime} min read</span>
          <span style={{ color: "#d1d5db" }}>•</span>
          <span>{new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://insightdaily.com").hostname}</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
