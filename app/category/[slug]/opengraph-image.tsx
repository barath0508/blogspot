import { ImageResponse } from "next/og";
import { getSupabase } from "@/lib/supabase";
import { getSiteUrl } from "@/lib/seoHelper";

export const runtime = "edge";
export const alt = "Trendly Category Articles";
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
  const supabase = getSupabase();

  const [categoryResult, countResult] = await Promise.all([
    supabase.from("categories").select("name").eq("slug", slug).single(),
    supabase.from("post_categories")
      .select("post_id, categories!inner(slug), posts!inner(is_published)", { count: "exact", head: true })
      .eq("categories.slug", slug)
      .eq("posts.is_published", true)
  ]);

  const categoryName = categoryResult.data?.name ?? slug.replace(/-/g, " ");
  const articleCount = countResult.count ?? 0;
  const categoryColor = CATEGORY_COLORS[slug.toLowerCase()] ?? "#4f46e5";
  const hostname = new URL(getSiteUrl()).hostname;

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Glow Effects */}
        <div style={{
          position: "absolute", top: -100, right: -100, width: 400, height: 400,
          background: categoryColor, filter: "blur(120px)", borderRadius: "50%", opacity: 0.25
        }} />
        <div style={{
          position: "absolute", bottom: -100, left: 100, width: 300, height: 300,
          background: "#7c3aed", filter: "blur(120px)", borderRadius: "50%", opacity: 0.2
        }} />

        {/* Top bar accent */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 8,
          background: `linear-gradient(90deg, ${categoryColor}, #7c3aed, #ec4899)`,
        }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center",
            color: "white", fontSize: 24, fontWeight: 900,
          }}>T</div>
          <span style={{ fontSize: 32, fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>
            Trendly
          </span>
        </div>

        {/* Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 40 }}>
          <span style={{ fontSize: 16, color: categoryColor, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 800 }}>
            Topic Category
          </span>
          <span style={{ fontSize: 64, fontWeight: 900, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            {categoryName}
          </span>
          <span style={{ fontSize: 22, color: "rgba(255, 255, 255, 0.6)", lineHeight: 1.5 }}>
            Explore articles, breaking news, analysis, and expert reviews in {categoryName}.
          </span>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          paddingTop: 32, marginTop: 32
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 18, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>
            <span>📚 {articleCount} Article{articleCount !== 1 ? "s" : ""}</span>
            <span>·</span>
            <span>{hostname}</span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255, 255, 255, 0.08)", borderRadius: 10, padding: "10px 24px",
            fontSize: 16, fontWeight: 700, color: "white",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            Browse Topic →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
