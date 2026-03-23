import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronDown, Check } from "../../icons/outline";
import styles from "./Select.module.css";

/* ── Context ── */

interface SelectContextValue {
  value: string | undefined;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled: boolean;
  error: boolean;
  size: "sm" | "default" | "lg";
  placeholder: string | undefined;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  registerItem: (value: string, label: string) => void;
  unregisterItem: (value: string) => void;
  items: Map<string, string>;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select components must be used within Select");
  return ctx;
}

/* ── Select (root) ── */

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  size?: "sm" | "default" | "lg";
  children: ReactNode;
  className?: string;
}

export function Select({
  value: controlledValue,
  defaultValue,
  onValueChange,
  placeholder,
  disabled = false,
  error = false,
  size = "default",
  children,
  className,
}: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Map<string, string>>(new Map());
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = useCallback(
    (v: string) => {
      if (!isControlled) setUncontrolledValue(v);
      onValueChange?.(v);
      setOpen(false);
    },
    [isControlled, onValueChange]
  );

  const registerItem = useCallback((itemValue: string, label: string) => {
    setItems((prev) => {
      const next = new Map(prev);
      next.set(itemValue, label);
      return next;
    });
  }, []);

  const unregisterItem = useCallback((itemValue: string) => {
    setItems((prev) => {
      const next = new Map(prev);
      next.delete(itemValue);
      return next;
    });
  }, []);

  const ctx: SelectContextValue = {
    value,
    onValueChange: handleValueChange,
    open,
    setOpen,
    disabled,
    error,
    size,
    placeholder,
    triggerRef,
    registerItem,
    unregisterItem,
    items,
  };

  return (
    <SelectContext.Provider value={ctx}>
      <div className={[styles.wrapper, className].filter(Boolean).join(" ")}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

/* ── SelectTrigger ── */

export interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
}

export function SelectTrigger({ children, className }: SelectTriggerProps) {
  const { open, setOpen, disabled, error, size, triggerRef } = useSelectContext();

  const sizeClass =
    size === "sm" ? styles.sizeSm : size === "lg" ? styles.sizeLg : styles.sizeDefault;

  const handleClick = () => {
    if (!disabled) setOpen(!open);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(!open);
    }
    if (e.key === "Escape") setOpen(false);
  };

  const triggerClasses = [
    styles.trigger,
    sizeClass,
    disabled ? styles.triggerDisabled : "",
    error ? styles.triggerError : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      disabled={disabled}
      className={triggerClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
      <ChevronDown className={styles.chevron} />
    </button>
  );
}

/* ── SelectValue ── */

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export function SelectValue({ placeholder: p, className }: SelectValueProps) {
  const { value, placeholder, items } = useSelectContext();
  const display = value ? items.get(value) ?? value : null;
  const isPlaceholder = !display;
  const text = display ?? (p ?? placeholder ?? "Select...");

  return (
    <span
      className={[isPlaceholder ? styles.triggerPlaceholder : "", className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      {text}
    </span>
  );
}

/* ── SelectContent ── */

export interface SelectContentProps {
  children: ReactNode;
  className?: string;
}

export function SelectContent({ children, className }: SelectContentProps) {
  const { open, setOpen, triggerRef } = useSelectContext();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const trigger = triggerRef.current;
      const content = contentRef.current;
      if (
        trigger &&
        content &&
        !trigger.contains(e.target as Node) &&
        !content.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, setOpen, triggerRef]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      role="listbox"
      className={[styles.content, className ?? ""].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}

/* ── SelectItem ── */

export interface SelectItemProps {
  value: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export function SelectItem({ value, disabled = false, children, className }: SelectItemProps) {
  const { value: selectedValue, onValueChange, registerItem, unregisterItem } = useSelectContext();
  const isSelected = selectedValue === value;

  React.useEffect(() => {
    const label = typeof children === "string" ? children : String(children);
    registerItem(value, label);
    return () => {
      unregisterItem(value);
    };
  }, [value, children, registerItem, unregisterItem]);

  const handleClick = () => {
    if (!disabled) onValueChange(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onValueChange(value);
    }
  };

  const itemClasses = [
    styles.item,
    isSelected ? styles.itemSelected : "",
    disabled ? styles.itemDisabled : "",
    className ?? "",
  ]
  .filter(Boolean)
  .join(" ");

  return (
    <div
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={itemClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span className={styles.checkIconSlot}>
        {isSelected && <Check className={styles.checkIcon} />}
      </span>
      {children}
    </div>
  );
}

/* ── SelectSeparator ── */

export function SelectSeparator({ className }: { className?: string }) {
  return <div className={[styles.separator, className ?? ""].filter(Boolean).join(" ")} />;
}