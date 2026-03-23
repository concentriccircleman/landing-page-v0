import styles from "./EvaluationsPage.module.css";

/* ─── Types ─── */

export type BadgeVariant = "success" | "warning" | "neutral";
export type StatusType = "live" | "testing" | "paused" | "draft";

export interface EvaluationRow {
  id: string;
  name: string;
  accuracy: number;
  accuracyVariant: BadgeVariant;
  conversations: number;
  status: StatusType;
  scorecard: string;
}

export interface EvaluationsPageProps {
  /** Table rows */
  rows: EvaluationRow[];
  /** Called when "Create" is clicked */
  onCreate?: () => void;
  /** Called when a row's action button (⋯) is clicked */
  onRowAction?: (rowId: string) => void;
  /** Optional CSS class for the root element */
  className?: string;
}

/* ─── Sub-components ─── */

function AccuracyBadge({
  value,
  variant,
}: {
  value: number;
  variant: BadgeVariant;
}) {
  const cls =
    variant === "success"
      ? styles.badgeSuccess
      : variant === "warning"
        ? styles.badgeWarning
        : styles.badgeNeutral;

  return <span className={cls}>{value}%</span>;
}

const statusConfig: Record<
  StatusType,
  { label: string; dotClass: string | undefined }
> = {
  live: { label: "Live", dotClass: styles.dotGreen },
  testing: { label: "Testing", dotClass: styles.dotBlue },
  paused: { label: "Paused", dotClass: undefined },
  draft: { label: "Draft", dotClass: undefined },
};

function StatusBadge({ status }: { status: StatusType }) {
  const { label, dotClass } = statusConfig[status];
  return (
    <span className={styles.statusBadge}>
      <span className={[styles.statusDot, dotClass].filter(Boolean).join(" ")} />
      {label}
    </span>
  );
}

function ActionButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      className={styles.iconButton}
      aria-label="More actions"
      onClick={onClick}
    >
      <span className={styles.iconButtonDots}>
        <MoreIcon />
      </span>
    </button>
  );
}

/* ─── Main component ─── */

export function EvaluationsPage({
  rows,
  onCreate,
  onRowAction,
  className,
}: EvaluationsPageProps) {
  const rootClass = [styles.container, className].filter(Boolean).join(" ");

  return (
    <div className={rootClass}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <span className={styles.breadcrumb}>Evaluations</span>
        <button
          type="button"
          className={styles.createButton}
          onClick={onCreate}
        >
          Create
        </button>
      </div>

      {/* Table header */}
      <div className={styles.tableHeader}>
        <div className={styles.headerCellName}>Name</div>
        <div className={styles.headerCellAccuracy}>Accuracy</div>
        <div className={styles.headerCellConversations}>Conversations</div>
        <div className={styles.headerCellStatus}>Status</div>
        <div className={styles.headerCellScorecard}>Scorecard</div>
        <div className={styles.headerCellAction} />
      </div>

      {/* Table rows */}
      {rows.map((row) => (
        <div key={row.id} className={styles.tableRow}>
          <div className={styles.cellName}>{row.name}</div>
          <div className={styles.cellAccuracy}>
            <AccuracyBadge
              value={row.accuracy}
              variant={row.accuracyVariant}
            />
          </div>
          <div className={styles.cellConversations}>{row.conversations}</div>
          <div className={styles.cellStatus}>
            <StatusBadge status={row.status} />
          </div>
          <div className={styles.cellScorecard}>{row.scorecard}</div>
          <div className={styles.cellAction}>
            <ActionButton onClick={() => onRowAction?.(row.id)} />
          </div>
        </div>
      ))}
    </div>
  );
}
