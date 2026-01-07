import type { MDXComponents } from "mdx/types";
import { mdxComponents } from "@/components/mdx";

export const useMDXComponents = (components: MDXComponents): MDXComponents => {
  return { ...mdxComponents, ...components };
};


