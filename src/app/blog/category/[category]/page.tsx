import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/json-ld";
import {
  getAllPosts,
  getBlogCategoryFromSlug,
  getBlogCategorySlug,
} from "@/lib/blog";
import { siteUrl } from "@/utils/site-url";
import { createMetadata } from "@/utils/metadata";
import BlogIndex from "../../_components/blog-index";

interface PageProps {
  params: Promise<{ category: string }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { category: categorySlug } = await params;
  const category = getBlogCategoryFromSlug(categorySlug);

  if (!category) {
    return {
      ...createMetadata({ title: "Blog", canonical: "/blog" }),
      robots: { index: false, follow: false },
    };
  }

  const normalizedCategorySlug = getBlogCategorySlug(category);

  return createMetadata({
    title: `Blog: ${category}`,
    description: `Posts about ${category} from the Sentra team.`,
    canonical: `/blog/category/${normalizedCategorySlug}`,
  });
};

const BlogCategoryPage = async ({ params }: PageProps) => {
  const { category: categorySlug } = await params;
  const category = getBlogCategoryFromSlug(categorySlug);
  if (!category) notFound();

  const normalizedCategorySlug = getBlogCategorySlug(category);
  const blogUrl = `${siteUrl}/blog/category/${normalizedCategorySlug}`;

  const posts = await getAllPosts();
  const filteredPosts = posts.filter((post) => post.metadata.category === category);

  const itemListElements = filteredPosts.map((post, index) => {
    const postUrl = `${siteUrl}/blog/${post.slug}`;
    const shouldIncludeDateModified =
      typeof post.metadata.updated === "string" &&
      post.metadata.updated.length > 0 &&
      post.metadata.updated !== post.metadata.date;

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
        ...(shouldIncludeDateModified
          ? { dateModified: post.metadata.updated }
          : {}),
      },
    };
  });

  const blogCollectionJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${blogUrl}#collection`,
    url: blogUrl,
    name: `Sentra Blog: ${category}`,
    description: `Posts about ${category} from the Sentra team.`,
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
      <JsonLd
        id={`blog-collection-category-${normalizedCategorySlug}`}
        data={blogCollectionJsonLd}
      />
      <BlogIndex category={category} />
    </>
  );
};

export default BlogCategoryPage;


