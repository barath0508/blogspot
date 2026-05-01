# Next.js SEO Blog with Supabase

Production-ready starter for a dynamic blog using Next.js App Router, Tailwind CSS, Supabase, and NextAuth.

## Access Model

- Only admin can create, update, or delete blog posts (dashboard + protected APIs).
- Readers can browse posts, like posts, and add comments.

## Folder Structure

```txt
.
├── app
│   ├── admin
│   │   ├── edit/[id]/page.tsx
│   │   ├── new/page.tsx
│   │   └── page.tsx
│   ├── api
│   │   ├── admin/posts/[id]/route.ts
│   │   ├── admin/posts/route.ts
│   │   └── auth/[...nextauth]/route.ts
│   ├── blog/[slug]/page.tsx
│   ├── login/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── AdminPostEditor.tsx
│   ├── DeletePostButton.tsx
│   ├── FilterBar.tsx
│   └── PostCard.tsx
├── lib
│   ├── auth.ts
│   ├── posts.ts
│   └── supabase.ts
├── supabase
│   └── schema.sql
├── types
│   └── blog.ts
└── middleware.ts
```

## Run locally

1. Copy `.env.example` to `.env.local`.
2. Run SQL from `supabase/schema.sql` in Supabase SQL editor.
3. Install dependencies and run:
   - `npm install`
   - `npm run dev`

## Automated AI Publishing (Every 30 Minutes)

This project includes an auto-publish workflow:

- Fetches a trending topic (Google Trends RSS).
- Generates SEO article content using Gemini API.
- Generates SEO metadata (`meta_title`, `meta_description`, `seo_keywords`) using Gemini API.
- Creates a free hero image URL using Pollinations image API.
- Auto-injects internal links to recent published posts.
- Publishes the post to Supabase and auto-links category/tags.

### Required env vars

- `GEMINI_API_KEY`
- `GEMINI_MODEL` (optional, default fallback chain is used if not set)
- `AUTOMATION_CRON_SECRET`
- `TRENDS_GEO` (optional, default `US`)

### Scheduled route

- API route: `/api/automation/publish`
- Auth: `Authorization: Bearer <AUTOMATION_CRON_SECRET>` (or `x-cron-secret`)
- `vercel.json` is configured to run every 30 minutes:
  - `*/30 * * * *`

### Test manually

```bash
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/automation/publish
```
