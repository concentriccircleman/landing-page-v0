import { useCallback } from "react";
import styles from "./ToggleButtonGroup.module.css";

export interface ToggleButtonItem {
  value: string;
  label: string;
  count?: number;
  /** CSS color string for a small dot indicator (e.g. Memory type colors) */
  dot?: string;
}

export interface ToggleButtonGroupProps {
  items: ToggleButtonItem[];
  /** Single-select: string value. Multi-select: Set of active values. */
  value: Set<string> | string;
  onChange: (next: Set<string> | string) => void;
  /** When true, multiple buttons can be active simultaneously */
  multi?: boolean;
  size?: "sm" | "default";
}

export function ToggleButtonGroup({
  items,
  value,
  onChange,
  multi = false,
  size = "sm",
}: ToggleButtonGroupProps) {
  const isActive = useCallback(
    (itemValue: string): boolean => {
      if (multi) {
        return value instanceof Set ? value.has(itemValue) : false;
      }
      return value === itemValue;
    },
    [value, multi],
  );

  const handleClick = useCallback(
    (itemValue: string) => {
      if (multi) {
        const current = value instanceof Set ? value : new Set<string>();
        const next = new Set(current);
        if (next.has(itemValue)) {
          next.delete(itemValue);
        } else {
          next.add(itemValue);
        }
        onChange(next);
      } else {
        onChange(itemValue);
      }
    },
    [value, multi, onChange],
  );

  const sizeClass = size === "sm" ? styles.sizeSm : styles.sizeDefault;

  return (
    <div className={styles.group} role="group">
      {items.map((item) => {
        const active = isActive(item.value);
        return (
          <button
            key={item.value}
            type="button"
            className={`${styles.btn} ${sizeClass} ${active ? styles.btnActive : styles.btnInactive}`}
            onClick={() => handleClick(item.value)}
            aria-pressed={active}
          >
            {item.dot && (
              <span
                className={styles.dot}
                style={{ background: item.dot }}
                aria-hidden="true"
              />
            )}
            {item.label}
            {item.count != null && (
              <span className={styles.count}>{item.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
