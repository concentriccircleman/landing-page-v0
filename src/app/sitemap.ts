import type { MetadataRoute } from "next";
import {
  BLOG_POST_CATEGORIES,
  getAllPosts,
  getBlogCategorySlug,
} from "@/lib/blog";
import { siteUrl } from "@/utils/site-url";

export const baseUrl = siteUrl;

const parseIsoDateToUtcDate = (value: string | undefined) => {
  if (!value) return undefined;
  const parsedDate = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.getTime())) return undefined;
  return parsedDate;
};

const staticRouteLastModifiedByPath: Record<string, string> = {
  "/": "2026-01-06",
  "/about": "2026-01-06",
  "/data-privacy": "2026-01-06",
  "/manifesto": "2026-01-06",
  "/terms": "2026-01-06",
  "/privacy": "2026-01-06",
  "/blog": "2026-01-06",
};

const getStaticRouteLastModified = (path: string) => {
  return parseIsoDateToUtcDate(staticRouteLastModifiedByPath[path]);
};

const getPostLastModified = (post: { metadata: { updated?: string; date?: string } }) => {
  return parseIsoDateToUtcDate(post.metadata.updated ?? post.metadata.date);
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const categoryLastModifiedBySlug: Record<string, Date> = {};

  for (const post of posts) {
    if (!post.metadata.category) continue;
    const lastModified = getPostLastModified(post);
    if (!lastModified) continue;
    const categorySlug = getBlogCategorySlug(post.metadata.category);
    const currentLastModified = categoryLastModifiedBySlug[categorySlug];
    if (!currentLastModified || lastModified > currentLastModified) {
      categoryLastModifiedBySlug[categorySlug] = lastModified;
    }
  }

  const routes: MetadataRoute.Sitemap = Object.keys(
    staticRouteLastModifiedByPath
  ).map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: getStaticRouteLastModified(path),
  }));

  const categoryRoutes: MetadataRoute.Sitemap = BLOG_POST_CATEGORIES.map(
    (category) => {
      const categorySlug = getBlogCategorySlug(category);
      return {
        url: `${baseUrl}/blog/category/${categorySlug}`,
        lastModified: categoryLastModifiedBySlug[categorySlug],
      };
    }
  );

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: getPostLastModified(post),
  }));

  return [...routes, ...categoryRoutes, ...postRoutes];
}
