import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seoHelper";

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = getSiteUrl();
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
