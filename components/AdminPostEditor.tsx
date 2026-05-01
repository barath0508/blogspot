"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  mode: "create" | "edit";
  initialData?: {
    id?: string;
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    meta_title?: string | null;
    meta_description?: string | null;
    seo_keywords?: string[] | null;
    is_published?: boolean;
  };
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function AdminPostEditor({ mode, initialData }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    excerpt: initialData?.excerpt ?? "",
    content: initialData?.content ?? "",
    meta_title: initialData?.meta_title ?? "",
    meta_description: initialData?.meta_description ?? "",
    seo_keywords: (initialData?.seo_keywords ?? []).join(", "),
    is_published: initialData?.is_published ?? true
  });
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      seo_keywords: form.seo_keywords.split(",").map((k) => k.trim()).filter(Boolean),
      published_at: form.is_published ? new Date().toISOString() : null
    };
    const url = mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${initialData?.id}`;
    const res = await fetch(url, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setSaving(false);
    if (!res.ok) return alert("Unable to save post");
    router.push("/admin");
    router.refresh();
  };

  const inputClass = "input-base";
  const textareaClass = "input-base resize-none";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Title" hint="Keep under 65 chars">
          <input required className={inputClass} placeholder="Post title" value={form.title} onChange={set("title")} />
        </Field>
        <Field label="Slug">
          <input required className={inputClass} placeholder="post-url-slug" value={form.slug} onChange={set("slug")} />
        </Field>
      </div>

      <Field label="Excerpt" hint="Max 180 chars">
        <textarea required className={`${textareaClass} min-h-20`} placeholder="Short summary shown in post cards..." value={form.excerpt} onChange={set("excerpt")} />
      </Field>

      <Field label="Content" hint="Markdown supported">
        <textarea required className={`${textareaClass} min-h-80 font-mono text-sm`} placeholder="Write your post in Markdown..." value={form.content} onChange={set("content")} />
      </Field>

      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-4">
        <p className="text-sm font-semibold text-gray-700">SEO Settings</p>
        <Field label="Meta title" hint={`${form.meta_title.length}/60`}>
          <input className={inputClass} placeholder="Leave blank to auto-generate" value={form.meta_title} onChange={set("meta_title")} maxLength={60} />
        </Field>
        <Field label="Meta description" hint={`${form.meta_description.length}/160`}>
          <textarea className={`${textareaClass} min-h-16`} placeholder="Leave blank to auto-generate" value={form.meta_description} onChange={set("meta_description")} maxLength={160} />
        </Field>
        <Field label="Keywords" hint="Comma separated">
          <input className={inputClass} placeholder="nextjs, supabase, blog" value={form.seo_keywords} onChange={set("seo_keywords")} />
        </Field>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4">
        <label className="flex cursor-pointer items-center gap-3">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={form.is_published}
              onChange={(e) => setForm((prev) => ({ ...prev, is_published: e.target.checked }))}
            />
            <div className={`h-6 w-11 rounded-full transition-colors ${form.is_published ? "bg-indigo-600" : "bg-gray-300"}`} />
            <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.is_published ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {form.is_published ? "Published" : "Save as draft"}
          </span>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-sm shadow-indigo-200"
        >
          {saving ? "Saving..." : mode === "create" ? "Publish post" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
