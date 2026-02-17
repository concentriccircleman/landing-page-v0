import { type IconName, getIcon } from "./icons";
import styles from "./ContextMenu.module.css";

/* ─── Types ─── */

export interface ContextMenuItemDef {
  /** Display label for the menu item */
  label: string;
  /** Icon name from the design system icon set */
  icon: IconName;
  /** Marks the item as destructive (red text) */
  destructive?: boolean;
  /** Click handler */
  onClick?: () => void;
}

export interface ContextMenuSeparatorDef {
  type: "separator";
}

export type ContextMenuEntry = ContextMenuItemDef | ContextMenuSeparatorDef;

export interface ContextMenuProps {
  /** Visual variant — must match the surface it's placed on */
  variant: "dark" | "light";
  /** Array of menu items and separators */
  items: ContextMenuEntry[];
  /** Optional CSS class for the root element */
  className?: string;
}

/* ─── Helpers ─── */

function isSeparator(
  entry: ContextMenuEntry,
): entry is ContextMenuSeparatorDef {
  return "type" in entry && entry.type === "separator";
}

/* ─── Component ─── */

export function ContextMenu({ variant, items, className }: ContextMenuProps) {
  const rootClass = [styles.menu, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass} role="menu">
      {items.map((entry, i) => {
        if (isSeparator(entry)) {
          return (
            <div
              key={`sep-${i}`}
              className={styles.separator}
              role="separator"
              aria-hidden="true"
            />
          );
        }

        const Icon = getIcon(entry.icon);
        const itemClass = [
          styles.item,
          entry.destructive ? styles.destructive : undefined,
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={entry.label}
            type="button"
            className={itemClass}
            role="menuitem"
            onClick={entry.onClick}
          >
            <span className={styles.icon}>
              <Icon />
            </span>
            {entry.label}
          </button>
        );
      })}
    </div>
  );
}
