import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DeletePostButton } from "@/components/DeletePostButton";
import { getSupabaseAdmin } from "@/lib/supabase";

type AdminPostListItem = {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  updated_at: string;
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const supabaseAdmin = getSupabaseAdmin();

  const { data } = await supabaseAdmin
    .from("posts")
    .select("id,title,slug,is_published,updated_at")
    .order("updated_at", { ascending: false });

  const posts: AdminPostListItem[] = (data ?? []) as AdminPostListItem[];
  const published = posts.filter((p) => p.is_published).length;

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Manage your blog posts</p>
        </div>
        <Link
          href="/admin/new"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New post
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total posts", value: posts.length },
          { label: "Published", value: published },
          { label: "Drafts", value: posts.length - published },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-3xl">📝</p>
            <p className="mt-2 font-medium text-gray-700">No posts yet</p>
            <Link href="/admin/new" className="mt-3 text-sm text-indigo-600 underline underline-offset-2">
              Create your first post
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3">Title</th>
                <th className="hidden px-5 py-3 sm:table-cell">Updated</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                    <p className="text-xs text-gray-400">/{post.slug}</p>
                  </td>
                  <td className="hidden px-5 py-4 text-gray-500 sm:table-cell">
                    {new Date(post.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      post.is_published
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                        title="View"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </Link>
                      <Link
                        href={`/admin/edit/${post.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <DeletePostButton id={post.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
