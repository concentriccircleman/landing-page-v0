import type { LabelHTMLAttributes, ReactNode } from "react";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children?: ReactNode;
}

export function Label({ children, style, ...rest }: LabelProps) {
  return (
    <label
      style={{
        fontFamily: "var(--font-family)",
        fontSize: "var(--font-size-sm)",
        fontWeight: "var(--font-weight-medium)" as unknown as number,
        lineHeight: "var(--leading-sm)",
        color: "var(--fg-base)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </label>
  );
}
