import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import styles from "./DropdownMenu.module.css";

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
}
const DMCtx = createContext<DropdownMenuContextValue>({ open: false, setOpen: () => {} });

export interface DropdownMenuProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function DropdownMenu({ open: controlled, onOpenChange, children }: DropdownMenuProps) {
  const [internal, setInternal] = useState(false);
  const isOpen = controlled ?? internal;
  const setOpen = (v: boolean) => {
    setInternal(v);
    onOpenChange?.(v);
  };
  return (
    <DMCtx.Provider value={{ open: isOpen, setOpen }}>
      <div className={styles.wrapper}>{children}</div>
    </DMCtx.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLSpanElement>) {
  const { open, setOpen } = useContext(DMCtx);
  return (
    <span
      className={[styles.trigger, className ?? ""].filter(Boolean).join(" ")}
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(!open); } }}
      {...props}
    >
      {children}
    </span>
  );
}

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
}

export function DropdownMenuContent({
  children,
  align = "start",
  sideOffset = 4,
  className,
  ...props
}: DropdownMenuContentProps) {
  const { open, setOpen } = useContext(DMCtx);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", esc);
    };
  }, [open, setOpen]);

  if (!open) return null;
  const alignClass = align === "end" ? styles.alignEnd : align === "center" ? styles.alignCenter : styles.alignStart;

  return (
    <div
      ref={ref}
      role="menu"
      className={[styles.content, alignClass, className ?? ""].filter(Boolean).join(" ")}
      style={{ top: `calc(100% + ${sideOffset}px)` }}
      {...props}
    >
      {children}
    </div>
  );
}

export interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
  disabled?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function DropdownMenuItem({
  variant = "default",
  disabled,
  onSelect,
  className,
  children,
  ...props
}: DropdownMenuItemProps) {
  const { setOpen } = useContext(DMCtx);
  const variantClass = variant === "destructive" ? styles.itemDestructive : "";

  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      className={[styles.item, variantClass, disabled ? styles.itemDisabled : "", className ?? ""].filter(Boolean).join(" ")}
      onClick={() => {
        if (!disabled) {
          onSelect?.();
          setOpen(false);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !disabled) {
          onSelect?.();
          setOpen(false);
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="separator" className={[styles.separator, className ?? ""].filter(Boolean).join(" ")} {...props} />;
}

export function DropdownMenuLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={[styles.label, className ?? ""].filter(Boolean).join(" ")} {...props} />;
}
