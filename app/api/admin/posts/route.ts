import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { generateSeoMetadata, pingSearchEngines } from "@/lib/seo";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabaseAdmin = getSupabaseAdmin();

  const body = await request.json();
  const { title, slug, excerpt, content, meta_title, meta_description, seo_keywords, is_published, published_at } = body;
  const seo = generateSeoMetadata({ title, excerpt, content, meta_title, meta_description, seo_keywords });

  const { data, error } = await supabaseAdmin
    .from("posts")
    .insert([{
      title, slug, excerpt, content,
      meta_title: seo.meta_title,
      meta_description: seo.meta_description,
      seo_keywords: seo.seo_keywords,
      is_published,
      published_at
    }])
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (is_published) pingSearchEngines();

  return NextResponse.json({ id: data.id });
}
