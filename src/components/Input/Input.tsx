import { forwardRef, type InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  size?: "sm" | "default" | "lg";
  error?: boolean;
  variant?: "default" | "brand";
}

const sizeClass: Record<string, string> = {
  sm: styles.sizeSm,
  default: styles.sizeDefault,
  lg: styles.sizeLg,
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size = "default", error = false, variant = "default", className, ...rest }, ref) => {
    const cls = [
      styles.input,
      sizeClass[size],
      error ? styles.error : "",
      variant === "brand" ? styles.brand : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return <input ref={ref} className={cls} {...rest} />;
  },
);

Input.displayName = "Input";
