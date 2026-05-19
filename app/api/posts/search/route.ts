import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ posts: [] });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select("id,title,slug,excerpt,post_categories(categories(name))")
    .eq("is_published", true)
    .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
    .order("published_at", { ascending: false })
    .limit(6);

  if (error) {
    return NextResponse.json({ posts: [] }, { status: 500 });
  }

  const posts = (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt?.slice(0, 120) ?? "",
    categories: row.post_categories?.map((pc: any) => pc.categories).filter(Boolean) ?? [],
  }));

  return NextResponse.json({ posts });
}
