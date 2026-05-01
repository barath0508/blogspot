import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CommentsSection } from "@/components/CommentsSection";
import { LikeButton } from "@/components/LikeButton";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/posts";
import { getSupabase } from "@/lib/supabase";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/$/, "");
const SITE_NAME = "Minimal Blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.cover_image ?? undefined;
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.seo_keywords,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    alternates: { canonical: url },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at ?? undefined,
      tags: post.seo_keywords,
      images: image ? [{ url: image, alt: post.title, width: 1600, height: 900 }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: image ? [image] : undefined
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return notFound();

  const supabase = getSupabase();
  const [{ data: comments }, { count }] = await Promise.all([
    supabase
      .from("comments")
      .select("id,author_name,body,created_at")
      .eq("post_id", post.id)
      .eq("is_approved", true)
      .order("created_at", { ascending: false }),
    supabase.from("post_likes").select("id", { head: true, count: "exact" }).eq("post_id", post.id)
  ]);

  const wordCount = (post.content ?? "").trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));
  const postUrl = `${SITE_URL}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    image: post.cover_image ?? undefined,
    url: postUrl,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at ?? post.published_at ?? post.created_at,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    keywords: post.seo_keywords.join(", "),
    wordCount,
    timeRequired: `PT${readTime}M`
  };

  return (
    <div className="animate-fade-up">
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to all posts
        </Link>
      </div>

      <article className="mx-auto max-w-3xl">
        <header className="mb-8 space-y-4">
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 4).map((tag) => (
                <span key={tag.slug} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-3 border-t border-b border-gray-100 py-3 text-sm text-gray-400">
            <time className="font-medium text-gray-600">
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                : "Draft"}
            </time>
            <span>·</span>
            <span>{readTime} min read</span>
            <span>·</span>
            <span>{wordCount.toLocaleString()} words</span>
          </div>
        </header>

        {post.cover_image && (
          <div className="mb-10 overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            <img src={post.cover_image} alt={post.title} className="h-auto w-full object-cover" />
          </div>
        )}

        <section className="prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt ?? ""}
                  className="rounded-2xl w-full my-6 border border-gray-100 shadow-sm"
                  loading="lazy"
                />
              )
            }}
          >
            {post.content}
          </ReactMarkdown>
        </section>

        <div className="mt-10 flex items-center gap-4 border-t border-gray-100 pt-8">
          <LikeButton slug={post.slug} initialLikes={count ?? 0} />
          <Link
            href="/"
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            ← More articles
          </Link>
        </div>

        <CommentsSection slug={post.slug} initialComments={comments ?? []} />
      </article>
    </div>
  );
}
