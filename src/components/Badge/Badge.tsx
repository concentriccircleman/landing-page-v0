import React from "react";
import styles from "./Badge.module.css";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "outline";

export type BadgeSize = "default" | "sm";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  onDismiss?: () => void;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", size = "default", onDismiss, children, className, ...props }, ref) => {
    const variantClass = styles[variant] || styles.default;
    const sizeClass = size === "sm" ? styles.sizeSm : "";

    return (
      <span
        ref={ref}
        className={`${styles.badge} ${variantClass} ${sizeClass} ${className || ""}`}
        {...props}
      >
        {children}
        {onDismiss && (
          <button
            type="button"
            className={styles.dismissButton}
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = "Badge";
