import { promises as fs } from "fs";
import path from "path";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export type TocItem = { id: string; text: string; depth: number };

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export async function getTocForSlug(slug: string): Promise<TocItem[]> {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  const source = await fs.readFile(filePath, "utf8");

  const tree = unified().use(remarkParse).use(remarkMdx).parse(source);

  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  visit(tree, "heading", (node: unknown) => {
    const asRecord = node as Record<string, unknown>;
    const depth = asRecord.depth;
    if (typeof depth !== "number") return;
    if (depth < 2 || depth > 3) return;

    const text = toString(node as unknown as Parameters<typeof toString>[0]).trim();
    if (!text) return;

    items.push({ depth, text, id: slugger.slug(text) });
  });

  return items;
}


