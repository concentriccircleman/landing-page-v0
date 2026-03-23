/* LinkedIn Notifications — Sentra Design System Test Migration
   All components rebuilt with Sentra tokens. SKU IDs in comments. */

import { useState } from "react";
import styles from "./LinkedInTest.module.css";

/* ═══════════════════════════════
   Layer 0 — Atoms
   ═══════════════════════════════ */

/* NEW-0001: Avatar */

type AvatarVariant = "circle-xs" | "circle-sm" | "circle-lg" | "square-sm" | "square-md";

interface AvatarProps {
  variant: AvatarVariant;
  src?: string;
  initials?: string;
  alt?: string;
}

export function LiAvatar({ variant, src, initials, alt }: AvatarProps) {
  const cls =
    variant === "circle-lg"
      ? styles.avatarCircleLg
      : variant === "circle-xs"
        ? styles.avatarCircleXs
        : variant === "square-md"
          ? styles.avatarSquareMd
          : variant === "square-sm"
            ? styles.avatarSquareSm
            : styles.avatarCircleSm;

  return (
    <div className={cls}>
      {src ? (
        <img className={styles.avatarImg} src={src} alt={alt ?? ""} />
      ) : (
        <span className={styles.avatarInitials}>{initials ?? "?"}</span>
      )}
    </div>
  );
}

/* NEW-0002: ActionButton */

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
}

export function LiActionButton({ label, onClick }: ActionButtonProps) {
  return (
    <button type="button" className={styles.actionBtn} onClick={onClick}>
      {label}
    </button>
  );
}

/* NEW-0003: TabItem */

interface TabItemProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function LiTabItem({ label, active, onClick }: TabItemProps) {
  return (
    <button
      type="button"
      className={active ? styles.tabItemActive : styles.tabItem}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

/* NEW-0004: OverflowButton */

export function LiOverflowButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      className={styles.overflowBtn}
      onClick={onClick}
      aria-label="More options"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="4" cy="8" r="1.25" fill="currentColor" />
        <circle cx="8" cy="8" r="1.25" fill="currentColor" />
        <circle cx="12" cy="8" r="1.25" fill="currentColor" />
      </svg>
    </button>
  );
}

/* NEW-0005: NewNotificationsBanner */

export function LiNewNotificationsBanner({
  count,
  onClick,
}: {
  count: number;
  onClick?: () => void;
}) {
  return (
    <div className={styles.newNotifBannerWrap}>
      <button type="button" className={styles.newNotifBanner} onClick={onClick}>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 8V2M2.5 4.5L5 2L7.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {count} new
      </button>
    </div>
  );
}

/* Notification type icon atoms */

export function LiNewsIcon() {
  return (
    <div className={styles.avatarSquareSm}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="22" height="22" rx="4" fill="var(--button-brand)" />
        <text
          x="50%"
          y="54%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="white"
          fontSize="11"
          fontWeight="700"
          fontFamily="var(--font-family)"
        >
          in
        </text>
      </svg>
    </div>
  );
}

export function LiJobIcon() {
  return (
    <div className={styles.avatarSquareSm}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="40"
          height="40"
          rx="6"
          fill="var(--bg-component-hover)"
        />
        <path
          d="M15 16H25V26H15V16Z"
          stroke="var(--fg-muted)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 16V14.5C18 14.1 18.1 13.8 18.3 13.6C18.5 13.4 18.8 13.3 19.2 13.3H20.8C21.2 13.3 21.5 13.4 21.7 13.6C21.9 13.8 22 14.1 22 14.5V16"
          stroke="var(--fg-muted)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function LiEventIcon() {
  return (
    <div className={styles.avatarSquareSm}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="40"
          height="40"
          rx="6"
          fill="var(--tag-purple-bg)"
        />
        <text
          x="50%"
          y="54%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="var(--tag-purple-text)"
          fontSize="14"
          fontWeight="700"
          fontFamily="var(--font-family)"
        >
          14
        </text>
      </svg>
    </div>
  );
}

export function LiProfileViewIcon() {
  return (
    <div className={styles.avatarCircleSm}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="10" cy="8" r="3" stroke="var(--fg-muted)" strokeWidth="1.5" />
        <path
          d="M4 17C4 14.2 6.7 12 10 12C13.3 12 16 14.2 16 17"
          stroke="var(--fg-muted)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════
   Layer 1 — Molecules
   ═══════════════════════════════ */

/* NEW-0006: NotificationItem */

type NotificationType =
  | "congratulations"
  | "jobAlert"
  | "birthday"
  | "news"
  | "popularPost"
  | "profileView"
  | "event";

interface NotificationItemProps {
  type: NotificationType;
  avatar?: { src?: string; initials?: string };
  text: React.ReactNode;
  time: string;
  action?: { label: string; onClick?: () => void };
  meta?: string;
  unread?: boolean;
}

export function LiNotificationItem({
  type,
  avatar,
  text,
  time,
  action,
  meta,
  unread,
}: NotificationItemProps) {
  const renderAvatar = () => {
    switch (type) {
      case "news":
        return <LiNewsIcon />;
      case "jobAlert":
        return <LiJobIcon />;
      case "event":
        return <LiEventIcon />;
      case "profileView":
        return <LiProfileViewIcon />;
      default:
        return (
          <LiAvatar
            variant="circle-sm"
            src={avatar?.src}
            initials={avatar?.initials}
          />
        );
    }
  };

  return (
    <div className={unread ? styles.notifItemUnread : styles.notifItem}>
      {renderAvatar()}
      <div className={styles.notifBody}>
        <p className={styles.notifText}>{text}</p>
        {action && <LiActionButton label={action.label} onClick={action.onClick} />}
        {meta && (
          <div className={styles.notifMeta}>
            <span className={styles.notifMetaDetail}>{meta}</span>
          </div>
        )}
      </div>
      <div className={styles.notifRight}>
        <span className={styles.timestamp}>{time}</span>
        <LiOverflowButton />
      </div>
    </div>
  );
}

/* NEW-0007: TabBar */

interface TabBarProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function LiTabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className={styles.tabBar} role="tablist">
      {tabs.map((tab) => (
        <LiTabItem
          key={tab}
          label={tab}
          active={tab === activeTab}
          onClick={() => onTabChange(tab)}
        />
      ))}
    </nav>
  );
}

/* ═══════════════════════════════
   Layer 2 — Organisms
   ═══════════════════════════════ */

/* NEW-0008: NotificationFeed */

const TABS = ["All", "Jobs", "My posts", "Mentions"];

const SAMPLE_NOTIFICATIONS: NotificationItemProps[] = [
  {
    type: "news",
    text: (
      <>
        <span className={styles.notifTextBold}>Figma&apos;s CEO</span> just
        announced its Q4 results. See his post.
      </>
    ),
    time: "49m",
    unread: true,
  },
  {
    type: "congratulations",
    avatar: { initials: "MA" },
    text: (
      <>
        Congratulate{" "}
        <span className={styles.notifTextBold}>Medha Acharya</span> on 2 years
        at Vascyte. View more network updates.
      </>
    ),
    time: "52m",
    action: { label: "Say congrats" },
    unread: true,
  },
  {
    type: "popularPost",
    avatar: { initials: "AD" },
    text: (
      <>
        This post by{" "}
        <span className={styles.notifTextBold}>Anique Drumright</span> is
        popular with your network: Excited to share that I&apos;m joining
        Harvey. We&apos;re transforming legal and professional services with AI
        — keeping professionals focu...
      </>
    ),
    time: "1h",
    meta: "76 reactions · 80 comments",
  },
  {
    type: "congratulations",
    avatar: { initials: "CS" },
    text: (
      <>
        Congratulate{" "}
        <span className={styles.notifTextBold}>Carli Sasaki</span> on a new
        position at Creative People. View more network updates.
      </>
    ),
    time: "3h",
    action: { label: "Say congrats" },
  },
  {
    type: "jobAlert",
    text: (
      <>
        <span className={styles.notifTextBold}>user experience designer</span>:
        new opportunities in San Francisco Bay Area.
      </>
    ),
    time: "4h",
    action: { label: "View jobs" },
  },
  {
    type: "jobAlert",
    text: (
      <>
        <span className={styles.notifTextBold}>product designer</span>: new
        opportunities in New York, United States.
      </>
    ),
    time: "4h",
    action: { label: "View jobs" },
  },
  {
    type: "birthday",
    avatar: { initials: "DW" },
    text: (
      <>
        Wish <span className={styles.notifTextBold}>Dylan Wan</span> a happy
        birthday. View more opportunities to catch up with your network.
      </>
    ),
    time: "5h",
    action: { label: "Say happy birthday" },
  },
  {
    type: "jobAlert",
    text: (
      <>
        <span className={styles.notifTextBold}>Product Designer</span>: new
        opportunities in San Francisco Bay Area.
      </>
    ),
    time: "6h",
    action: { label: "View jobs" },
  },
  {
    type: "event",
    text: (
      <>
        <span className={styles.notifTextBold}>14.ai</span> was live for{" "}
        <span className={styles.notifTextBold}>
          Building Category-Dominant Brands: The CPO Playbook for Growth
        </span>
        . In this LinkedIn Live, join Joey Thomas, VP at DUDE Wipes, as he
        breaks down how winning...
      </>
    ),
    time: "6h",
  },
  {
    type: "profileView",
    text: (
      <>
        <span className={styles.notifTextBold}>20 people</span> viewed your
        profile. Stay anonymous and see who&apos;s viewed your profile with
        Premium.
      </>
    ),
    time: "6h",
  },
];

export function LiNotificationFeed() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className={styles.notifFeed}>
      <LiTabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className={styles.notifFeedBody}>
        <LiNewNotificationsBanner count={3} />
        <div className={styles.notifFeedList}>
          {SAMPLE_NOTIFICATIONS.map((notif, i) => (
            <LiNotificationItem key={i} {...notif} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* NEW-0009: ProfileSidebar */

export function LiVerifiedBadge() {
  return (
    <span className={styles.verifiedBadge}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="7" cy="7" r="6" fill="currentColor" />
        <path
          d="M4.5 7L6.25 8.75L9.5 5.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function LiProfileSidebar() {
  return (
    <aside className={styles.profileSidebar}>
      <LiAvatar variant="circle-lg" initials="SN" />
      <div>
        <p className={styles.profileName}>
          Shaurya Narang <LiVerifiedBadge />
        </p>
        <p className={styles.profileHeadline}>
          Product Designer · prev. Judges, DocStar · RF Desig...
        </p>
        <p className={styles.profileLocation}>
          San Francisco, California
        </p>
      </div>
      <div className={styles.profileDivider} />
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)", alignItems: "center" }}>
        <p style={{ fontFamily: "var(--font-family)", fontSize: "var(--font-size-sm)", fontWeight: 500, color: "var(--fg-base)", margin: 0 }}>
          Manage your notifications
        </p>
        <a href="#" className={styles.profileLink}>
          View settings
        </a>
      </div>
    </aside>
  );
}

/* NEW-0010: PromotedCard */

export function LiPromotedCard() {
  return (
    <aside className={styles.promotedCard}>
      <span className={styles.promotedLabel}>Promoted</span>
      <div className={styles.promotedBody}>
        <LiAvatar variant="square-md" initials="H" />
        <p className={styles.promotedName}>Hunter.io</p>
        <p className={styles.promotedDesc}>
          Follow Hunter for the latest promotions.
          <br />
          Visit the careers page for Hunter&apos;s!
        </p>
        <div className={styles.promotedFollowers}>
          <LiAvatar variant="circle-xs" initials="B" />
          <span>Brian also follows</span>
        </div>
        <button type="button" className={styles.followBtn}>
          Follow
        </button>
      </div>
      <div className={styles.promotedFooter}>
        <a href="#" className={styles.promotedFooterLink}>About</a>
        <a href="#" className={styles.promotedFooterLink}>Accessibility</a>
        <a href="#" className={styles.promotedFooterLink}>Help Center</a>
        <a href="#" className={styles.promotedFooterLink}>Privacy &amp; Terms</a>
        <a href="#" className={styles.promotedFooterLink}>Ad Choices</a>
        <a href="#" className={styles.promotedFooterLink}>Advertising</a>
        <a href="#" className={styles.promotedFooterLink}>Business Services</a>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════
   Layer 3 — Page
   ═══════════════════════════════ */

/* NEW-0011: NotificationsPage */

export function LinkedInNotificationsPage() {
  return (
    <div className={styles.page}>
      <LiProfileSidebar />
      <div className={styles.pageCenter}>
        <LiNotificationFeed />
      </div>
      <LiPromotedCard />
    </div>
  );
}

export { styles as liStyles };
export type { NotificationType, NotificationItemProps };
export default LinkedInNotificationsPage;
