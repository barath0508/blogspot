create extension if not exists "pgcrypto";

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  meta_title text,
  meta_description text,
  seo_keywords text[] not null default '{}',
  cover_image text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table posts add column if not exists meta_title text;
alter table posts add column if not exists meta_description text;
alter table posts add column if not exists seo_keywords text[] not null default '{}';

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table if not exists post_categories (
  post_id uuid not null references posts(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  primary key (post_id, category_id)
);

create table if not exists post_tags (
  post_id uuid not null references posts(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_name text not null,
  body text not null,
  is_approved boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  visitor_id text not null,
  created_at timestamptz not null default now(),
  unique (post_id, visitor_id)
);

create index if not exists idx_posts_slug on posts(slug);
create index if not exists idx_posts_published on posts(is_published, published_at desc);
create index if not exists idx_post_categories_category on post_categories(category_id);
create index if not exists idx_post_tags_tag on post_tags(tag_id);
create index if not exists idx_comments_post on comments(post_id, created_at desc);
create index if not exists idx_post_likes_post on post_likes(post_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_posts_updated_at on posts;
create trigger trg_posts_updated_at
before update on posts
for each row
execute function set_updated_at();

alter table posts enable row level security;
alter table categories enable row level security;
alter table tags enable row level security;
alter table comments enable row level security;
alter table post_likes enable row level security;

drop policy if exists "Public can read published posts" on posts;
create policy "Public can read published posts"
on posts for select
using (is_published = true);

drop policy if exists "Public can read categories" on categories;
create policy "Public can read categories"
on categories for select
using (true);

drop policy if exists "Public can read tags" on tags;
create policy "Public can read tags"
on tags for select
using (true);

drop policy if exists "Public can read approved comments" on comments;
create policy "Public can read approved comments"
on comments for select
using (is_approved = true);

drop policy if exists "Public can insert comments" on comments;
create policy "Public can insert comments"
on comments for insert
with check (char_length(author_name) > 1 and char_length(body) > 1);

drop policy if exists "Public can read likes" on post_likes;
create policy "Public can read likes"
on post_likes for select
using (true);

drop policy if exists "Public can insert likes" on post_likes;
create policy "Public can insert likes"
on post_likes for insert
with check (char_length(visitor_id) > 5);
