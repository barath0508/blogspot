import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { generateSeoMetadata, pingSearchEngines } from "@/lib/seo";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabaseAdmin = getSupabaseAdmin();
  const { id } = await params;
  const body = await request.json();

  const seo = generateSeoMetadata({
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    meta_title: body.meta_title,
    meta_description: body.meta_description,
    seo_keywords: body.seo_keywords
  });

  const { error } = await supabaseAdmin
    .from("posts")
    .update({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      meta_title: seo.meta_title,
      meta_description: seo.meta_description,
      seo_keywords: seo.seo_keywords,
      is_published: body.is_published,
      published_at: body.published_at
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (body.is_published) pingSearchEngines();

  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabaseAdmin = getSupabaseAdmin();
  const { id } = await params;

  const { error } = await supabaseAdmin.from("posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
