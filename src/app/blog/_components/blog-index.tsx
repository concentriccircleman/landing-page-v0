import Link from "next/link";
import {
  BLOG_FILTER_CATEGORIES,
  getAllPosts,
  getBlogCategorySlug,
  isBlogCategory,
} from "@/lib/blog";

interface BlogIndexProps {
  category?: string;
};

const formatBlogDate = (value: string) => {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
};

const BlogIndex = async ({ category }: BlogIndexProps) => {
  const posts = await getAllPosts();
  const selectedCategory = isBlogCategory(category) ? category : undefined;
  const filteredPosts = selectedCategory
    ? posts.filter((p) => p.metadata.category === selectedCategory)
    : posts;

  return (
    <div className="w-full px-4">
      <h1 className="text-3xl/snug font-medium tracking-tight text-foreground">
        Blog
        <sup className="ml-0.5 align-super text-lg font-medium leading-none">
          {filteredPosts.length}
        </sup>
      </h1>

      <div className="mt-6 space-y-10 md:relative">
        <nav aria-label="Blog filters" className="md:absolute md:left-0 md:top-0">
          <ul className="space-y-2">
            {BLOG_FILTER_CATEGORIES.map((c) => (
              <li key={c}>
                <Link
                  href={
                    c === "All" || !isBlogCategory(c)
                      ? "/blog"
                      : `/blog/category/${getBlogCategorySlug(c)}`
                  }
                  aria-current={selectedCategory === c ? "page" : undefined}
                  className={
                    selectedCategory === c
                      ? "block text-sm font-semibold text-foreground"
                      : "block text-sm font-semibold text-muted hover:text-foreground duration-200"
                  }
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="max-w-3xl mx-auto">
          <ul className="space-y-6">
            {filteredPosts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="block px-3 py-3 hover:bg-foreground/5 duration-200 md:-mx-3"
                >
                  <div className="text-lg font-medium text-foreground">
                    {p.metadata.title}
                  </div>
                  {p.metadata.description ? (
                    <p className="mt-1 text-sm text-foreground/70">
                      {p.metadata.description}
                    </p>
                  ) : null}
                  {p.metadata.category || p.metadata.date ? (
                    <div className="mt-2 text-sm text-muted">
                      {p.metadata.category ? (
                        <span>{p.metadata.category}</span>
                      ) : null}
                      {p.metadata.category && p.metadata.date ? (
                        <span aria-hidden="true"> · </span>
                      ) : null}
                      {p.metadata.date ? (
                        <span>{formatBlogDate(p.metadata.date)}</span>
                      ) : null}
                    </div>
                  ) : null}
                </Link>
              </li>
            ))}

            {selectedCategory && filteredPosts.length === 0 ? (
              <li>
                <p className="text-sm text-foreground/70">
                  No posts in {selectedCategory}.
                </p>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BlogIndex;
