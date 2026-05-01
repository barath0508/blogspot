import type { MetadataRoute } from "next";
import { getSupabase } from "@/lib/supabase";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/$/, "");
  const supabase = getSupabase();

  const { data: posts } = await supabase
    .from("posts")
    .select("slug,updated_at,published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const postEntries: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at ?? post.published_at),
    changeFrequency: "weekly",
    priority: 0.8
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "hourly", priority: 1.0 },
    ...postEntries
  ];
}
