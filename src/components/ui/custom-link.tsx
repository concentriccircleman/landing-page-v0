import Link from "next/link";
import { ReactNode } from "react";

interface CustomLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export default function CustomLink({
  href,
  children,
  className = "",
  target,
  rel,
  ...props
}: CustomLinkProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");

  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel={rel || "noopener noreferrer"}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      target={target}
      rel={rel}
      {...props}
    >
      {children}
    </Link>
  );
}
