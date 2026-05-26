import { getPublishedPosts } from "@/lib/posts";
import { getSiteUrl } from "@/lib/seoHelper";

const SITE_NAME = "Trendly";

export const revalidate = 300;

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function GET() {
  const SITE_URL = getSiteUrl();
  const { posts } = await getPublishedPosts({ perPage: 100 });

  // Google News sitemap only accepts articles published in the last 2 days
  const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
  let recentPosts = posts.filter(
    (p) => p.published_at && new Date(p.published_at).getTime() > twoDaysAgo
  );

  // Fallback: If no posts in the last 48 hours, use the 5 most recent posts
  // to avoid sending an empty sitemap which causes format/empty validation errors in search engines.
  if (recentPosts.length === 0 && posts.length > 0) {
    recentPosts = posts.slice(0, 5);
  }

  const items = recentPosts
    .map((post) => {
      const pubDate = new Date(post.published_at!).toISOString();
      const coverImage = post.cover_image ?? `${SITE_URL}/og-default.png`;
      const url = `${SITE_URL}/blog/${post.slug}`;

      return `  <url>
    <loc>${escapeXml(url)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(post.title)}</news:title>
    </news:news>
    <image:image>
      <image:loc>${escapeXml(coverImage)}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
    </image:image>
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
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600"
    }
  });
}
