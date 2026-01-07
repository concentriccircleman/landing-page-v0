import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import { getTocForSlug } from "@/lib/toc";
import { createMetadata } from "@/utils/metadata";
import { siteUrl } from "@/utils/site-url";
import JsonLd from "@/components/seo/json-ld";
import BlogPost from "./_components/blog-post";
import { promises as fs } from "fs";
import path from "path";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface OpenGraphImageSpec {
  url: string;
  width: number;
  height: number;
  alt: string;
}

const buildOgImageUrl = (slug: string, raw: string | undefined) => {
  if (typeof raw === "string" && raw.length > 0) {
    if (raw.startsWith("http")) return raw;
    if (raw.startsWith("/")) return `${siteUrl}${raw}`;
  }
  return `${siteUrl}/blog/${slug}/opengraph-image`;
};

const doesStaticOgImageExistForSlug = async (slug: string) => {
  try {
    await fs.access(
      path.join(process.cwd(), "public", "blog", slug, "opengraph-image.png")
    );
    return true;
  } catch {
    return false;
  }
};

const resolveOgImageUrl = async (slug: string, raw: string | undefined) => {
  const explicitOgImageUrl = buildOgImageUrl(slug, raw);
  if (explicitOgImageUrl !== `${siteUrl}/blog/${slug}/opengraph-image`) {
    return explicitOgImageUrl;
  }

  const staticOgImageUrl = `${siteUrl}/blog/${slug}/opengraph-image.png`;
  const doesStaticOgImageExist = await doesStaticOgImageExistForSlug(slug);
  return doesStaticOgImageExist ? staticOgImageUrl : explicitOgImageUrl;
};

const parseBlogDateToIsoString = (value: string | undefined) => {
  if (!value) return undefined;
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return undefined;
  return parsedDate.toISOString();
};

export const generateStaticParams = async () => {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
};

export const dynamicParams = false;

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const canonical = `/blog/${slug}`;
  const ogImageUrl = await resolveOgImageUrl(slug, post.metadata.ogImage);
  const ogImage: OpenGraphImageSpec = {
    url: ogImageUrl,
    width: 1200,
    height: 630,
    alt: post.metadata.title.length > 0 ? post.metadata.title : "Sentra",
  };

  const baseMetadata = createMetadata({
    title: post.metadata.title,
    description: post.metadata.description,
    canonical,
  });

  const publishedTime = parseBlogDateToIsoString(post.metadata.date);
  const modifiedTime = parseBlogDateToIsoString(
    post.metadata.updated ?? post.metadata.date
  );

  const tags = post.metadata.category ? [post.metadata.category] : undefined;
  const authors =
    post.metadata.authors && post.metadata.authors.length > 0
      ? post.metadata.authors
      : undefined;

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      type: "article",
      url: `${siteUrl}${canonical}`,
      images: [ogImage],
      publishedTime,
      modifiedTime,
      authors,
      tags,
    },
    twitter: {
      ...baseMetadata.twitter,
      images: [ogImageUrl],
    },
  };
};

const BlogPostPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const toc = await getTocForSlug(slug);
  const canonicalPath = `/blog/${slug}`;

  const publishedTime = parseBlogDateToIsoString(post.metadata.date);
  const modifiedTime = parseBlogDateToIsoString(
    post.metadata.updated ?? post.metadata.date
  );

  const authors =
    post.metadata.authors && post.metadata.authors.length > 0
      ? post.metadata.authors
      : undefined;

  const ogImageUrl = await resolveOgImageUrl(slug, post.metadata.ogImage);

  const blogPostingJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metadata.title,
    description: post.metadata.description,
    datePublished: publishedTime,
    dateModified: modifiedTime ?? publishedTime,
    url: `${siteUrl}${canonicalPath}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}${canonicalPath}`,
    },
    image: [ogImageUrl],
    author: authors
      ? authors.map((authorName) => ({
          "@type": "Person",
          name: authorName,
        }))
      : {
          "@type": "Organization",
          name: "Sentra",
          url: siteUrl,
        },
    publisher: {
      "@type": "Organization",
      name: "Sentra",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/sentra.png`,
      },
    },
  };

  const breadcrumbJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.metadata.title,
        item: `${siteUrl}${canonicalPath}`,
      },
    ],
  };

  return (
    <>
      <JsonLd id={`blog-posting-${slug}`} data={blogPostingJsonLd} />
      <JsonLd id={`breadcrumb-${slug}`} data={breadcrumbJsonLd} />
      <BlogPost Post={post.Post} metadata={post.metadata} toc={toc} />
    </>
  );
};

export default BlogPostPage;
