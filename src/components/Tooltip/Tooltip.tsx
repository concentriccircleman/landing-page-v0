import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./Tooltip.module.css";

export type TooltipVariant = "default" | "inverse";
export type TooltipSide = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: React.ReactNode;
  variant?: TooltipVariant;
  side?: TooltipSide;
  sideOffset?: number;
  delayMs?: number;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({
  content,
  variant = "default",
  side = "top",
  sideOffset = 6,
  delayMs = 200,
  children,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const triggerRef = useRef<HTMLSpanElement>(null);

  const show = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(true), delayMs);
  }, [delayMs]);

  const hide = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const variantClass = variant === "inverse" ? styles.inverse : styles.default;
  const sideClass = styles[side];

  return (
    <span
      ref={triggerRef}
      className={styles.wrapper}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={[styles.tooltip, variantClass, sideClass, className ?? ""].filter(Boolean).join(" ")}
          style={{ ["--tooltip-offset" as string]: `${sideOffset}px` }}
        >
          {content}
        </span>
      )}
    </span>
  );
}
