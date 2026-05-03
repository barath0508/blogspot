"use server";

import { getSupabase } from "@/lib/supabase";
import { PostRecord } from "@/types/blog";

const POST_SELECT =
  "id,title,slug,excerpt,content,meta_title,meta_description,seo_keywords,cover_image,is_published,published_at,created_at,updated_at,post_categories(categories(slug,name)),post_tags(tags(slug,name))";

function mapPost(row: any) {
  return {
    ...row,
    seo_keywords: Array.isArray(row.seo_keywords) ? row.seo_keywords : [],
    categories: row.post_categories?.map((item: any) => item.categories).filter(Boolean) ?? [],
    tags: row.post_tags?.map((item: any) => item.tags).filter(Boolean) ?? []
  };
}

export async function getPostsBySlugs(slugs: string[]): Promise<PostRecord[]> {
  if (!slugs || slugs.length === 0) return [];
  
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .in("slug", slugs)
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching saved posts:", error);
    return [];
  }

  return (data ?? []).map(mapPost);
}
