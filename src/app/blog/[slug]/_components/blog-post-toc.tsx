import type { TocItem } from "@/lib/toc";
import { ScrollSpyLink } from "@/components/mdx/scroll-spy";

type TocVariant = "plain" | "scroll-spy";

interface BlogPostTOCProps {
  toc: TocItem[];
  variant?: TocVariant;
}

const BlogPostTOC = ({ toc, variant = "scroll-spy" }: BlogPostTOCProps) => {
  if (toc.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <div className="text-sm/snug font-semibold text-foreground mb-3">On this page</div>
      <ul className="space-y-2">
        {toc.map((item) => (
          <li key={item.id} className={item.depth === 3 ? "ml-3" : ""}>
            {variant === "scroll-spy" ? (
              <ScrollSpyLink value={item.id}>{item.text}</ScrollSpyLink>
            ) : (
              <a
                href={`#${item.id}`}
                className="block text-sm font-semibold text-muted hover:text-foreground duration-200"
              >
                {item.text}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BlogPostTOC;
