import { promises as fs } from "fs";
import path from "path";
import type { ComponentType } from "react";

export const BLOG_POST_CATEGORIES = [
  "Research",
  "Product",
  "Company",
  "News",
] as const;
export type BlogCategory = (typeof BLOG_POST_CATEGORIES)[number];

export const BLOG_FILTER_CATEGORIES = ["All", ...BLOG_POST_CATEGORIES] as const;
export type BlogFilterCategory = (typeof BLOG_FILTER_CATEGORIES)[number];

export const isBlogCategory = (value: unknown): value is BlogCategory => {
  return (
    typeof value === "string" &&
    (BLOG_POST_CATEGORIES as readonly string[]).includes(value)
  );
};

export const getBlogCategorySlug = (category: BlogCategory) => {
  return category
    .trim()
    .toLowerCase()
    .replaceAll("&", "and")
    .replaceAll(" ", "-")
    .replace(/[^a-z0-9-]/g, "");
};

export const getBlogCategoryFromSlug = (value: unknown): BlogCategory | null => {
  if (typeof value !== "string" || value.length === 0) return null;
  const matchedCategory = BLOG_POST_CATEGORIES.find(
    (category) => getBlogCategorySlug(category) === value
  );
  return matchedCategory ?? null;
};

export interface BlogPostMeta {
  title: string;
  description?: string;
  date?: string;
  updated?: string;
  category?: BlogCategory;
  authors?: string[];
  ogImage?: string;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const normalizeBlogPostAuthors = (raw: unknown): string[] | undefined => {
  if (typeof raw === "string" && raw.trim().length > 0) return [raw.trim()];

  if (Array.isArray(raw)) {
    const authors = raw
      .filter((entry) => typeof entry === "string")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);

    return authors.length > 0 ? authors : undefined;
  }

  return undefined;
};

const normalizeBlogPostMeta = (raw: unknown): BlogPostMeta => {
  const meta = (raw ?? {}) as Record<string, unknown>;
  const authors = normalizeBlogPostAuthors(meta.authors ?? meta.author);
  return {
    title: typeof meta.title === "string" ? meta.title : "",
    description:
      typeof meta.description === "string" ? meta.description : undefined,
    date: typeof meta.date === "string" ? meta.date : undefined,
    updated: typeof meta.updated === "string" ? meta.updated : undefined,
    category: isBlogCategory(meta.category) ? meta.category : undefined,
    authors,
    ogImage: typeof meta.ogImage === "string" ? meta.ogImage : undefined,
  };
};

export const getPostSlugs = async (): Promise<string[]> => {
  const entries = await fs.readdir(BLOG_DIR);
  return entries
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => name.replace(/\.mdx$/, ""));
};

export const getPostBySlug = async (slug: string): Promise<{
  slug: string;
  metadata: BlogPostMeta;
  Post: ComponentType<Record<string, unknown>>;
} | null> => {
  try {
    const mod = await import(`@content/blog/${slug}.mdx`);
    return {
      slug,
      metadata: normalizeBlogPostMeta(mod.metadata),
      Post: mod.default as ComponentType<Record<string, unknown>>,
    };
  } catch {
    return null;
  }
};

export const getAllPosts = async (): Promise<
  { slug: string; metadata: BlogPostMeta }[]
> => {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const mod = await import(`@content/blog/${slug}.mdx`);
      return { slug, metadata: normalizeBlogPostMeta(mod.metadata) };
    })
  );

  posts.sort((a, b) =>
    (b.metadata.date ?? "").localeCompare(a.metadata.date ?? "")
  );
  return posts;
};


