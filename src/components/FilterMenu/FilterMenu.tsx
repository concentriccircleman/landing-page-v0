import type { ReactNode } from "react";
import styles from "./FilterMenu.module.css";

function cls(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface FilterMenuProps {
  children: ReactNode;
  scrollbarHeight?: number;
  scrollbarTop?: number;
  width?: number;
  className?: string;
}

export function FilterMenu({
  children,
  scrollbarHeight,
  scrollbarTop,
  width,
  className,
}: FilterMenuProps) {
  return (
    <div
      className={cls(styles.menu, className)}
      style={width ? { width } : undefined}
    >
      {children}
      {scrollbarHeight != null && (
        <div
          className={styles.scrollbar}
          style={{
            height: scrollbarHeight,
            ...(scrollbarTop != null ? { top: scrollbarTop } : {}),
          }}
        />
      )}
    </div>
  );
}
