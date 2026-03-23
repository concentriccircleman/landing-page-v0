import { useState, useCallback } from "react";
import styles from "./Accordion.module.css";

function TriangleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4.5L9.5 7.5L6 10.5V4.5Z" fill="currentColor" />
    </svg>
  );
}

function CircleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.5" cy="7.5" r="6.722" stroke="currentColor" strokeWidth="0.778" />
    </svg>
  );
}

function cls(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export type AccordionVariant = "standard" | "card";

export interface AccordionItemProps {
  title: string;
  description?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: AccordionVariant;
  className?: string;
}

export function AccordionItem({
  title,
  description,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  variant = "standard",
  className,
}: AccordionItemProps) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const toggle = useCallback(() => {
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isOpen, isControlled, onOpenChange]);

  const isCard = variant === "card";

  return (
    <div className={className}>
      <button
        type="button"
        className={cls(
          styles.trigger,
          isCard ? styles.card : styles.standard,
          isCard && (isOpen ? styles.cardExpanded : styles.cardCollapsed),
        )}
        onClick={toggle}
      >
        <span className={cls(styles.iconWrap, !isCard && isOpen && styles.iconOpen)}>
          {isCard ? <CircleIcon /> : <TriangleIcon />}
        </span>
        <div className={styles.content}>
          <span className={styles.title}>{title}</span>
          {isOpen && description && (
            <p className={styles.description}>{description}</p>
          )}
        </div>
        {isCard && (
          <span className={cls(styles.trailingIcon, isOpen && styles.trailingOpen)}>
            <TriangleIcon />
          </span>
        )}
      </button>
    </div>
  );
}

export interface AccordionEntry {
  id: string;
  title: string;
  description?: string;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionEntry[];
  type?: "single" | "multiple";
  variant?: AccordionVariant;
  className?: string;
}

export function Accordion({
  items,
  type = "single",
  variant = "standard",
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const defaults = new Set<string>();
    for (const item of items) {
      if (item.defaultOpen) defaults.add(item.id);
    }
    return defaults;
  });

  const handleToggle = useCallback(
    (id: string, next: boolean) => {
      setOpenIds((prev) => {
        const copy = new Set(prev);
        if (next) {
          if (type === "single") copy.clear();
          copy.add(id);
        } else {
          copy.delete(id);
        }
        return copy;
      });
    },
    [type],
  );

  return (
    <div className={cls(styles.group, className)}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          title={item.title}
          description={item.description}
          open={openIds.has(item.id)}
          onOpenChange={(next) => handleToggle(item.id, next)}
          variant={variant}
        />
      ))}
    </div>
  );
}
