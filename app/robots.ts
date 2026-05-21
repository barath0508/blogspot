import type { MetadataRoute } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogspot-phi.vercel.app").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/login"]
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/blog/", "/category/", "/tag/"],
        disallow: ["/admin", "/api/", "/login", "/?q="]
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/blog/", "/category/", "/tag/"],
        disallow: ["/admin", "/api/", "/login", "/?q="]
      },
      {
        userAgent: "GPTBot",
        disallow: ["/"]
      },
      {
        userAgent: "CCBot",
        disallow: ["/"]
      },
      {
        userAgent: "anthropic-ai",
        disallow: ["/"]
      },
      {
        userAgent: "Claude-Web",
        disallow: ["/"]
      },
      {
        userAgent: "Omgilibot",
        disallow: ["/"]
      }
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/google-news-sitemap.xml`, `${SITE_URL}/feed.xml`],
    host: SITE_URL
  };
}
