export type PostRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  seo_keywords: string[];
  cover_image: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  categories: { slug: string; name: string }[];
  tags: { slug: string; name: string }[];
};
