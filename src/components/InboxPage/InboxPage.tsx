import type { ReactNode } from "react";
import styles from "./InboxPage.module.css";

/* ─── Types ─── */

export interface InboxItem {
  id: string;
  /** Primary label */
  title: string;
  /** Optional secondary content to render in the list row */
  subtitle?: string;
}

export interface InboxPageProps {
  /** Inbox items for the left list */
  items?: InboxItem[];
  /** ID of the currently selected item */
  selectedItemId?: string;
  /** Called when a list item is clicked */
  onItemSelect?: (itemId: string) => void;
  /** Called when the search button is clicked */
  onSearch?: () => void;
  /** Called when the filter button is clicked */
  onFilter?: () => void;
  /** Content to render in the detail panel when an item is selected */
  detailContent?: ReactNode;
  /** Empty state icon (defaults to a map icon) */
  emptyStateIcon?: ReactNode;
  /** Empty state heading (defaults to "No notifications") */
  emptyStateTitle?: string;
  /** Empty state description (defaults to "Take a break!") */
  emptyStateDescription?: string;
  /** Optional CSS class for the root element */
  className?: string;
}

/* ─── Component ─── */

export function InboxPage({
  items = [],
  selectedItemId,
  onItemSelect,
  onSearch,
  onFilter,
  detailContent,
  emptyStateIcon,
  emptyStateTitle = "No notifications",
  emptyStateDescription = "Take a break!",
  className,
}: InboxPageProps) {
  const rootClass = [styles.page, className].filter(Boolean).join(" ");
  const hasSelection = selectedItemId && detailContent;

  return (
    <div className={rootClass}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <span className={styles.breadcrumb}>Inbox</span>
        <div className={styles.topBarActions}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Search"
            onClick={onSearch}
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Filter"
            onClick={onFilter}
          >
            <FilterIcon />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {/* Left list panel */}
        <div className={styles.listPanel}>
          {items.length > 0 ? (
            items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={[
                  styles.listItem,
                  item.id === selectedItemId
                    ? styles.listItemActive
                    : undefined,
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onItemSelect?.(item.id)}
              >
                {item.title}
              </button>
            ))
          ) : (
            <div className={styles.listEmpty} />
          )}
        </div>

        {/* Right detail panel */}
        <div className={styles.detailPanel}>
          {hasSelection ? (
            detailContent
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>
                <div className={styles.emptyStateIconInner}>
                  {emptyStateIcon ?? <MapIcon />}
                </div>
              </div>
              <div className={styles.emptyStateText}>
                <p className={styles.emptyStateTitle}>{emptyStateTitle}</p>
                <p className={styles.emptyStateDescription}>
                  {emptyStateDescription}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
