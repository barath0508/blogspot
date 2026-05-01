import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

function sanitize(input: string) {
  return input.replace(/[<>"'`]/g, (c) => ({ "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" }[c] ?? c));
}

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const supabaseAdmin = getSupabaseAdmin();
  const { slug } = await params;
  const { data: post } = await supabaseAdmin.from("posts").select("id").eq("slug", slug).single();
  if (!post) return NextResponse.json({ comments: [] });

  const { data: comments, error } = await supabaseAdmin
    .from("comments")
    .select("id,author_name,body,created_at")
    .eq("post_id", post.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ comments: comments ?? [] });
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const supabaseAdmin = getSupabaseAdmin();
  const { slug } = await params;
  const body = await request.json();
  const authorName = sanitize(String(body.authorName ?? "").trim());
  const commentBody = sanitize(String(body.body ?? "").trim());

  if (authorName.length < 2 || commentBody.length < 2) {
    return NextResponse.json({ error: "Invalid comment" }, { status: 400 });
  }

  const { data: post } = await supabaseAdmin.from("posts").select("id,is_published").eq("slug", slug).single();
  if (!post || !post.is_published) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const { data, error } = await supabaseAdmin
    .from("comments")
    .insert([{ post_id: post.id, author_name: authorName, body: commentBody, is_approved: true }])
    .select("id,author_name,body,created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ comment: data });
}
