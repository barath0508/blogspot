import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { CommentModerationClient } from "./client";

export default async function AdminCommentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const supabase = getSupabaseAdmin();
  const { data: comments } = await supabase
    .from("comments")
    .select("id,author_name,body,is_approved,created_at,post_id,posts(title,slug)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Comment Moderation</h1>
        <p className="text-sm text-muted-foreground mt-1">{comments?.length ?? 0} total comments</p>
      </div>
      <CommentModerationClient initialComments={(comments ?? []) as any} />
    </div>
  );
}
