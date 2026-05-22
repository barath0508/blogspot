# Trendly - Next.js AI-Powered SEO Blog with Supabase

Trendly is a high-performance, production-ready, AI-driven technology publication and blog built using the **Next.js App Router**, **Supabase (PostgreSQL)**, **Tailwind CSS**, and **NextAuth.js**. 

The system operates autonomously to identify search trends, write high-quality, authoritative articles via the Google Gemini API, inject images, structure schema markup, and optimize indexing across Bing and Google.

---

## Key Tech Stack
- **Framework:** Next.js (App Router, Server Components)
- **Styling:** Tailwind CSS (Harmonious Teal/Purple accent palette, dark & light mode glassmorphism)
- **Database / Backend:** Supabase (PostgreSQL with Row Level Security, Indexes, Triggers, and Defined Functions)
- **Authentication:** NextAuth.js (secure admin access)
- **AI Processing:** Google Gemini API (utilizing model fallback chains: `gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-flash-latest`)
- **Images:** Pollinations AI (Flux model) for photorealistic cover and context-section images
- **Deployment:** Vercel

---

## Comprehensive Feature List

### 1. Automated AI Publishing & Curation (Every 6 Hours)
- **Trend Detection:** Periodically monitors Google Trends RSS to identify high-signal technology, AI, and digital topics.
- **AI Writing & E-E-A-T Formatting:** Uses Gemini API with advanced, anti-clickbait prompt guidelines to construct authoritative, comprehensive articles (800–1200 words).
- **Structure Optimization:** Starts each post with a blockquoted **"Key Takeaways" / "Executive Summary"** box and uses semantic H2/H3 heading hierarchies in a Q&A style for maximum utility to human readers and AI crawlers alike.
- **Dynamic Images:** Generates custom, photorealistic cover images (1600x900) and multi-section inline images (1200x630) using the Pollinations Flux API based on contextual keyword extraction.
- **Auto-linking:** Integrates internal back-references linking the generated post to the last 3 published posts to improve crawler indexing.

### 2. Technical SEO & AI Search Optimizations (SGE/Perplexity/ChatGPT)
- **Canonical URLs:** Uses canonical links on all post pages to resolve duplicate routing issues.
- **Rich Meta Tags:** Features OpenGraph (OG) and Twitter Card tags per page with dynamically rendered title tags, benefit-focused descriptions, and custom OG images.
- **Structured Schema (JSON-LD):** Out-of-the-box support for `Article`, `BlogPosting`, and `BreadcrumbList` schema templates to feed structured data directly to search engine graphs.
- **Dynamic Sitemap:** Generates a real-time `/sitemap.xml` with automatic revalidation every 5 minutes (300 seconds), containing no 404s or tag-spam.
- **Google News Sitemap:** Serves a dedicated `/google-news-sitemap.xml` listing the 100 latest posts.
- **RSS Feed:** Dynamic `/feed.xml` serving the 50 latest full articles.
- **Instant Engine Pings (IndexNow):** Automatically pings the IndexNow protocol (IndexNow API, Bing, Yandex, Seznam) instantly upon publishing a new post.

### 3. Interactive Reader Experience
- **Saved Articles (Bookmarks):** Enables users to save their favorite posts to an offline reading list, persisted across browser sessions via `localStorage`.
- **Likes System:** An interactive, single-click post-like counter powered by a secure Supabase insertion query (preventing duplication via visitor IDs).
- **Comments Section:** Readers can post names and feedback on individual articles. Supports real-time db insertion.
- **Search & Filters:** Real-time Client/Server search using search queries, categories, and tag filtering.
- **Newsletter Subscription:** Sign-up widget connected to a database `subscribers` table for reader list acquisition.
- **Dark Mode Support:** Fully integrated dark/light theme switcher powered by `next-themes`.
- **Privacy & Compliance:** Includes a cookie consent banner, plus ready-made compliance pages: Privacy Policy, Terms of Service, Disclaimer, and Cookie Policy.

### 4. Admin Portal & Operations
- **Dashboard (/admin):** Protected overview displaying draft states, publication dates, and quick action commands.
- **Post Editor (/admin/new & /admin/edit/[id]):** Secure markdown content manager.
- **Comment Moderator (/admin/comments):** Review, approve, or delete reader comments.
- **Live Sync Indicators:** Animated database stats cards utilizing an Intersection Observer with client-side timeout fallback to ensure counters ("Articles", "Topics", "Reads") load instantly.

---

## Folder Structure

```txt
.
├── app
│   ├── about                # About Us page detailing publishing methodology
│   ├── admin                # Admin Dashboard, Editor, and Comment Moderator
│   ├── api                  # Next.js API Routes (Posts, Comments, Likes, Newsletter, Automation)
│   ├── blog                 # Blog post detailed view ([slug]) with dynamic metadata
│   ├── categories           # Topic/Category catalog page
│   ├── category             # Category detail listings
│   ├── contact              # Contact page
│   ├── saved                # Saved bookmark listing page
│   ├── tag                  # Tag detail listings
│   ├── tags                 # Tag catalog page
│   ├── feed.xml             # Dynamic RSS feed endpoint
│   ├── google-news-sitemap  # Google News sitemap endpoint
│   ├── sitemap              # Standard sitemap.xml route
│   ├── globals.css          # Tailwind base and glassmorphic designs
│   ├── layout.tsx           # Global provider setups (Theme, Auth, Cookie Banner)
│   └── page.tsx             # Interactive homepage layout (Featured Post, Search, Stats)
├── components               # Reusable UI components (StatsCounter, ShareButtons, etc.)
├── lib                      # Helper modules (auth, posts, Supabase, SEO, automation)
├── supabase                 # SQL migrations and database schema setup
├── types                    # TypeScript interfaces
├── middleware.ts            # Protects /admin routes
└── vercel.json              # Vercel Cron Job configuration (runs every 6 hours)
```

---

## Database Architecture (Supabase / PostgreSQL)

Run the SQL migration in `supabase/schema.sql` to initialize:
- **`posts`**: Core articles table holding content, excerpts, and view metrics.
- **`categories`** / **`tags`**: Classifications.
- **`post_categories`** / **`post_tags`**: Many-to-many relationship tables.
- **`comments`**: User feedbacks (Row-level security enforces character limits).
- **`post_likes`**: Tracks likes mapped to a unique `(post_id, visitor_id)` key.
- **`subscribers`**: Newsletter email collector.
- **Stored Procedure (`increment_view_count`)**: Increments read counts securely.

---

## Setup & Local Development

### 1. Prerequisites
- Node.js 18+ and npm
- A Supabase Project
- A Google Gemini API Key

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Auth (NextAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-character-nextauth-secret
ADMIN_PASSWORD=your-secure-admin-password

# AI Automation
GEMINI_API_KEYS=your-gemini-api-key-1,your-gemini-api-key-2
GEMINI_MODEL=gemini-2.5-flash
AUTOMATION_CRON_SECRET=your-cron-secret-token
TRENDS_GEO=IN

# SEO
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Local Commands
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run production build
npm run build
```

---

## Automated Cron Configuration

The publishing automation is triggered by Vercel Cron Jobs. It is defined in [vercel.json](file:///e:/Blog/vercel.json) to trigger the publish endpoint once every 6 hours (matching 4 posts daily):

```json
{
  "crons": [
    {
      "path": "/api/automation/publish",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### Manually trigger publication:
```bash
curl -H "Authorization: Bearer <AUTOMATION_CRON_SECRET>" http://localhost:3000/api/automation/publish
```
