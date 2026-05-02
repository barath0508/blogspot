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
        allow: ["/", "/blog/", "/?category=", "/?tag="],
        disallow: ["/admin", "/api/", "/login", "/?q="]
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/blog/", "/?category=", "/?tag="],
        disallow: ["/admin", "/api/", "/login", "/?q="]
      },
      {
        userAgent: "GPTBot",
        disallow: ["/"]
      },
      {
        userAgent: "CCBot",
        disallow: ["/"]
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
