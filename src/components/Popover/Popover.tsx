import React, { useState, useRef, useEffect } from "react";
import styles from "./Popover.module.css";

export interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Popover({ open: controlledOpen, onOpenChange, children }: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen ?? internalOpen;
  const setOpen = (v: boolean) => {
    setInternalOpen(v);
    onOpenChange?.(v);
  };

  return (
    <div className={styles.wrapper}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child))
          return React.cloneElement(child as React.ReactElement<{ __open?: boolean; __setOpen?: (v: boolean) => void }>, {
            __open: isOpen,
            __setOpen: setOpen,
          });
        return child;
      })}
    </div>
  );
}

export function PopoverTrigger({
  children,
  __open,
  __setOpen,
  className,
  ...props
}: {
  children: React.ReactNode;
  __open?: boolean;
  __setOpen?: (v: boolean) => void;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={[styles.trigger, className ?? ""].filter(Boolean).join(" ")}
      onClick={() => __setOpen?.(!__open)}
      {...props}
    >
      {children}
    </span>
  );
}

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
  __open?: boolean;
  __setOpen?: (v: boolean) => void;
}

export function PopoverContent({
  children,
  align = "center",
  sideOffset = 4,
  __open,
  __setOpen,
  className,
  ...props
}: PopoverContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!__open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) __setOpen?.(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") __setOpen?.(false);
    };
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", esc);
    };
  }, [__open, __setOpen]);

  if (!__open) return null;

  const alignClass = align === "start" ? styles.alignStart : align === "end" ? styles.alignEnd : styles.alignCenter;

  return (
    <div
      ref={ref}
      className={[styles.content, alignClass, className ?? ""].filter(Boolean).join(" ")}
      style={{ top: `calc(100% + ${sideOffset}px)` }}
      {...props}
    >
      {children}
    </div>
  );
}
