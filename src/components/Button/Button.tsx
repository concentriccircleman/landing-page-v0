import React from "react";
import styles from "./Button.module.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "destructive"
  | "ghost"
  | "text"
  | "link"
  | "link-destructive";

export type ButtonSize =
  | "sm"
  | "default"
  | "lg"
  | "icon"
  | "icon-sm"
  | "icon-lg"
  | "text";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
}

const variantMap: Record<ButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  destructive: styles.destructive,
  ghost: styles.ghost,
  text: styles.text,
  link: styles.link,
  "link-destructive": styles.linkDestructive,
};

const sizeMap: Record<ButtonSize, string> = {
  sm: styles.sizeSm,
  default: styles.sizeDefault,
  lg: styles.sizeLg,
  icon: styles.sizeIcon,
  "icon-sm": styles.sizeIconSm,
  "icon-lg": styles.sizeIconLg,
  text: styles.sizeText,
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "default",
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const classes = [
      styles.button,
      variantMap[variant],
      sizeMap[size],
      loading ? styles.loading : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-disabled={disabled || loading || undefined}
        {...props}
      >
        {children}
        {loading && (
          <span className={styles.spinner} aria-hidden="true">
            <svg
              className={styles.spinnerIcon}
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="28"
                strokeDashoffset="8"
              />
            </svg>
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
