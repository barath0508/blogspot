import { getPublishedPosts } from "@/lib/posts";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogspot-phi.vercel.app").replace(/\/$/, "");
const SITE_NAME = "Trendly";
const SITE_DESCRIPTION = "Trending technology news and AI-powered insights — updated every 30 minutes.";
const ACCENT_COLOR = "#0d9488";

export const revalidate = 3600;

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;margin:16px 0;" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hul])/gm, "")
    .trim();
}

export async function GET() {
  const { posts } = await getPublishedPosts();

  const items = posts
    .slice(0, 50)
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = post.published_at
        ? new Date(post.published_at).toUTCString()
        : new Date().toUTCString();
      const updatedDate = post.updated_at
        ? new Date(post.updated_at).toUTCString()
        : pubDate;

      const categories = [
        ...post.categories.map((c) => `<category><![CDATA[${c.name}]]></category>`),
        ...post.tags.map((t) => `<category><![CDATA[${t.name}]]></category>`)
      ].join("\n      ");

      const coverImage = post.cover_image ?? "";
      const mediaContent = coverImage
        ? `<media:content url="${escapeXml(coverImage)}" medium="image" width="1600" height="900">
        <media:title type="plain"><![CDATA[${post.title}]]></media:title>
        <media:description type="plain"><![CDATA[${post.excerpt}]]></media:description>
      </media:content>
      <media:thumbnail url="${escapeXml(coverImage)}" width="1600" height="900"/>`
        : "";

      // Full article HTML for content:encoded — Feedly shows full content
      const bodyHtml = markdownToHtml(post.content ?? "");
      const fullHtml = `${coverImage ? `<img src="${escapeXml(coverImage)}" alt="${escapeXml(post.title)}" style="max-width:100%;border-radius:12px;margin-bottom:24px;" />` : ""}
<p>${escapeXml(post.excerpt)}</p>
${bodyHtml}
<p><a href="${url}">Read the full article on ${SITE_NAME} →</a></p>`;

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <content:encoded><![CDATA[${fullHtml}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <dc:date>${new Date(post.published_at ?? post.created_at).toISOString()}</dc:date>
      <dc:creator><![CDATA[${SITE_NAME} Editorial]]></dc:creator>
      <dc:language>en-US</dc:language>
      ${categories}
      ${mediaContent}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:webfeeds="http://webfeeds.org/rss/1.0">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-US</language>
    <copyright>Copyright ${new Date().getFullYear()} ${SITE_NAME}</copyright>
    <managingEditor>hello@trendly.com (${SITE_NAME})</managingEditor>
    <webMaster>hello@trendly.com (${SITE_NAME})</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>

    <!-- Feedly-specific extensions -->
    <webfeeds:cover image="${SITE_URL}/og-default.png"/>
    <webfeeds:icon>${SITE_URL}/icon-512.png</webfeeds:icon>
    <webfeeds:logo>${SITE_URL}/icon-512.png</webfeeds:logo>
    <webfeeds:accentColor>${ACCENT_COLOR.replace("#", "")}</webfeeds:accentColor>
    <webfeeds:related layout="card" target="browser"/>
    <webfeeds:analytics id="UA-XXXXXXXX-X" engine="GoogleAnalytics"/>

    <image>
      <url>${SITE_URL}/icon-512.png</url>
      <title>${SITE_NAME}</title>
      <link>${SITE_URL}</link>
      <width>144</width>
      <height>144</height>
      <description>${SITE_DESCRIPTION}</description>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
