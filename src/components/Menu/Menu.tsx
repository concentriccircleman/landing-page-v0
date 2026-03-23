import type { ReactNode } from "react";
import styles from "./Menu.module.css";

/* ── Entry types ── */

export interface MenuItemDef {
  type: "item";
  label: string;
  icon?: ReactNode;
  suffix?: string;
  destructive?: boolean;
  onClick?: () => void;
}

export interface MenuDividerDef {
  type: "divider";
}

export interface MenuUserHeaderDef {
  type: "user-header";
  name: string;
  email: string;
  avatarUrl?: string;
  avatarInitials?: string;
}

export interface MenuCaptionDef {
  type: "caption";
  text: string;
}

export type MenuEntry =
  | MenuItemDef
  | MenuDividerDef
  | MenuUserHeaderDef
  | MenuCaptionDef;

export interface MenuProps {
  items: MenuEntry[];
  className?: string;
}

function Divider() {
  return (
    <div className={styles.divider}>
      <div className={styles.dividerLine} />
    </div>
  );
}

function UserHeader({ entry }: { entry: MenuUserHeaderDef }) {
  return (
    <div className={styles.userHeader}>
      {entry.avatarUrl ? (
        <div className={styles.avatar}>
          <img src={entry.avatarUrl} alt={entry.name} />
        </div>
      ) : (
        <div className={styles.avatarLetters}>
          {entry.avatarInitials ?? entry.name.charAt(0)}
        </div>
      )}
      <div className={styles.userInfo}>
        <span className={styles.userName}>{entry.name}</span>
        <span className={styles.userEmail}>{entry.email}</span>
      </div>
    </div>
  );
}

function Caption({ text }: { text: string }) {
  return (
    <div className={styles.caption}>
      <span className={styles.captionText}>{text}</span>
    </div>
  );
}

function Item({ entry }: { entry: MenuItemDef }) {
  return (
    <button
      type="button"
      className={entry.destructive ? styles.itemDestructive : styles.item}
      onClick={entry.onClick}
    >
      {entry.icon && <span className={styles.icon}>{entry.icon}</span>}
      <span className={styles.label}>{entry.label}</span>
      {entry.suffix && <span className={styles.suffix}>{entry.suffix}</span>}
    </button>
  );
}

export function Menu({ items, className }: MenuProps) {
  const rootClass = [styles.menu, className].filter(Boolean).join(" ");

  return (
    <div className={rootClass}>
      {items.map((entry, i) => {
        switch (entry.type) {
          case "divider":
            return <Divider key={`div-${i}`} />;
          case "user-header":
            return <UserHeader key="user" entry={entry} />;
          case "caption":
            return <Caption key="caption" text={entry.text} />;
          case "item":
            return <Item key={entry.label + i} entry={entry} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
