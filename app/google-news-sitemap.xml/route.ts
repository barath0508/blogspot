import { getPublishedPosts } from "@/lib/posts";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogspot-phi.vercel.app").replace(/\/$/, "");
const SITE_NAME = "Trendly";

export const revalidate = 3600;

export async function GET() {
  const { posts } = await getPublishedPosts();

  // Google News sitemap only accepts articles published in the last 2 days
  const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
  const recentPosts = posts.filter(
    (p) => p.published_at && new Date(p.published_at).getTime() > twoDaysAgo
  );

  const items = recentPosts
    .map((post) => {
      const pubDate = new Date(post.published_at!).toISOString();
      const keywords = post.seo_keywords?.slice(0, 10).join(", ") ?? "";
      const coverImage = post.cover_image ?? `${SITE_URL}/og-default.png`;
      return `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${SITE_NAME}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title><![CDATA[${post.title}]]></news:title>
      <news:keywords><![CDATA[${keywords}]]></news:keywords>
      <news:genres>Blog</news:genres>
    </news:news>
    <image:image>
      <image:loc>${coverImage}</image:loc>
      <image:title><![CDATA[${post.title}]]></image:title>
    </image:image>
    <lastmod>${pubDate}</lastmod>
    <priority>1.0</priority>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${items}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200"
    }
  });
}
