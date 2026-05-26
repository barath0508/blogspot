"use client";

import { useState } from "react";
import type { CommentRecord } from "@/types/engagement";

type Props = { slug: string; initialComments: CommentRecord[] };

const COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function CommentsSection({ slug, initialComments }: Props) {
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setBusy(true);
    const res = await fetch(`/api/posts/${slug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorName: name.trim(), body: body.trim() }),
    });
    setBusy(false);
    if (!res.ok) return alert("Unable to post comment");
    setName("");
    setBody("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <section className="space-y-6 border-t border-border pt-10" aria-label="Comments">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">
          {comments.length > 0 ? `${comments.length} Comment${comments.length !== 1 ? "s" : ""}` : "Discussion"}
        </h2>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-surface">
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            required
            className="input-base"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Your name"
          />
          <input
            className="input-base"
            placeholder="Email (optional, not shown)"
            type="email"
            aria-label="Email address"
          />
        </div>
        <textarea
          required
          className="input-base min-h-[96px] resize-none"
          placeholder="Share your thoughts..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          aria-label="Comment"
        />
        <div className="flex items-center gap-3">
          <button type="submit" disabled={busy} className="btn btn-primary text-sm px-5 py-2">
            {busy ? "Posting..." : "Post comment"}
          </button>
          {success && (
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium animate-fade-in">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Submitted for moderation!
            </span>
          )}
        </div>
      </form>

      {/* List */}
      {comments.length > 0 && (
        <div className="flex flex-col divide-y divide-border">
          {comments.map((c, i) => (
            <article key={c.id} className="flex gap-4 py-5">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${COLORS[i % COLORS.length]}`}>
                {initials(c.author_name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <p className="text-sm font-semibold text-foreground">{c.author_name}</p>
                  <time className="text-xs text-muted-2 shrink-0">
                    {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </time>
                </div>
                <p className="text-sm text-muted leading-relaxed">{c.body}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
