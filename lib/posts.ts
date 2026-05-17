import { getSupabase } from "@/lib/supabase";
import { PostRecord } from "@/types/blog";

const POST_SELECT =
  "id,title,slug,excerpt,content,meta_title,meta_description,seo_keywords,cover_image,is_published,published_at,created_at,updated_at,view_count,post_categories(categories(slug,name)),post_tags(tags(slug,name))";

export const POSTS_PER_PAGE = 12;

export async function getPublishedPosts(params?: {
  category?: string;
  tag?: string;
  q?: string;
  page?: number;
}) {
  const supabase = getSupabase();
  const page = Math.max(1, params?.page ?? 1);
  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  // Skip empty search query
  if (params?.q !== undefined && params.q.trim() === "") {
    delete params.q;
  }

  const categoryPostIds: string[] = [];
  if (params?.category) {
    const { data: cats } = await supabase
      .from("post_categories")
      .select("post_id, categories!inner(slug)")
      .eq("categories.slug", params.category);
    categoryPostIds.push(...(cats ?? []).map((r: any) => r.post_id));
    if (categoryPostIds.length === 0) return { posts: [], total: 0 };
  }

  const tagPostIds: string[] = [];
  if (params?.tag) {
    const { data: tags } = await supabase
      .from("post_tags")
      .select("post_id, tags!inner(slug)")
      .eq("tags.slug", params.tag);
    tagPostIds.push(...(tags ?? []).map((r: any) => r.post_id));
    if (tagPostIds.length === 0) return { posts: [], total: 0 };
  }

  let query = supabase
    .from("posts")
    .select(POST_SELECT, { count: "exact" })
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .range(from, to);

  if (categoryPostIds.length > 0) query = query.in("id", categoryPostIds);
  if (tagPostIds.length > 0) query = query.in("id", tagPostIds);
  if (params?.q) {
    const term = params.q.trim();
    query = query.or(`title.ilike.%${term}%,excerpt.ilike.%${term}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    posts: (data ?? []).map(mapPost) as PostRecord[],
    total: count ?? 0
  };
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

export async function incrementViewCount(slug: string) {
  const supabase = getSupabase();
  await supabase.rpc("increment_view_count", { post_slug: slug });
}

function mapPost(row: any) {
  return {
    ...row,
    seo_keywords: Array.isArray(row.seo_keywords) ? row.seo_keywords : [],
    view_count: row.view_count ?? 0,
    categories: row.post_categories?.map((item: any) => item.categories).filter(Boolean) ?? [],
    tags: row.post_tags?.map((item: any) => item.tags).filter(Boolean) ?? []
  };
}
