import { useState, useCallback } from "react";
import { ChevronDown, ArrowLeft } from "../../icons/outline";
import { outlineIcons, filledIcons } from "../../icons/registry";
import styles from "./SettingsSidebar.module.css";

export type SettingsIconName =
  | "workspace"
  | "users"
  | "groups"
  | "audit-logs"
  | "voice-guide"
  | "conversation-flags"
  | "calibrations"
  | "processes"
  | "teams"
  | "learner-roles"
  | "chevron-down"
  | "back-arrow";

const settingsIconKey: Record<SettingsIconName, string> = {
  workspace: "workspace",
  users: "users",
  groups: "groups",
  "audit-logs": "audit-log",
  "voice-guide": "microphone",
  "conversation-flags": "flag",
  calibrations: "clipboard-check",
  processes: "check-square",
  teams: "building",
  "learner-roles": "user-circle",
  "chevron-down": "chevron-down",
  "back-arrow": "arrow-left",
};

/* ─── Types ─── */

export interface SettingsNavItem {
  /** Unique identifier for this nav item */
  id: string;
  /** Display label */
  label: string;
  /** Icon key from the settings icon set */
  icon: SettingsIconName;
  /** Optional badge text (e.g. a count) */
  badge?: string;
}

export interface SettingsSection {
  /** Unique identifier for this section */
  id: string;
  /** Section header label (e.g. "General", "Quality") */
  label: string;
  /** Whether the section starts collapsed */
  defaultCollapsed?: boolean;
  /** Nav items in this section */
  items: SettingsNavItem[];
}

export interface SettingsSidebarProps {
  /** Ordered list of sections to render */
  sections: SettingsSection[];
  /** ID of the currently active nav item */
  activeItemId?: string;
  /** Called when a nav item is clicked */
  onItemClick?: (itemId: string) => void;
  /** Called when the back arrow is clicked */
  onBack?: () => void;
  /** Optional CSS class for the root element */
  className?: string;
}

/* ─── Component ─── */

export function SettingsSidebar({
  sections,
  activeItemId,
  onItemClick,
  onBack,
  className,
}: SettingsSidebarProps) {
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

  const rootClass = [styles.sidebar, className].filter(Boolean).join(" ");

  return (
    <nav className={rootClass} role="navigation" aria-label="Settings">
      {/* Header */}
      <div className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          aria-label="Back"
          onClick={onBack}
        >
          <ArrowLeft />
        </button>
        <span className={styles.headerTitle}>Settings</span>
      </div>

      {/* Sections */}
      {sections.map((section) => {
        const isCollapsed = collapsedSections.has(section.id);

        return (
          <div key={section.id} className={styles.section}>
            <button
              type="button"
              className={styles.sectionHeader}
              aria-expanded={!isCollapsed}
              onClick={() => toggleSection(section.id)}
            >
              {section.label}
              <ChevronDown
                className={[
                  styles.chevron,
                  isCollapsed ? styles.chevronCollapsed : undefined,
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            </button>

            <div
              className={[
                styles.sectionItems,
                isCollapsed ? styles.sectionItemsCollapsed : undefined,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {section.items.map((item) => {
                const key = settingsIconKey[item.icon] ?? item.icon;
                const isActive = item.id === activeItemId;
                const registry = isActive ? filledIcons : outlineIcons;
                const IconComp = registry[key] ?? outlineIcons[key];

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={[
                      styles.item,
                      isActive ? styles.itemActive : undefined,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => onItemClick?.(item.id)}
                  >
                    <span className={styles.itemIcon}>
                      {IconComp && <IconComp />}
                    </span>
                    {item.label}
                    {item.badge && (
                      <span className={styles.badge}>{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
