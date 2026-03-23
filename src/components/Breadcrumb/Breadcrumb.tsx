import type { ReactNode } from "react";
import styles from "./Breadcrumb.module.css";

export function Breadcrumb({ children, className }: { children: ReactNode; className?: string }) {
  return <nav aria-label="Breadcrumb" className={`${styles.breadcrumb} ${className ?? ""}`}>{children}</nav>;
}

export function BreadcrumbList({ children, className }: { children: ReactNode; className?: string }) {
  return <ol className={`${styles.list} ${className ?? ""}`}>{children}</ol>;
}

export function BreadcrumbItem({ children, className }: { children: ReactNode; className?: string }) {
  return <li className={`${styles.item} ${className ?? ""}`}>{children}</li>;
}

export function BreadcrumbLink({ children, onClick, href, className }: { children: ReactNode; onClick?: () => void; href?: string; className?: string }) {
  return (
    <a
      href={href ?? "#"}
      className={`${styles.link} ${className ?? ""}`}
      onClick={(e) => { e.preventDefault(); onClick?.(); }}
    >
      {children}
    </a>
  );
}

export function BreadcrumbPage({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={`${styles.page} ${className ?? ""}`} aria-current="page">{children}</span>;
}

export function BreadcrumbSeparator({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <li role="presentation" aria-hidden="true" className={`${styles.separator} ${className ?? ""}`}>
      {children ?? (
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M4.5 2.5L7.5 6l-3 3.5" />
        </svg>
      )}
    </li>
  );
}
