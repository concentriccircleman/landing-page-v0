import type { ReactNode } from "react";
import styles from "./EmptyState.module.css";

/* ─── Types ─── */

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export interface EmptyStateProps {
  /** @deprecated No longer needed — component auto-adapts to theme via tokens */
  variant?: "light" | "dark";
  /** Custom icon to render in the circle. Falls back to a default document icon. */
  icon?: ReactNode;
  /** Heading text */
  title?: string;
  /** Descriptive text below the heading */
  description?: string;
  /** Up to two action buttons */
  actions?: EmptyStateAction[];
  /** Optional CSS class for the root element */
  className?: string;
}

/* ─── Default icon ─── */

function DefaultIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="2" width="10" height="12" rx="1" />
      <path d="M6 5h4M6 8h4M6 11h2" />
    </svg>
  );
}

/* ─── Component ─── */

export function EmptyState({
  icon,
  title = "No records yet",
  description = "This may change over time, so check back later.",
  actions,
  className,
}: EmptyStateProps) {
  const rootClass = [styles.container, className].filter(Boolean).join(" ");

  return (
    <div className={rootClass}>
      {/* Icon */}
      <div className={styles.iconWrapper}>
        <div className={styles.iconInner}>{icon ?? <DefaultIcon />}</div>
      </div>

      {/* Text */}
      <div className={styles.textGroup}>
        {title && <p className={styles.title}>{title}</p>}
        {description && <p className={styles.description}>{description}</p>}
      </div>

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className={styles.actions}>
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={
                action.variant === "secondary"
                  ? styles.buttonSecondary
                  : styles.buttonPrimary
              }
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
