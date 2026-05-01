import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

async function getPostId(slug: string) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data } = await supabaseAdmin.from("posts").select("id,is_published").eq("slug", slug).single();
  if (!data || !data.is_published) return null;
  return data.id as string;
}

async function getLikes(postId: string, visitorId?: string) {
  const supabaseAdmin = getSupabaseAdmin();
  const [{ count }, likedRes] = await Promise.all([
    supabaseAdmin.from("post_likes").select("id", { head: true, count: "exact" }).eq("post_id", postId),
    visitorId
      ? supabaseAdmin.from("post_likes").select("id").eq("post_id", postId).eq("visitor_id", visitorId).maybeSingle()
      : Promise.resolve({ data: null as { id: string } | null })
  ]);

  return {
    likes: count ?? 0,
    liked: Boolean(likedRes.data)
  };
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postId = await getPostId(slug);
  if (!postId) return NextResponse.json({ likes: 0, liked: false });

  const url = new URL(request.url);
  const visitorId = url.searchParams.get("visitorId") ?? undefined;
  const result = await getLikes(postId, visitorId);
  return NextResponse.json(result);
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const supabaseAdmin = getSupabaseAdmin();
  const { slug } = await params;
  const postId = await getPostId(slug);
  if (!postId) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const body = await request.json();
  const visitorId = String(body.visitorId ?? "").trim();
  if (visitorId.length < 6) return NextResponse.json({ error: "Invalid visitor id" }, { status: 400 });

  await supabaseAdmin.from("post_likes").upsert([{ post_id: postId, visitor_id: visitorId }], { onConflict: "post_id,visitor_id" });
  const result = await getLikes(postId, visitorId);
  return NextResponse.json(result);
}
