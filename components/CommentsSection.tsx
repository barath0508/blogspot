"use client";

import { useState } from "react";
import type { CommentRecord } from "@/types/engagement";

type Props = { slug: string; initialComments: CommentRecord[] };

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const avatarColors = [
  "bg-indigo-100 text-indigo-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
];

export function CommentsSection({ slug, initialComments }: Props) {
  const [comments, setComments] = useState(initialComments);
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authorName.trim() || !body.trim()) return;
    setBusy(true);
    const res = await fetch(`/api/posts/${slug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorName: authorName.trim(), body: body.trim() })
    });
    setBusy(false);
    if (!res.ok) return alert("Unable to add comment");
    const data = await res.json();
    setComments((prev) => [data.comment, ...prev]);
    setAuthorName("");
    setBody("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <section className="mt-14 space-y-8 border-t border-gray-100 pt-10">
      <h2 className="text-xl font-bold text-gray-900">
        {comments.length > 0 ? `${comments.length} Comment${comments.length !== 1 ? "s" : ""}` : "Leave a comment"}
      </h2>

      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <input
          required
          className="input-base"
          placeholder="Your name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
        />
        <textarea
          required
          className="input-base min-h-28 resize-none"
          placeholder="Share your thoughts..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {busy ? "Posting..." : "Post comment"}
          </button>
          {success && <p className="text-sm text-emerald-600 font-medium">✓ Comment posted!</p>}
        </div>
      </form>

      {comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment, i) => (
            <article key={comment.id} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColors[i % avatarColors.length]}`}>
                {initials(comment.author_name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm text-gray-900">{comment.author_name}</p>
                  <time className="text-xs text-gray-400 shrink-0">
                    {new Date(comment.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </time>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{comment.body}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
