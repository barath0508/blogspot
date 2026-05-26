import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/posts";
import { getSiteUrl } from "@/lib/seoHelper";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const SITE_URL = getSiteUrl();
  const { posts } = await getPublishedPosts({ perPage: 20 });

  let text = `# Trendly - Full Content Feed

> This document contains a consolidation of the 20 most recent articles published on Trendly. It is optimized for consumption by LLMs and search agents.

---

`;

  for (const post of posts) {
    const postUrl = `${SITE_URL}/blog/${post.slug}`;
    const pubDate = post.published_at 
      ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "Draft";

    text += `## Title: ${post.title}
- **URL**: [Read full post](${postUrl})
- **Published**: ${pubDate}
- **Excerpt**: ${post.excerpt}
- **Keywords**: ${post.seo_keywords?.join(", ") ?? ""}

### Article Content:
${post.content}

---

`;
  }

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200"
    }
  });
}
