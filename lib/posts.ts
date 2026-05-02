import { getSupabase } from "@/lib/supabase";
import { PostRecord } from "@/types/blog";

const POST_SELECT =
  "id,title,slug,excerpt,content,meta_title,meta_description,seo_keywords,cover_image,is_published,published_at,created_at,updated_at,post_categories(categories(slug,name)),post_tags(tags(slug,name))";

export async function getPublishedPosts(params?: { category?: string; tag?: string; q?: string }) {
  const supabase = getSupabase();

  // Resolve post IDs for category filter
  let categoryPostIds: string[] | null = null;
  if (params?.category) {
    const { data: cats } = await supabase
      .from("post_categories")
      .select("post_id, categories!inner(slug)")
      .eq("categories.slug", params.category);
    categoryPostIds = (cats ?? []).map((r: any) => r.post_id);
    if (categoryPostIds?.length === 0) return [];
  }

  // Resolve post IDs for tag filter
  let tagPostIds: string[] | null = null;
  if (params?.tag) {
    const { data: tags } = await supabase
      .from("post_tags")
      .select("post_id, tags!inner(slug)")
      .eq("tags.slug", params.tag);
    tagPostIds = (tags ?? []).map((r: any) => r.post_id);
    if (tagPostIds?.length === 0) return [];
  }

  let query = supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (categoryPostIds) query = query.in("id", categoryPostIds);
  if (tagPostIds) query = query.in("id", tagPostIds);

  // Text search on title + excerpt
  if (params?.q) {
    const term = params.q.trim();
    query = query.or(`title.ilike.%${term}%,excerpt.ilike.%${term}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map(mapPost) as PostRecord[];
}

export async function getPublishedPostBySlug(slug: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) return null;
  return mapPost(data) as PostRecord;
}

function mapPost(row: any) {
  return {
    ...row,
    seo_keywords: Array.isArray(row.seo_keywords) ? row.seo_keywords : [],
    categories: row.post_categories?.map((item: any) => item.categories).filter(Boolean) ?? [],
    tags: row.post_tags?.map((item: any) => item.tags).filter(Boolean) ?? []
  };
}
