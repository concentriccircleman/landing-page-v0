import type { ComponentType } from "react";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";
import type { TocItem } from "@/lib/toc";
import { ScrollSpy } from "@/components/mdx/scroll-spy";
import BlogPostTOC from "./blog-post-toc";

interface BlogPostProps {
  Post: ComponentType;
  metadata: BlogPostMeta;
  toc: TocItem[];
}

const formatBlogDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const getAuthorLabel = (authors: string[]) => {
  return authors.length === 1 ? "Author" : "Authors";
};

const BlogPost = ({ Post, metadata, toc }: BlogPostProps) => {
  const authors = metadata.authors?.filter((authorName) => authorName.length > 0) ?? [];
  const updatedDate =
    typeof metadata.updated === "string" &&
    metadata.updated.length > 0 &&
    metadata.updated !== metadata.date
      ? metadata.updated
      : null;

  const breadcrumb = (
    <nav aria-label="Breadcrumb" className="text-sm/snug font-medium">
      <ol className="flex items-center gap-1.5">
        <li>
          <Link href="/blog" className="text-muted hover:text-brand duration-200">
            Blog
          </Link>
        </li>
        <li aria-hidden="true" className="text-muted">/</li>
        <li className="text-foreground truncate">{metadata.title}</li>
      </ol>
    </nav>
  );

  const metadataDetails = (
    <div className="space-y-4">
      {metadata.date && (
        <div>
          <div className="text-sm font-semibold text-foreground">Date:</div>
          <div className="mt-1 text-sm font-medium text-muted">
            {formatBlogDate(metadata.date)}
          </div>
        </div>
      )}

      {updatedDate ? (
        <div>
          <div className="text-sm font-semibold text-foreground">Last updated:</div>
          <div className="mt-1 text-sm font-medium text-muted">
            {formatBlogDate(updatedDate)}
          </div>
        </div>
      ) : null}

      {metadata.category && (
        <div>
          <div className="text-sm font-semibold text-foreground">Category:</div>
          <div className="mt-1 text-sm font-medium text-muted">{metadata.category}</div>
        </div>
      )}

      {authors.length > 0 ? (
        <div>
          <div className="text-sm font-semibold text-foreground">
            {getAuthorLabel(authors)}:
          </div>
          <ul className="mt-1 space-y-1">
            {authors.map((authorName) => (
              <li key={authorName} className="text-sm font-medium text-muted">
                {authorName}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );

  return (
    <ScrollSpy asChild orientation="vertical" offset={96}>
      <div className="w-full max-w-screen-2xl mx-auto px-4">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <aside className="hidden lg:block shrink-0 lg:w-48 lg:sticky lg:top-32 self-start">
            <div className="flex flex-col gap-6 lg:flex-col">
              <div className="text-left">
                {metadataDetails}
              </div>

              <div className="text-left">
                <BlogPostTOC toc={toc} variant="scroll-spy" />
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <article className="w-full xl:max-w-3xl xl:mx-auto space-y-6">
              <div className="mb-2">
                {breadcrumb}
              </div>
              <h1 className="text-3xl font-medium text-foreground">
                {metadata.title}
              </h1>
              <div className="lg:hidden space-y-4 p-4 bg-sh-background">
                <div className="text-left">
                  {metadataDetails}
                </div>
                <div className="text-left">
                  <BlogPostTOC toc={toc} variant="plain" />
                </div>
              </div>
              <div className="space-y-3">
                <Post />
              </div>
            </article>
          </div>
          <div className="hidden xl:block xl:w-48 shrink-0" aria-hidden="true" />
        </div>
      </div>
    </ScrollSpy>
  );
};

export default BlogPost;
