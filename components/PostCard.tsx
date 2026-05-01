import Link from "next/link";
import { PostRecord } from "@/types/blog";

type Props = { post: PostRecord; index?: number };

function readTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function PostCard({ post, index = 0 }: Props) {
  const delay = `${index * 60}ms`;

  return (
    <article
      className="group card-hover animate-fade-up flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white"
      style={{ animationDelay: delay }}
    >
      {post.cover_image ? (
        <div className="h-44 overflow-hidden bg-gray-100">
          <img
            src={post.cover_image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="h-44 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center text-4xl">
          📝
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <time>{post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Draft"}</time>
          <span>·</span>
          <span>{readTime(post.content ?? post.excerpt ?? "")} min read</span>
        </div>

        <h2 className="line-clamp-2 text-xl font-bold leading-snug text-gray-900 group-hover:text-purple-600 transition-colors">
          {post.title}
        </h2>

        <p className="line-clamp-2 flex-1 text-sm text-gray-500 leading-relaxed">{post.excerpt}</p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.slug}
                className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-100"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/blog/${post.slug}`}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-purple-600 hover:text-purple-800 transition-all group-hover:gap-2.5"
        >
          Read article
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
