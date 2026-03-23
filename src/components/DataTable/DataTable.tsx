import { useState, useCallback } from "react";
import {
  CaretRightIcon,
  CaretDownIcon,
  EllipsisHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "./icons";
import styles from "./DataTable.module.css";

/* ─── Types ─── */

export type StatusColor = "grey" | "green" | "blue" | "red" | "orange" | "purple";

export interface DataTableColumn {
  id: string;
  header: string;
  type: "label" | "subtle" | "badge" | "statusBadge" | "avatar" | "actions";
  width?: number;
}

export interface AvatarValue {
  name: string;
  imageUrl?: string;
  initials?: string;
}

export interface StatusBadgeValue {
  label: string;
  color: StatusColor;
}

export type CellValue = string | number | AvatarValue | StatusBadgeValue | null;

export interface DataTableRow {
  id: string;
  cells: Record<string, CellValue>;
}

export interface DataTableSection {
  id: string;
  label: string;
  defaultCollapsed?: boolean;
  rows: DataTableRow[];
}

export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalResults: number;
}

export interface DataTableProps {
  columns: DataTableColumn[];
  sections: DataTableSection[];
  pagination?: PaginationConfig;
  onRowAction?: (rowId: string) => void;
  onPageChange?: (page: number) => void;
  className?: string;
}

/* ─── Helpers ─── */

function getDotClass(color: StatusColor): string {
  const map: Record<StatusColor, string> = {
    grey: styles.dotGrey ?? "",
    green: styles.dotGreen ?? "",
    blue: styles.dotBlue ?? "",
    red: styles.dotRed ?? "",
    orange: styles.dotOrange ?? "",
    purple: styles.dotPurple ?? "",
  };
  return map[color];
}

/* ─── Sub-components ─── */

function Badge({ label }: { label: string }) {
  return <span className={styles.badge}>{label}</span>;
}

function StatusBadgeCmp({ value }: { value: StatusBadgeValue }) {
  const dotCls = [styles.statusDot, getDotClass(value.color)].filter(Boolean).join(" ");
  return (
    <span className={styles.statusBadge}>
      <span className={dotCls} />
      {value.label}
    </span>
  );
}

function AvatarCell({ value }: { value: AvatarValue }) {
  return (
    <>
      <span className={styles.avatar}>
        <span className={styles.avatarInner}>
          {value.imageUrl ? (
            <img src={value.imageUrl} alt={value.name} />
          ) : (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: 11, fontWeight: 500, color: "var(--fg-subtle)" }}>
              {value.initials ?? value.name.charAt(0)}
            </span>
          )}
        </span>
      </span>
      <span className={styles.avatarName}>{value.name}</span>
    </>
  );
}

function ActionsButton({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" className={styles.actionsButton} aria-label="More actions" onClick={onClick}>
      <EllipsisHorizontalIcon />
    </button>
  );
}

function CellContent({
  column,
  value,
  onAction,
}: {
  column: DataTableColumn;
  value: CellValue;
  onAction?: () => void;
}) {
  switch (column.type) {
    case "label":
      return <>{String(value ?? "")}</>;
    case "subtle":
      return <>{String(value ?? "")}</>;
    case "badge":
      return <Badge label={String(value ?? "")} />;
    case "statusBadge": {
      const sv = value as StatusBadgeValue | null;
      return sv ? <StatusBadgeCmp value={sv} /> : null;
    }
    case "avatar": {
      const av = value as AvatarValue | null;
      return av ? <AvatarCell value={av} /> : null;
    }
    case "actions":
      return <ActionsButton onClick={onAction} />;
    default:
      return null;
  }
}

function getCellClass(type: DataTableColumn["type"], isFirst: boolean): string {
  if (isFirst) return styles.cellFirst ?? "";
  switch (type) {
    case "subtle": return styles.cellSubtle ?? "";
    case "badge": return styles.cellBadge ?? "";
    case "statusBadge": return styles.cellStatusBadge ?? "";
    case "avatar": return styles.cellAvatar ?? "";
    case "actions": return styles.cellActions ?? "";
    default: return styles.cell ?? "";
  }
}

function Pagination({
  config,
  onPageChange,
}: {
  config: PaginationConfig;
  onPageChange?: (page: number) => void;
}) {
  const totalPages = Math.ceil(config.totalResults / config.pageSize);
  const start = (config.currentPage - 1) * config.pageSize + 1;
  const end = Math.min(config.currentPage * config.pageSize, config.totalResults);

  return (
    <div className={styles.pagination}>
      <p className={styles.paginationText}>
        {start} - {end}{" "}
        <span className={styles.paginationTextNormal}>of</span>{" "}
        {config.totalResults}{" "}
        <span className={styles.paginationTextNormal}>results</span>
      </p>
      <div className={styles.paginationButtons}>
        <button
          type="button"
          className={styles.paginationButton}
          aria-label="Previous page"
          disabled={config.currentPage <= 1}
          onClick={() => onPageChange?.(config.currentPage - 1)}
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          className={styles.paginationButton}
          aria-label="Next page"
          disabled={config.currentPage >= totalPages}
          onClick={() => onPageChange?.(config.currentPage + 1)}
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}

/* ─── Main component ─── */

export function DataTable({
  columns,
  sections,
  pagination,
  onRowAction,
  onPageChange,
  className,
}: DataTableProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    () => new Set(sections.filter((s) => s.defaultCollapsed).map((s) => s.id)),
  );

  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }, []);

  const rootClass = [styles.table, className].filter(Boolean).join(" ");

  return (
    <div className={rootClass}>
      {/* Column headers */}
      <div className={styles.headerRow}>
        {columns.map((col, i) => {
          if (col.type === "actions") {
            return (
              <div
                key={col.id}
                className={styles.headerCellEmpty}
                style={{ width: col.width ?? 56 }}
              />
            );
          }
          const isFirst = i === 0;
          return (
            <div
              key={col.id}
              className={isFirst ? styles.headerCellFirst : styles.headerCell}
              style={!isFirst && col.width ? { width: col.width } : undefined}
            >
              {col.header}
            </div>
          );
        })}
      </div>

      {/* Sections */}
      {sections.map((section) => {
        const isCollapsed = collapsedSections.has(section.id);

        return (
          <div key={section.id}>
            {/* Section header row */}
            <div className={styles.sectionRow}>
              {columns.map((col, i) => {
                if (i === 0) {
                  return (
                    <div
                      key={col.id}
                      className={styles.sectionCellFirst}
                      onClick={() => toggleSection(section.id)}
                    >
                      <span className={styles.sectionCaret}>
                        {isCollapsed ? <CaretRightIcon /> : <CaretDownIcon />}
                      </span>
                      {section.label}
                    </div>
                  );
                }
                return (
                  <div
                    key={col.id}
                    className={styles.sectionCellEmpty}
                    style={{ width: col.type === "actions" ? (col.width ?? 56) : (col.width ?? 142.8) }}
                  />
                );
              })}
            </div>

            {/* Data rows */}
            {!isCollapsed &&
              section.rows.map((row) => (
                <div key={row.id} className={styles.dataRow}>
                  {columns.map((col, i) => {
                    const isFirst = i === 0;
                    const cellClass = getCellClass(col.type, isFirst);
                    const widthStyle =
                      !isFirst && col.type !== "actions"
                        ? { width: col.width ?? 142.8 }
                        : col.type === "actions"
                          ? { width: col.width ?? 56 }
                          : undefined;

                    return (
                      <div key={col.id} className={cellClass} style={widthStyle}>
                        <CellContent
                          column={col}
                          value={row.cells[col.id] ?? null}
                          onAction={col.type === "actions" ? () => onRowAction?.(row.id) : undefined}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
          </div>
        );
      })}

      {/* Pagination */}
      {pagination && <Pagination config={pagination} onPageChange={onPageChange} />}
    </div>
  );
}
