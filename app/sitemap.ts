import type { MetadataRoute } from "next";
import { getSupabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://blogspot-phi.vercel.app").replace(/\/$/, "");
  const supabase = getSupabase();

  const [{ data: posts }, { data: categories }, { data: tags }] = await Promise.all([
    supabase
      .from("posts")
      .select("slug,updated_at,published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false }),
    supabase.from("categories").select("slug,updated_at"),
    supabase.from("tags").select("slug,updated_at")
  ]);

  const postEntries: MetadataRoute.Sitemap = (posts ?? []).map((post: any) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at ?? post.published_at),
    changeFrequency: "weekly" as const,
    priority: 0.9
  }));

  const categoryEntries: MetadataRoute.Sitemap = (categories ?? []).map((cat: any) => ({
    url: `${base}/?category=${cat.slug}`,
    lastModified: cat.updated_at ? new Date(cat.updated_at) : new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6
  }));

  const tagEntries: MetadataRoute.Sitemap = (tags ?? []).map((tag: any) => ({
    url: `${base}/?tag=${tag.slug}`,
    lastModified: tag.updated_at ? new Date(tag.updated_at) : new Date(),
    changeFrequency: "daily" as const,
    priority: 0.5
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 1.0 },
    ...postEntries,
    ...categoryEntries,
    ...tagEntries
  ];
}
