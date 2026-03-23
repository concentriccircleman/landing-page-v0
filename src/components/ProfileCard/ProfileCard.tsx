import { Avatar } from "../Avatar";
import styles from "./ProfileCard.module.css";

function cls(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export type ProfileStatus = "online" | "away" | "offline" | "busy";

export interface ProfileCardProps {
  name?: string;
  role?: string;
  avatarSrc?: string;
  avatarInitials?: string;
  status?: ProfileStatus;
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const dotClass: Record<ProfileStatus, string> = {
  online: styles.dotOnline,
  away: styles.dotAway,
  offline: styles.dotOffline,
  busy: styles.dotBusy,
};

const statusLabel: Record<ProfileStatus, string> = {
  online: "Online",
  away: "Away",
  offline: "Offline",
  busy: "Busy",
};

function Skeleton({ className }: { className?: string }) {
  const bar = (w: number, h: number, r?: number) => (
    <div className={styles.skeleton} style={{ width: w, height: h, borderRadius: r ?? 4 }} />
  );
  return (
    <div className={cls(styles.card, className)}>
      <div className={styles.skeletonHeader}>
        {bar(40, 40, 9999)}
        {bar(56, 18)}
      </div>
      <div className={styles.skeletonText}>
        {bar(120, 12)}
        {bar(88, 10)}
      </div>
    </div>
  );
}

export function ProfileCard({
  name = "Josh Williams",
  role = "Senior Quality Analyst",
  avatarSrc,
  avatarInitials,
  status,
  selected = false,
  disabled = false,
  loading = false,
  className,
}: ProfileCardProps) {
  if (loading) return <Skeleton className={className} />;

  const initials =
    avatarInitials ??
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2);

  return (
    <div
      className={cls(
        styles.card,
        selected && styles.selected,
        disabled && styles.disabled,
        className,
      )}
    >
      <div className={styles.header}>
        <div className={styles.avatarWrap}>
          <Avatar
            size="40"
            content={avatarSrc ? "image" : "letters"}
            src={avatarSrc}
            initials={initials}
            radius="full"
          />
        </div>
        {status && (
          <span className={styles.statusBadge}>
            <span className={cls(styles.statusDot, dotClass[status])} />
            {statusLabel[status]}
          </span>
        )}
      </div>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.role}>{role}</p>
    </div>
  );
}
