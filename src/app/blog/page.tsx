import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createMetadata } from "@/utils/metadata";
import { getAllPosts, getBlogCategorySlug, isBlogCategory } from "@/lib/blog";
import { siteUrl } from "@/utils/site-url";
import JsonLd from "@/components/seo/json-ld";
import BlogIndex from "./_components/blog-index";

interface PageProps {
  searchParams?: Promise<{ category?: string }>;
}

export const generateMetadata = async ({
}: PageProps): Promise<Metadata> => {
  return {
    ...createMetadata({
      title: "Blog",
      description:
        "Insights on AI, institutional knowledge, and building better teams. Read the latest from the Sentra team.",
      canonical: "/blog",
    }),
  };
};

export default async function BlogIndexPage({ searchParams }: PageProps) {
  const { category } = (await searchParams) ?? {};

  if (typeof category === "string" && category.length > 0) {
    if (isBlogCategory(category)) {
      redirect(`/blog/category/${getBlogCategorySlug(category)}`);
    }
    redirect("/blog");
  }

  const blogUrl = `${siteUrl}/blog`;

  const posts = await getAllPosts();
  const itemListElements = posts.map((post, index) => {
    const postUrl = `${siteUrl}/blog/${post.slug}`;
    return {
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "BlogPosting",
        "@id": postUrl,
        url: postUrl,
        headline: post.metadata.title,
        description: post.metadata.description,
        datePublished: post.metadata.date,
      },
    };
  });

  const blogCollectionJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${blogUrl}#collection`,
    url: blogUrl,
    name: "Sentra Blog",
    description:
      "Insights on AI, institutional knowledge, and building better teams. Read the latest from the Sentra team.",
    isPartOf: { "@id": `${siteUrl}/#website` },
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: "en",
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: itemListElements.length,
      itemListElement: itemListElements,
    },
  };

  return (
    <>
      <JsonLd id="blog-collection-jsonld" data={blogCollectionJsonLd} />
      <BlogIndex />
    </>
  );
}
