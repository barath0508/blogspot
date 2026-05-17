"use client";

import { useState } from "react";
import Link from "next/link";

type Comment = {
  id: string;
  author_name: string;
  body: string;
  is_approved: boolean;
  created_at: string;
  post_id: string;
  posts: { title: string; slug: string } | null;
};

export function CommentModerationClient({ initialComments }: { initialComments: Comment[] }) {
  const [comments, setComments] = useState(initialComments);
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = comments.filter((c) => {
    if (filter === "approved") return c.is_approved;
    if (filter === "pending") return !c.is_approved;
    return true;
  });

  const approve = async (id: string) => {
    setBusy(id);
    await fetch(`/api/admin/comments/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_approved: true }) });
    setComments((prev) => prev.map((c) => c.id === id ? { ...c, is_approved: true } : c));
    setBusy(null);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this comment?")) return;
    setBusy(id);
    await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
    setComments((prev) => prev.filter((c) => c.id !== id));
    setBusy(null);
  };

  const tabs = [
    { key: "all", label: "All", count: comments.length },
    { key: "approved", label: "Approved", count: comments.filter((c) => c.is_approved).length },
    { key: "pending", label: "Pending", count: comments.filter((c) => !c.is_approved).length },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {tab.label}
            <span className="ml-1.5 rounded-full bg-secondary px-1.5 py-0.5 text-xs">{tab.count}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">
          No comments found
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((comment) => (
            <div key={comment.id} className={`rounded-xl border bg-card p-5 ${!comment.is_approved ? "border-amber-200 dark:border-amber-900" : "border-border"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-semibold text-sm text-foreground">{comment.author_name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${comment.is_approved ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"}`}>
                      {comment.is_approved ? "Approved" : "Pending"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">{comment.body}</p>
                  {comment.posts && (
                    <Link href={`/blog/${comment.posts.slug}`} target="_blank"
                      className="text-xs text-primary hover:underline line-clamp-1">
                      On: {comment.posts.title}
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!comment.is_approved && (
                    <button onClick={() => approve(comment.id)} disabled={busy === comment.id}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                      Approve
                    </button>
                  )}
                  <button onClick={() => remove(comment.id)} disabled={busy === comment.id}
                    className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
