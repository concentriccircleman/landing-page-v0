declare module "*.mdx" {
  import type { ComponentType } from "react";

  const MDXComponent: ComponentType<Record<string, unknown>>;
  export default MDXComponent;

  export const metadata: {
    title: string;
    description?: string;
    date?: string;
    category?: "Research" | "Product" | "Company" | "News";
  };
}


