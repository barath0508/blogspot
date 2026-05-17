import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = getSupabaseAdmin();

  await supabase.rpc("increment_view_count", { post_slug: slug });
  return NextResponse.json({ ok: true });
}
