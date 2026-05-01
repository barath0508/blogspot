import { notFound } from "next/navigation";
import { AdminPostEditor } from "@/components/AdminPostEditor";
import { getSupabaseAdmin } from "@/lib/supabase";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabaseAdmin = getSupabaseAdmin();
  const { data: post } = await supabaseAdmin
    .from("posts")
    .select("id,title,slug,excerpt,content,meta_title,meta_description,seo_keywords,is_published")
    .eq("id", id)
    .single();

  if (!post) return notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">Edit Post</h1>
      <AdminPostEditor mode="edit" initialData={post} />
    </div>
  );
}
