import Link from "next/link";
import Image from "next/image";
import { PostRecord } from "@/types/blog";

type Props = { post: PostRecord; index?: number; featured?: boolean };

function readTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function PostCard({ post, index = 0, featured = false }: Props) {
  const delay = `${index * 60}ms`;
  const time = readTime(post.content ?? post.excerpt ?? "");
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Draft";
  const isoDate = post.published_at ?? post.created_at;
  const category = post.categories?.[0];

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="featured-card group block" style={{ animationDelay: "0ms" }}>
        <span className="featured-badge">⚡ Featured</span>
        <div className="relative overflow-hidden bg-gray-100">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              unoptimized
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex items-center justify-center text-6xl">📝</div>
          )}
        </div>
        <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
          {category && (
            <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-100">
              {category.name}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-3">
            {post.title}
          </h2>
          <p className="text-base text-gray-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <time dateTime={isoDate}>{dateStr}</time>
            <span>·</span>
            <span>{time} min read</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-600 group-hover:gap-3 transition-all">
            Read article
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group card-hover animate-fade-up flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white"
      style={{ animationDelay: delay }}
    >
      <div className="relative h-44 overflow-hidden bg-gray-100">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center text-4xl">📝</div>
        )}
        {category && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-bold text-indigo-700 shadow-sm border border-indigo-100">
            {category.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <time dateTime={isoDate}>{dateStr}</time>
          <span>·</span>
          <span>{time} min read</span>
        </div>

        <h2 className="line-clamp-2 text-lg font-bold leading-snug text-gray-900 group-hover:text-purple-600 transition-colors">
          {post.title}
        </h2>

        <p className="line-clamp-2 flex-1 text-sm text-gray-500 leading-relaxed">{post.excerpt}</p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.slug}
                className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-100"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-purple-600 group-hover:gap-2.5 transition-all">
          Read article
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
