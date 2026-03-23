import { Avatar } from "../Avatar";
import styles from "./MilestoneCard.module.css";

function cls(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export type MilestoneType = "milestone" | "decision" | "blocker" | "insight";

export interface Participant {
  name: string;
  avatarSrc?: string;
  avatarInitials?: string;
}

export interface MilestoneCardProps {
  type?: MilestoneType;
  title: string;
  date?: string;
  notes?: string;
  participants?: Participant[];
  lead?: string;
  maxAvatars?: number;
  className?: string;
}

const dotClass: Record<MilestoneType, string> = {
  milestone: styles.dotMilestone,
  decision: styles.dotDecision,
  blocker: styles.dotBlocker,
  insight: styles.dotInsight,
};

const typeLabel: Record<MilestoneType, string> = {
  milestone: "Milestone",
  decision: "Decision",
  blocker: "Blocker",
  insight: "Insight",
};

export function MilestoneCard({
  type = "milestone",
  title,
  date,
  notes,
  participants = [],
  lead,
  maxAvatars = 4,
  className,
}: MilestoneCardProps) {
  const visible = participants.slice(0, maxAvatars);
  const overflowCount = participants.length - maxAvatars;

  return (
    <div className={cls(styles.card, className)}>
      <div className={styles.header}>
        <span className={styles.typeBadge}>
          <span className={cls(styles.typeDot, dotClass[type])} />
          {typeLabel[type]}
        </span>
        {date && <span className={styles.date}>{date}</span>}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {notes && <p className={styles.notes}>{notes}</p>}
      </div>

      {participants.length > 0 && (
        <div className={styles.footer}>
          <div className={styles.avatarStack}>
            {visible.map((p) => {
              const initials =
                p.avatarInitials ??
                p.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2);
              return (
                <div key={p.name} className={styles.avatarItem}>
                  <Avatar
                    size="24"
                    content={p.avatarSrc ? "image" : "letters"}
                    src={p.avatarSrc}
                    initials={initials}
                    radius="full"
                  />
                </div>
              );
            })}
            {overflowCount > 0 && (
              <span className={styles.overflow}>+{overflowCount}</span>
            )}
          </div>
          {lead && <span className={styles.leadLabel}>{lead}</span>}
        </div>
      )}
    </div>
  );
}
