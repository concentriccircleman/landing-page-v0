import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
}

/**
 * Reusable section wrapper for consistent page layout.
 * Provides max-width constraint, horizontal padding, and centering.
 *
 * Vertical spacing between sections is handled by the parent Layout.
 */
export default function Section({
  children,
  className = "",
  as: Component = "section",
}: SectionProps) {
  return (
    <Component
      className={`max-w-screen-4xl mx-auto w-full px-4 ${className}`.trim()}
    >
      {children}
    </Component>
  );
}
