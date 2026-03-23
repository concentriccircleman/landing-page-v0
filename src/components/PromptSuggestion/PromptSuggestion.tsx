import type { ReactNode } from "react";

export interface PromptSuggestionProps {
  children: ReactNode;
  size?: "sm" | "default";
  onClick?: () => void;
  className?: string;
}

export function PromptSuggestion({ children, size = "default", onClick, className }: PromptSuggestionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1-5)",
        padding: size === "sm" ? "var(--space-1-5) var(--space-2-5)" : "var(--space-2) var(--space-4)",
        fontSize: size === "sm" ? "var(--font-size-xs)" : "var(--font-size-sm)",
        fontFamily: "var(--font-family)",
        fontWeight: "var(--font-weight-normal)" as unknown as number,
        color: "var(--fg-muted)",
        background: "transparent",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-full)",
        cursor: "pointer",
        transition: "border-color 120ms ease, color 120ms ease, background 120ms ease",
        whiteSpace: "nowrap",
        lineHeight: "1",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-strong)";
        e.currentTarget.style.color = "var(--fg-base)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-subtle)";
        e.currentTarget.style.color = "var(--fg-muted)";
      }}
    >
      {children}
    </button>
  );
}
