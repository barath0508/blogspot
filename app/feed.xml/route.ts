import { getPublishedPosts } from "@/lib/posts";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogspot-phi.vercel.app").replace(/\/$/, "");
const SITE_NAME = "Insight Daily";
const SITE_DESCRIPTION = "In-depth analysis and expert perspectives on technology, AI, and the ideas shaping our world.";

export const revalidate = 3600;

export async function GET() {
  const posts = await getPublishedPosts();

  const items = posts
    .slice(0, 50)
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = post.published_at ? new Date(post.published_at).toUTCString() : new Date().toUTCString();
      const categories = post.categories.map((c) => `<category><![CDATA[${c.name}]]></category>`).join("");
      const tags = post.tags.map((t) => `<category><![CDATA[${t.name}]]></category>`).join("");
      const image = post.cover_image
        ? `<media:content url="${post.cover_image}" medium="image" width="1600" height="900"/>`
        : "";
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
      ${categories}${tags}
      ${image}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/icon-512.png</url>
      <title>${SITE_NAME}</title>
      <link>${SITE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
