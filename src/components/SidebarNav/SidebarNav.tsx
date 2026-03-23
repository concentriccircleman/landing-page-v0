import { useState, useCallback, type ReactNode } from "react";
import {
  TriangleDown,
  TriangleRight,
  ChevronDownMini,
  SimulationsMin,
  ScorecardsMin,
  PersonasMin,
  BackendToolsMin,
} from "../../icons/outline";
import { outlineIcons, filledIcons } from "../../icons/registry";
import styles from "./SidebarNav.module.css";

export type NavIconName =
  | "home"
  | "inbox"
  | "evaluations"
  | "workflows"
  | "calibrations"
  | "reviews"
  | "alerts"
  | "reports"
  | "assignments"
  | "learners"
  | "assessments"
  | "help"
  | "settings";

export type ResourceIconName =
  | "simulations"
  | "scorecards"
  | "personas"
  | "backendTools";

const navIconKey: Record<NavIconName, string> = {
  home: "home",
  inbox: "inbox",
  evaluations: "file-text",
  workflows: "bolt",
  calibrations: "chat-bubble",
  reviews: "file-search",
  alerts: "bell",
  reports: "chart-bar",
  assignments: "file-check",
  learners: "user",
  assessments: "file-search-alt",
  help: "lifebuoy",
  settings: "cog",
};

const resourceIconMap = {
  simulations: SimulationsMin,
  scorecards: ScorecardsMin,
  personas: PersonasMin,
  backendTools: BackendToolsMin,
} as const;

/* ─── Types ─── */

export interface NavItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon key from the nav icon set */
  icon: NavIconName;
  /** Optional badge text (e.g. unread count) */
  badge?: string;
}

export interface ResourceItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Mini-icon key for the colored avatar */
  resourceIcon: ResourceIconName;
  /** Background color for the avatar square */
  avatarColor: string;
}

export interface NavSection {
  /** Unique identifier */
  id: string;
  /** Section header label */
  label: string;
  /** Whether the section starts collapsed */
  defaultCollapsed?: boolean;
  /** Regular nav items (stroke icons) */
  items?: NavItem[];
  /** Resource items (colored avatar icons) */
  resourceItems?: ResourceItem[];
  /** Custom content rendered instead of items when provided */
  customContent?: ReactNode;
}

export interface WorkspaceAvatarConfig {
  /** Background color for the workspace avatar */
  backgroundColor: string;
  /** Optional image URL for the avatar */
  imageUrl?: string;
  /** Optional icon to render inside the avatar */
  icon?: ReactNode;
}

export interface SidebarNavProps {
  /** Workspace name displayed at the top */
  workspaceName: string;
  /** Workspace avatar configuration */
  workspaceAvatar?: WorkspaceAvatarConfig;
  /** Top-level nav items (Home, Inbox, etc.) shown above sections */
  topItems?: NavItem[];
  /** Collapsible sections with grouped nav items */
  sections: NavSection[];
  /** Footer nav items (Help, Settings, etc.) shown at bottom */
  footerItems?: NavItem[];
  /** ID of the currently active nav item */
  activeItemId?: string;
  /** Called when a nav item is clicked */
  onItemClick?: (itemId: string) => void;
  /** Called when the workspace selector is clicked */
  onWorkspaceClick?: () => void;
  /** Optional content rendered below footer nav items (e.g. theme toggle) */
  footerContent?: ReactNode;
  /** Optional CSS class for the root element */
  className?: string;
}

/* ─── Helpers ─── */

function cls(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ─── Sub-components ─── */

function StrokeNavItem({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  const key = navIconKey[item.icon] ?? item.icon;
  const registry = isActive ? filledIcons : outlineIcons;
  const IconComp = registry[key] ?? outlineIcons[key];
  return (
    <button
      type="button"
      className={cls(styles.item, isActive && styles.itemActive)}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
    >
      <span className={styles.itemIcon}>
        {IconComp && <IconComp />}
      </span>
      {item.label}
      {item.badge && <span className={styles.badge}>{item.badge}</span>}
    </button>
  );
}

function ResourceNavItem({
  item,
  isActive,
  onClick,
}: {
  item: ResourceItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  const IconComp = resourceIconMap[item.resourceIcon];
  return (
    <button
      type="button"
      className={cls(styles.item, isActive && styles.itemActive)}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
    >
      <span className={styles.resourceAvatar}>
        <span
          className={styles.resourceAvatarInner}
          style={{ backgroundColor: item.avatarColor }}
        >
          {IconComp && <IconComp />}
        </span>
      </span>
      {item.label}
    </button>
  );
}

/* ─── Main component ─── */

export function SidebarNav({
  workspaceName,
  workspaceAvatar,
  topItems,
  sections,
  footerItems,
  activeItemId,
  onItemClick,
  onWorkspaceClick,
  footerContent,
  className,
}: SidebarNavProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    () => new Set(sections.filter((s) => s.defaultCollapsed).map((s) => s.id)),
  );

  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  return (
    <aside className={cls(styles.sidebar, className)} role="navigation">
      {/* ── Workspace header ── */}
      <div className={styles.header}>
        <button
          type="button"
          className={styles.workspaceButton}
          onClick={onWorkspaceClick}
        >
          {workspaceAvatar && (
            <span className={styles.workspaceAvatar}>
              <span
                className={styles.workspaceAvatarInner}
                style={{ backgroundColor: workspaceAvatar.backgroundColor }}
              >
                {workspaceAvatar.imageUrl ? (
                  <img
                    src={workspaceAvatar.imageUrl}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "2.5px",
                    }}
                  />
                ) : (
                  workspaceAvatar.icon
                )}
              </span>
            </span>
          )}
          <span className={styles.workspaceNameGroup}>
            <span className={styles.workspaceName}>{workspaceName}</span>
            <span className={styles.workspaceChevron}>
              <ChevronDownMini />
            </span>
          </span>
        </button>
      </div>

      {/* ── Main nav content ── */}
      <div className={styles.navContent}>
        {/* Top-level items (Home, Inbox) */}
        {topItems && topItems.length > 0 && (
          <div className={styles.menuGroup}>
            {topItems.map((item) => (
              <StrokeNavItem
                key={item.id}
                item={item}
                isActive={item.id === activeItemId}
                onClick={() => onItemClick?.(item.id)}
              />
            ))}
          </div>
        )}

        {/* Sections */}
        {sections.map((section) => {
          const isCollapsed = collapsedSections.has(section.id);
          const hasItems =
            (section.items && section.items.length > 0) ||
            (section.resourceItems && section.resourceItems.length > 0);
          const hasContent = hasItems || !!section.customContent;

          return (
            <div key={section.id} className={styles.menuGroup}>
              {/* Section header */}
              <button
                type="button"
                className={styles.sectionHeader}
                aria-expanded={!isCollapsed}
                onClick={() => toggleSection(section.id)}
              >
                {section.label}
                <span className={styles.triangle}>
                  {isCollapsed ? <TriangleRight /> : <TriangleDown />}
                </span>
              </button>

              {/* Custom content or standard items */}
              {!isCollapsed && hasContent && (
                <>
                  {section.customContent
                    ? section.customContent
                    : (
                      <>
                        {section.items?.map((item) => (
                          <StrokeNavItem
                            key={item.id}
                            item={item}
                            isActive={item.id === activeItemId}
                            onClick={() => onItemClick?.(item.id)}
                          />
                        ))}
                        {section.resourceItems?.map((item) => (
                          <ResourceNavItem
                            key={item.id}
                            item={item}
                            isActive={item.id === activeItemId}
                            onClick={() => onItemClick?.(item.id)}
                          />
                        ))}
                      </>
                    )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Footer ── */}
      {(footerItems && footerItems.length > 0) || footerContent ? (
        <div className={styles.footer}>
          {footerItems?.map((item) => (
            <StrokeNavItem
              key={item.id}
              item={item}
              isActive={item.id === activeItemId}
              onClick={() => onItemClick?.(item.id)}
            />
          ))}
          {footerContent}
        </div>
      ) : null}
    </aside>
  );
}
