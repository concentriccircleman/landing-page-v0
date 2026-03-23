import type { ReactNode } from "react";
import { SidebarNav } from "../SidebarNav";
import type {
  NavItem,
  NavSection,
  WorkspaceAvatarConfig,
} from "../SidebarNav";
import styles from "./AppShell.module.css";

/* ─── Types ─── */

export interface AppShellProps {
  /** Workspace name displayed in the sidebar header */
  workspaceName: string;
  /** Workspace avatar configuration */
  workspaceAvatar?: WorkspaceAvatarConfig;
  /** Top-level nav items (Home, Inbox, etc.) */
  topItems?: NavItem[];
  /** Collapsible sections with grouped nav items */
  sections: NavSection[];
  /** Footer nav items (Help, Settings, etc.) */
  footerItems?: NavItem[];
  /** ID of the currently active nav item (controls sidebar highlight) */
  activeItemId?: string;
  /** Called when a sidebar nav item is clicked */
  onNavItemClick?: (itemId: string) => void;
  /** Called when the workspace selector is clicked */
  onWorkspaceClick?: () => void;
  /** Optional content rendered in the sidebar footer (e.g. theme toggle) */
  footerContent?: ReactNode;
  /** The page content rendered to the right of the sidebar */
  children: ReactNode;
  /** Optional CSS class for the root element */
  className?: string;
}

/* ─── Component ─── */

export function AppShell({
  workspaceName,
  workspaceAvatar,
  topItems,
  sections,
  footerItems,
  activeItemId,
  onNavItemClick,
  onWorkspaceClick,
  footerContent,
  children,
  className,
}: AppShellProps) {
  const rootClass = [styles.shell, className].filter(Boolean).join(" ");

  return (
    <div className={rootClass}>
      <SidebarNav
        workspaceName={workspaceName}
        workspaceAvatar={workspaceAvatar}
        topItems={topItems}
        sections={sections}
        footerItems={footerItems}
        activeItemId={activeItemId}
        onItemClick={onNavItemClick}
        onWorkspaceClick={onWorkspaceClick}
        footerContent={footerContent}
      />
      <div className={styles.content}>
        <main className={styles.contentInner}>{children}</main>
      </div>
    </div>
  );
}
