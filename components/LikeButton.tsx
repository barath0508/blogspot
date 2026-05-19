"use client";

import { useEffect, useMemo, useState } from "react";

type Props = { slug: string; initialLikes: number };

function createVisitorId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function LikeButton({ slug, initialLikes }: Props) {
  const storageKey = useMemo(() => `blog-visitor-id`, []);
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [visitorId, setVisitorId] = useState("");

  useEffect(() => {
    let id = localStorage.getItem(storageKey);
    if (!id) { id = createVisitorId(); localStorage.setItem(storageKey, id); }
    setVisitorId(id);
    fetch(`/api/posts/${slug}/likes?visitorId=${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((d) => { setLikes(d.likes ?? initialLikes); setLiked(Boolean(d.liked)); })
      .catch(() => null);
  }, [slug, storageKey, initialLikes]);

  const onLike = async () => {
    if (!visitorId || busy || liked) return;
    setBusy(true);
    const res = await fetch(`/api/posts/${slug}/likes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId })
    });
    setBusy(false);
    if (!res.ok) return;
    const d = await res.json();
    setLikes(d.likes ?? likes + 1);
    setLiked(true);
  };

  return (
    <button
      onClick={onLike}
      disabled={busy || liked}
      aria-label={liked ? `Liked — ${likes} likes` : `Like this article — ${likes} likes`}
      title={liked ? `Liked — ${likes} likes` : `Like this article — ${likes} likes`}
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
        liked
          ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-400 cursor-default"
          : "border-border bg-surface text-muted hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:hover:border-rose-900 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
      } disabled:opacity-70`}
    >
      <svg
        className={`h-4 w-4 transition-transform duration-200 ${liked ? "scale-125" : ""}`}
        fill={liked ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
      {liked ? `Liked · ${likes}` : `Like · ${likes}`}
    </button>
  );
}
