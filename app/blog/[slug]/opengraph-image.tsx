import { ImageResponse } from "next/og";
import { getPublishedPostBySlug } from "@/lib/posts";
import { getSiteUrl } from "@/lib/seoHelper";

export const runtime = "edge";
export const alt = "Trendly Blog Post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CATEGORY_COLORS: Record<string, string> = {
  "technology": "#3b82f6",
  "artificial-intelligence": "#7c3aed",
  "ai": "#7c3aed",
  "software-development": "#06b6d4",
  "business": "#f59e0b",
  "startup": "#f97316",
  "innovation": "#10b981",
  "cybersecurity": "#ef4444",
  "trending": "#e11d48",
  "science": "#059669",
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
            width: "100%", height: "100%",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg, #6366f1, #9333ea)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 26, fontWeight: 900,
            }}>T</div>
            <span style={{ fontSize: 36, fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>
              Trendly
            </span>
          </div>
          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Technology · AI · Ideas
          </span>
        </div>
      ),
      { ...size }
    );
  }

  const wordCount = (post.content ?? "").trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));
  const category = post.categories?.[0];
  const categoryColor = CATEGORY_COLORS[category?.slug?.toLowerCase() ?? ""] ?? "#4f46e5";
  const hostname = new URL(getSiteUrl()).hostname;

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 6,
          background: `linear-gradient(90deg, ${categoryColor}, #7c3aed, #ec4899)`,
        }} />

        {/* Left accent stripe */}
        <div style={{
          position: "absolute", top: 60, left: 0, bottom: 60, width: 5,
          background: categoryColor, borderRadius: "0 4px 4px 0",
        }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingLeft: 24 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: 20, fontWeight: 900,
              }}>T</div>
              <span style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>
                Trendly
              </span>
            </div>
            {/* Category pill */}
            {category && (
              <div style={{
                background: categoryColor, color: "white",
                borderRadius: 99, padding: "8px 20px",
                fontSize: 16, fontWeight: 800,
                letterSpacing: "0.05em", textTransform: "uppercase",
              }}>
                {category.name}
              </div>
            )}
          </div>

          {/* Title */}
          <div style={{
            fontSize: post.title.length > 60 ? 52 : 62,
            fontWeight: 900,
            color: "#0f172a",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {post.title}
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <div style={{
              fontSize: 22,
              color: "#64748b",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {post.excerpt}
            </div>
          )}
        </div>

        {/* Bottom row */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingLeft: 24,
          borderTop: "1px solid #e2e8f0",
          paddingTop: 24, marginTop: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 18, color: "#94a3b8", fontWeight: 600 }}>
            <span>⏱ {readTime} min read</span>
            <span>·</span>
            <span>{hostname}</span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#f1f5f9", borderRadius: 10, padding: "10px 20px",
            fontSize: 15, fontWeight: 700, color: "#4f46e5",
            letterSpacing: "0.02em",
          }}>
            Read Article →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
