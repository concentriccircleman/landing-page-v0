import { useState, useRef, useEffect } from "react";
import { Accordion, AccordionItem } from "../components/Accordion";
import { CreateEvaluationPage } from "../components/CreateEvaluationPage";
import {
  AiChatHeader,
  AiChatSuggestion,
  AiChatSuggestionTitle,
  AiChatBubble,
  AiChatResponse,
  AiChatInput,
  AiChatFooter,
  AiChatModal,
} from "../components/AiChat";
import type { ChatMessage } from "../components/AiChat";
import { ProfileCard } from "../components/ProfileCard";
import { ShareSheet } from "../components/ShareSheet";
import type { SharePerson } from "../components/ShareSheet";
import { MilestoneCard } from "../components/MilestoneCard";
import type { Participant } from "../components/MilestoneCard";
import { AppShell } from "../components/AppShell";
import { Avatar } from "../components/Avatar";
import type { AvatarSize } from "../components/Avatar";
import { CheckboxLabel } from "../components/CheckboxLabel";
import { ContextMenu } from "../components/ContextMenu";
import { DataTable } from "../components/DataTable";
import { EmptyState } from "../components/EmptyState";
import { EvaluationsPage } from "../components/EvaluationsPage";
import {
  FilterMenu,
  FilterItem,
  FilterDivider,
  FilterSearch,
  FilterSkeleton,
  FilterTextInput,
  FilterDateInput,
  FilterEmptyState,
} from "../components/FilterMenu";
import { InboxPage } from "../components/InboxPage";
import { Menu, PencilIcon, CopyIcon, TrashIcon } from "../components/Menu";
import type { MenuEntry } from "../components/Menu";
import { Toast } from "../components/Toast";
import type { KeyboardSegment } from "../components/Toast";
import type { NavItem, NavSection } from "../components/SidebarNav";
import type { EvaluationRow } from "../components/EvaluationsPage";
import type { DataTableColumn, DataTableSection } from "../components/DataTable";
import styles from "./DesignSystemTab.module.css";

/* ── Sidebar Nav data ── */
const navTopItems: NavItem[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "inbox", label: "Inbox", icon: "inbox" },
];

const navSections: NavSection[] = [
  {
    id: "quality",
    label: "Quality",
    items: [
      { id: "evaluations", label: "Evaluations", icon: "evaluations" },
      { id: "workflows", label: "Workflows", icon: "workflows" },
      { id: "calibrations", label: "Calibrations", icon: "calibrations" },
      { id: "reviews", label: "Reviews", icon: "reviews" },
      { id: "alerts", label: "Alerts", icon: "alerts" },
      { id: "quality-reports", label: "Reports", icon: "reports" },
    ],
  },
  { id: "training", label: "Training", defaultCollapsed: true },
  { id: "hiring", label: "Hiring", defaultCollapsed: true },
  {
    id: "resources",
    label: "Resources",
    resourceItems: [
      { id: "simulations", label: "Simulations", resourceIcon: "simulations", avatarColor: "var(--status-green)" },
      { id: "scorecards", label: "Scorecards", resourceIcon: "scorecards", avatarColor: "var(--status-pink)" },
      { id: "personas", label: "Personas", resourceIcon: "personas", avatarColor: "var(--status-teal)" },
      { id: "backend-tools", label: "Backend Tools", resourceIcon: "backendTools", avatarColor: "var(--status-yellow)" },
    ],
  },
];

const navFooterItems: NavItem[] = [
  { id: "help", label: "Help", icon: "help" },
  { id: "settings", label: "Settings", icon: "settings" },
];

const sidebarProps = {
  workspaceName: "Acme, Inc.",
  workspaceAvatar: { backgroundColor: "var(--status-yellow)" },
  topItems: navTopItems,
  sections: navSections,
  footerItems: navFooterItems,
  onWorkspaceClick: () => alert("Workspace selector clicked"),
};

/* ── DataTable data ── */
const dtColumns: DataTableColumn[] = [
  { id: "name", header: "Header", type: "label" },
  { id: "badge", header: "Header", type: "badge", width: 142.8 },
  { id: "status", header: "Header", type: "statusBadge", width: 142.8 },
  { id: "label", header: "Header", type: "subtle", width: 142.8 },
  { id: "user", header: "Header", type: "avatar", width: 142.8 },
  { id: "actions", header: "", type: "actions", width: 56 },
];

function makeRows(count: number): DataTableSection["rows"] {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    cells: {
      name: "Label",
      badge: "Badge",
      status: { label: "Badge", color: "grey" as const },
      label: "Label",
      user: { name: "Josh Williams" },
      actions: null,
    },
  }));
}

const dtSections: DataTableSection[] = [
  { id: "section-1", label: "Header", rows: makeRows(10) },
];

/* ── Categories ── */
interface TocEntry {
  id: string;
  label: string;
  group: string;
}

const tocEntries: TocEntry[] = [
  { id: "avatar", label: "Avatar", group: "Atoms" },
  { id: "checkbox", label: "Checkbox Label", group: "Atoms" },
  { id: "toast", label: "Toast", group: "Feedback" },
  { id: "empty-state", label: "Empty State", group: "Feedback" },
  { id: "menu", label: "Menu", group: "Overlays" },
  { id: "context-menu", label: "Context Menu", group: "Overlays" },
  { id: "filter-menu", label: "Filter Menu", group: "Overlays" },
  { id: "share-sheet", label: "Share Sheet", group: "Overlays" },
  { id: "profile-card", label: "Profile Card", group: "Cards" },
  { id: "milestone-card", label: "Milestone Card", group: "Cards" },
  { id: "data-table", label: "Data Table", group: "Data" },
  { id: "accordion", label: "Accordion", group: "Data" },
  { id: "ai-chat", label: "AI Chat", group: "Chat" },
  { id: "inbox-page", label: "Inbox Page", group: "Pages" },
  { id: "evaluations-page", label: "Evaluations Page", group: "Pages" },
  { id: "create-evaluation", label: "Create Evaluation", group: "Pages" },
];

const groups = [...new Set(tocEntries.map((e) => e.group))];

export function DesignSystemTab() {
  const [activeSection, setActiveSection] = useState("avatar");
  const mainRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const evaluationRows: EvaluationRow[] = [
    { id: "1", name: "R&E Low Performance", accuracy: 80, accuracyVariant: "success", conversations: 127, status: "live", scorecard: "Process Compliance" },
    { id: "2", name: "Customer Support Quality", accuracy: 92, accuracyVariant: "success", conversations: 254, status: "live", scorecard: "Customer Service Excellence" },
    { id: "3", name: "Sales Team Evaluation", accuracy: 75, accuracyVariant: "warning", conversations: 55, status: "testing", scorecard: "Sales Performance" },
    { id: "4", name: "Technical Support Review", accuracy: 88, accuracyVariant: "success", conversations: 144, status: "testing", scorecard: "Technical Knowledge Assessment" },
  ];

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (el && mainRef.current) {
      const top = el.offsetTop - 32;
      mainRef.current.scrollTo({ top, behavior: "smooth" });
    }
    setActiveSection(id);
  };

  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      { root: container, rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    for (const ref of Object.values(sectionRefs.current)) {
      if (ref) observer.observe(ref);
    }

    return () => observer.disconnect();
  }, []);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className={styles.page}>
      {/* ── Sidebar TOC ── */}
      <nav className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Components</div>
        {groups.map((group) => {
          const items = tocEntries.filter((e) => e.group === group);
          return (
            <div key={group} className={styles.tocGroup}>
              <div className={styles.tocGroupLabel}>{group}</div>
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.tocLink} ${activeSection === item.id ? styles.tocLinkActive : ""}`}
                  onClick={() => scrollTo(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          );
        })}
      </nav>

      {/* ── Main Content ── */}
      <div className={styles.main} ref={mainRef}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Sentra Design System</h1>
          <p className={styles.headerDesc}>Component playground — preview every component with all states and variants.</p>
        </div>

        {/* ═══ ATOMS ═══ */}
        <div className={styles.category}>
          <div className={styles.categoryHeader}>
            <h2 className={styles.categoryTitle}>Atoms</h2>
            <span className={styles.categoryCount}>2 components</span>
          </div>

          {/* Avatar */}
          <div id="avatar" ref={setRef("avatar")} className={styles.componentSection}>
            <h3 className={styles.componentLabel}>Avatar</h3>
            {(["light", "dark"] as const).map((variant) => (
              <div
                key={variant}
                className={variant === "dark" ? styles.showcaseDark : styles.showcase}
                style={{ marginBottom: "var(--space-3)" }}
                {...(variant === "dark" ? { "data-theme": "dark" } : {})}
              >
                <p className={styles.stateLabel}>{variant === "light" ? "Light" : "Dark"}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  {(["18", "20", "24", "28", "32", "36", "40"] as AvatarSize[]).map((s) => (
                    <Avatar key={`l-full-${s}`} content="letters" radius="full" size={s} variant={variant} initials="L" />
                  ))}
                  {(["18", "20", "24", "28", "32", "36", "40"] as AvatarSize[]).map((s) => (
                    <Avatar key={`l-round-${s}`} content="letters" radius="rounded" size={s} variant={variant} initials="L" />
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  {(["18", "20", "24", "28", "32", "36", "40"] as AvatarSize[]).map((s) => (
                    <Avatar key={`i-full-${s}`} content="image" radius="full" size={s} variant={variant} src="https://i.pravatar.cc/80?img=68" alt="User" />
                  ))}
                  {(["18", "20", "24", "28", "32", "36", "40"] as AvatarSize[]).map((s) => (
                    <Avatar key={`i-round-${s}`} content="image" radius="rounded" size={s} variant={variant} src="https://i.pravatar.cc/80?img=68" alt="User" />
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {(["18", "20", "24", "28", "32", "36", "40"] as AvatarSize[]).map((s) => (
                    <Avatar key={`ic-full-${s}`} content="icon" radius="full" size={s} variant={variant} />
                  ))}
                  {(["18", "20", "24", "28", "32", "36", "40"] as AvatarSize[]).map((s) => (
                    <Avatar key={`ic-round-${s}`} content="icon" radius="rounded" size={s} variant={variant} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Checkbox Label */}
          <div id="checkbox" ref={setRef("checkbox")} className={styles.componentSection}>
            <h3 className={styles.componentLabel}>Checkbox Label</h3>
            <div className={styles.showcase}>
              <div className={styles.row}>
                <div>
                  <p className={styles.stateLabel}>Plain</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <CheckboxLabel label="Label" description="The quick brown fox jumps over a lazy dog." />
                    <CheckboxLabel label="Label" description="The quick brown fox jumps over a lazy dog." defaultChecked />
                    <CheckboxLabel label="Label" description="The quick brown fox jumps over a lazy dog." disabled />
                    <CheckboxLabel label="Label" description="The quick brown fox jumps over a lazy dog." defaultChecked disabled />
                  </div>
                </div>
                <div>
                  <p className={styles.stateLabel}>Card</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <CheckboxLabel label="Label" description="The quick brown fox jumps over a lazy dog." showCard />
                    <CheckboxLabel label="Label" description="The quick brown fox jumps over a lazy dog." showCard defaultChecked />
                    <CheckboxLabel label="Label" description="The quick brown fox jumps over a lazy dog." showCard disabled />
                    <CheckboxLabel label="Label" description="The quick brown fox jumps over a lazy dog." showCard defaultChecked disabled />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ FEEDBACK ═══ */}
        <div className={styles.category}>
          <div className={styles.categoryHeader}>
            <h2 className={styles.categoryTitle}>Feedback</h2>
            <span className={styles.categoryCount}>2 components</span>
          </div>

          {/* Toast */}
          <div id="toast" ref={setRef("toast")} className={styles.componentSection}>
            <h3 className={styles.componentLabel}>Toast</h3>
            <div className={styles.showcase}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                <Toast type="info" title="Info" description="The quick brown fox jumps over a lazy dog." />
                <Toast type="success" title="Success" description="The quick brown fox jumps over a lazy dog." />
                <Toast type="error" title="Error" description="The quick brown fox jumps over a lazy dog." />
                <Toast type="warning" title="Warning" description="The quick brown fox jumps over a lazy dog." />
                <Toast type="loading" title="Loading..." description="The quick brown fox jumps over a lazy dog." />
                <Toast
                  type="keyboard"
                  segments={
                    [
                      { type: "text", value: "Next time, hit" },
                      { type: "kbd", value: "⌘" },
                      { type: "text", value: "then" },
                      { type: "kbd", value: "E" },
                      { type: "text", value: "to go to evaluations" },
                    ] satisfies KeyboardSegment[]
                  }
                />
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div id="empty-state" ref={setRef("empty-state")} className={styles.componentSection}>
            <h3 className={styles.componentLabel}>Empty State</h3>
            <div className={styles.row}>
              <div style={{ flex: 1 }}>
                <p className={styles.stateLabel}>Light</p>
                <div className={styles.showcase}>
                  <EmptyState
                    variant="light"
                    title="No records yet"
                    description="This may change over time, so check back later."
                    actions={[
                      { label: "Action", variant: "primary", onClick: () => alert("Primary clicked") },
                      { label: "Action", variant: "secondary", onClick: () => alert("Secondary clicked") },
                    ]}
                  />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <p className={styles.stateLabel}>Dark</p>
                <div className={styles.showcaseDark}>
                  <EmptyState
                    variant="dark"
                    title="No records yet"
                    description="This may change over time, so check back later."
                    actions={[
                      { label: "Action", variant: "primary", onClick: () => alert("Primary clicked") },
                      { label: "Action", variant: "secondary", onClick: () => alert("Secondary clicked") },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ OVERLAYS ═══ */}
        <div className={styles.category}>
          <div className={styles.categoryHeader}>
            <h2 className={styles.categoryTitle}>Overlays & Menus</h2>
            <span className={styles.categoryCount}>4 components</span>
          </div>

          {/* Menu */}
          <div id="menu" ref={setRef("menu")} className={styles.componentSection}>
            <h3 className={styles.componentLabel}>Menu</h3>
            <div className={styles.showcase}>
              <div className={styles.row}>
                <div>
                  <p className={styles.stateLabel}>Standard</p>
                  <Menu
                    items={
                      [
                        { type: "item", label: "Edit", icon: <PencilIcon /> },
                        { type: "item", label: "Duplicate", icon: <CopyIcon /> },
                        { type: "divider" },
                        { type: "item", label: "Delete", icon: <TrashIcon />, destructive: true },
                      ] satisfies MenuEntry[]
                    }
                  />
                </div>
                <div>
                  <p className={styles.stateLabel}>User</p>
                  <Menu
                    items={
                      [
                        { type: "user-header", name: "Josh Williams", email: "josh@sentra.ai" },
                        { type: "divider" },
                        { type: "item", label: "Select item", icon: <PencilIcon /> },
                        { type: "item", label: "Select item", icon: <PencilIcon /> },
                        { type: "item", label: "Select item", icon: <PencilIcon /> },
                        { type: "divider" },
                        { type: "item", label: "Select item", icon: <PencilIcon /> },
                        { type: "item", label: "Select item", icon: <PencilIcon /> },
                        { type: "item", label: "Select item", icon: <PencilIcon /> },
                        { type: "item", label: "Select item", icon: <PencilIcon /> },
                        { type: "item", label: "Select item", icon: <PencilIcon /> },
                        { type: "divider" },
                        { type: "item", label: "Select item", icon: <PencilIcon /> },
                        { type: "caption", text: "v.1.20.0 · Terms & Conditions" },
                      ] satisfies MenuEntry[]
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Context Menu */}
          <div id="context-menu" ref={setRef("context-menu")} className={styles.componentSection}>
            <h3 className={styles.componentLabel}>Context Menu</h3>
            <div className={styles.row}>
              <div>
                <p className={styles.stateLabel}>Dark</p>
                <div style={{ background: "var(--bg-subtle)", padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
                  <ContextMenu
                    variant="dark"
                    items={[
                      { label: "Edit", icon: "edit" },
                      { label: "Duplicate", icon: "copy" },
                      { type: "separator" },
                      { label: "Delete", icon: "trash", destructive: true },
                    ]}
                  />
                </div>
              </div>
              <div>
                <p className={styles.stateLabel}>Light</p>
                <div style={{ background: "var(--bg-base)", padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-base)" }}>
                  <ContextMenu
                    variant="light"
                    items={[
                      { label: "Edit", icon: "edit" },
                      { label: "Duplicate", icon: "copy" },
                      { type: "separator" },
                      { label: "Delete", icon: "trash", destructive: true },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Menu */}
          <div id="filter-menu" ref={setRef("filter-menu")} className={styles.componentSection}>
            <h3 className={styles.componentLabel}>Filter Menu</h3>
            <div className={styles.showcase}>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
                <div><p className={styles.stateLabel}>Simple list</p><FilterMenu><FilterItem label="Select Item" /><FilterItem label="Select Item" /><FilterItem label="Select Item" /></FilterMenu></div>
                <div><p className={styles.stateLabel}>Selection + badges</p><FilterMenu><FilterItem label="Select Item" subText="99" badge="Badge" /><FilterItem label="Select Item" subText="99" badge="Badge" selected /><FilterItem label="Select Item" subText="99" badge="Badge" disabled /></FilterMenu></div>
                <div><p className={styles.stateLabel}>Sorting</p><FilterMenu scrollbarHeight={96} scrollbarTop={8}><FilterItem type="radio" label="Order number" selected /><FilterItem type="radio" label="Date" /><FilterItem type="radio" label="Customer" /><FilterItem type="radio" label="Fulfillment status" /><FilterItem type="radio" label="Payment status" /><FilterItem type="radio" label="Total" /><FilterDivider /><FilterItem type="radio" label="Ascending" subText="1 → 30" selected /><FilterItem type="radio" label="Descending" subText="30 → 1" /></FilterMenu></div>
                <div><p className={styles.stateLabel}>Categories</p><FilterMenu scrollbarHeight={96} scrollbarTop={48}><FilterSearch placeholder="Search categories" /><FilterDivider /><FilterItem label="Bathroom" selected /><FilterItem label="Bedding" selected /><FilterItem label="Blankets" /><FilterItem label="Kids" /><FilterItem label="Kitchen" /></FilterMenu></div>
                <div><p className={styles.stateLabel}>Date</p><FilterMenu><FilterItem type="radio" label="Today" /><FilterItem type="radio" label="Last 7 days" /><FilterItem type="radio" label="Last 30 days" /><FilterItem type="radio" label="Last 90 days" /><FilterItem type="radio" label="Last 12 months" /><FilterItem type="radio" label="Custom" selected /><FilterDivider /><FilterDateInput label="Starting" /><FilterDateInput label="Ending" /></FilterMenu></div>
                <div><p className={styles.stateLabel}>Loading</p><FilterMenu><FilterSearch defaultValue="Categories" /><FilterDivider /><FilterSkeleton /></FilterMenu></div>
                <div><p className={styles.stateLabel}>No results</p><FilterMenu><FilterSearch defaultValue="Categories" /><FilterDivider /><FilterEmptyState /></FilterMenu></div>
              </div>
            </div>
          </div>

          {/* Share Sheet */}
          <div id="share-sheet" ref={setRef("share-sheet")} className={styles.componentSection}>
            <h3 className={styles.componentLabel}>Share Sheet</h3>
            <div className={styles.row}>
              <div>
                <p className={styles.stateLabel}>Default</p>
                <ShareSheet
                  people={[
                    { name: "Josh Williams", email: "josh@sentra.ai", avatarSrc: "https://i.pravatar.cc/80?img=68", permission: "owner" },
                    { name: "Sarah Chen", email: "sarah@sentra.ai", avatarSrc: "https://i.pravatar.cc/80?img=47", permission: "edit" },
                    { name: "Alex Rivera", email: "alex@sentra.ai", avatarSrc: "https://i.pravatar.cc/80?img=12", permission: "view" },
                  ] satisfies SharePerson[]}
                  link="sentra.ai/share/k8xJ2m"
                />
              </div>
              <div data-theme="dark" style={{ borderRadius: 8, padding: 16, background: "var(--bg-subtle)" }}>
                <p className={styles.stateLabel} style={{ color: "var(--fg-muted)" }}>Dark</p>
                <ShareSheet
                  people={[
                    { name: "Josh Williams", email: "josh@sentra.ai", avatarSrc: "https://i.pravatar.cc/80?img=68", permission: "owner" },
                    { name: "Sarah Chen", email: "sarah@sentra.ai", avatarSrc: "https://i.pravatar.cc/80?img=47", permission: "edit" },
                  ] satisfies SharePerson[]}
                  link="sentra.ai/share/k8xJ2m"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ═══ CARDS ═══ */}
        <div className={styles.category}>
          <div className={styles.categoryHeader}>
            <h2 className={styles.categoryTitle}>Cards</h2>
            <span className={styles.categoryCount}>2 components</span>
          </div>

          {/* Profile Card */}
          <div id="profile-card" ref={setRef("profile-card")} className={styles.componentSection}>
            <h3 className={styles.componentLabel}>Profile Card</h3>
            <div className={styles.showcase}>
              <div className={styles.row}>
                <div><p className={styles.stateLabel}>Default</p><ProfileCard name="Josh Williams" role="Senior Quality Analyst" avatarSrc="https://i.pravatar.cc/80?img=68" status="online" /></div>
                <div><p className={styles.stateLabel}>Selected</p><ProfileCard name="Sarah Chen" role="Coaching Manager" avatarSrc="https://i.pravatar.cc/80?img=47" status="away" selected /></div>
                <div><p className={styles.stateLabel}>Disabled</p><ProfileCard name="Deactivated User" role="Former Agent" avatarInitials="DU" status="offline" disabled /></div>
                <div><p className={styles.stateLabel}>Loading</p><ProfileCard loading /></div>
              </div>
            </div>
          </div>

          {/* Milestone Card */}
          <div id="milestone-card" ref={setRef("milestone-card")} className={styles.componentSection}>
            <h3 className={styles.componentLabel}>Milestone Card</h3>
            <div className={styles.grid2}>
              <div>
                <p className={styles.stateLabel}>Milestone</p>
                <MilestoneCard type="milestone" title="Launched v2.0 redesign" date="Mar 14" notes="Complete overhaul of the agent dashboard with new evaluation framework and real-time scoring." participants={[{ name: "Josh Williams", avatarSrc: "https://i.pravatar.cc/80?img=68" }, { name: "Sarah Chen", avatarSrc: "https://i.pravatar.cc/80?img=47" }, { name: "Alex Rivera", avatarSrc: "https://i.pravatar.cc/80?img=12" }] satisfies Participant[]} lead="Josh Williams" />
              </div>
              <div>
                <p className={styles.stateLabel}>Decision</p>
                <MilestoneCard type="decision" title="Pivoted scoring model to LLM-assisted" date="Feb 28" notes="After reviewing three months of manual evaluations, the team decided to integrate LLM-assisted scoring." participants={[{ name: "Jordan Lee", avatarSrc: "https://i.pravatar.cc/80?img=33" }, { name: "Sarah Chen", avatarSrc: "https://i.pravatar.cc/80?img=47" }, { name: "Marcus Johnson", avatarSrc: "https://i.pravatar.cc/80?img=53" }, { name: "Josh Williams", avatarSrc: "https://i.pravatar.cc/80?img=68" }] satisfies Participant[]} lead="Jordan Lee" />
              </div>
              <div>
                <p className={styles.stateLabel}>Blocker</p>
                <MilestoneCard type="blocker" title="Latency spike on evaluation pipeline" date="Mar 2" notes="P95 latency exceeded 4s on the scoring endpoint. Root cause traced to unoptimized embedding lookups." participants={[{ name: "Marcus Johnson", avatarSrc: "https://i.pravatar.cc/80?img=53" }, { name: "Alex Rivera", avatarSrc: "https://i.pravatar.cc/80?img=12" }] satisfies Participant[]} />
              </div>
              <div>
                <p className={styles.stateLabel}>Insight</p>
                <MilestoneCard type="insight" title="Agent satisfaction correlates with eval transparency" date="Jan 19" notes="Internal survey revealed that agents who can see scoring criteria before calls perform 23% higher." participants={[{ name: "Sarah Chen", avatarSrc: "https://i.pravatar.cc/80?img=47" }, { name: "Josh Williams", avatarSrc: "https://i.pravatar.cc/80?img=68" }] satisfies Participant[]} lead="Sarah Chen" />
              </div>
            </div>
          </div>
        </div>

        {/* ═══ DATA ═══ */}
        <div className={styles.category}>
          <div className={styles.categoryHeader}>
            <h2 className={styles.categoryTitle}>Data Display</h2>
            <span className={styles.categoryCount}>2 components</span>
          </div>

          {/* DataTable */}
          <div id="data-table" ref={setRef("data-table")} className={styles.componentSection}>
            <h3 className={styles.componentLabel}>Data Table</h3>
            <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
              <DataTable columns={dtColumns} sections={dtSections} pagination={{ currentPage: 1, pageSize: 20, totalResults: 853 }} onRowAction={(id) => alert(`Action on row ${id}`)} onPageChange={(p) => alert(`Page ${p}`)} />
            </div>
          </div>

          {/* Accordion */}
          <div id="accordion" ref={setRef("accordion")} className={styles.componentSection}>
            <h3 className={styles.componentLabel}>Accordion</h3>
            <div className={styles.row} style={{ marginBottom: "var(--space-5)" }}>
              <div style={{ width: 360 }}>
                <p className={styles.stateLabel}>Standard — Collapsed</p>
                <AccordionItem title="Insert your accordion title here" description="Insert the accordion description here. It would look better as two lines of text or more." />
              </div>
              <div style={{ width: 360 }}>
                <p className={styles.stateLabel}>Standard — Open</p>
                <AccordionItem title="Insert your accordion title here" description="Insert the accordion description here. It would look better as two lines of text or more." defaultOpen />
              </div>
              <div style={{ width: 360 }}>
                <p className={styles.stateLabel}>Card — Collapsed</p>
                <AccordionItem variant="card" title="Insert your accordion title here" description="Insert the accordion description here. It would look better as two lines of text or more." />
              </div>
              <div style={{ width: 360 }}>
                <p className={styles.stateLabel}>Card — Open</p>
                <AccordionItem variant="card" title="Insert your accordion title here" description="Insert the accordion description here. It would look better as two lines of text or more." defaultOpen />
              </div>
            </div>
            <div className={styles.row}>
              <div>
                <p className={styles.stateLabel}>Standard Group</p>
                <Accordion
                  type="single"
                  items={[
                    { id: "s1", title: "What is Sentra?", description: "Sentra is an AI-powered coaching platform that helps teams improve their customer conversations through practice and feedback.", defaultOpen: true },
                    { id: "s2", title: "How does it work?", description: "Agents practice conversations with AI-powered simulations, then receive automated evaluations and coaching based on your scorecards." },
                    { id: "s3", title: "Can I customize the scorecards?", description: "Yes — you can create fully custom scorecards with weighted criteria that match your quality standards and compliance requirements." },
                  ]}
                />
              </div>
              <div>
                <p className={styles.stateLabel}>Card Group</p>
                <Accordion
                  variant="card"
                  type="single"
                  items={[
                    { id: "c1", title: "Insert your accordion title here", description: "Insert the accordion description here. It would look better as two lines of text or more.", defaultOpen: true },
                    { id: "c2", title: "Insert your accordion title here", description: "Insert the accordion description here. It would look better as two lines of text or more." },
                    { id: "c3", title: "Insert your accordion title here", description: "Insert the accordion description here. It would look better as two lines of text or more." },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ═══ CHAT ═══ */}
        <div className={styles.category}>
          <div className={styles.categoryHeader}>
            <h2 className={styles.categoryTitle}>AI Chat</h2>
            <span className={styles.categoryCount}>1 component system</span>
          </div>

          <div id="ai-chat" ref={setRef("ai-chat")} className={styles.componentSection}>
            <h3 className={styles.componentLabel}>AI Chat — Light</h3>
            <div className={styles.showcase}>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start", marginBottom: 24 }}>
                <div><p className={styles.stateLabel}>Header</p><AiChatHeader /></div>
                <div><p className={styles.stateLabel}>Title</p><AiChatSuggestionTitle>FAQ</AiChatSuggestionTitle></div>
                <div><p className={styles.stateLabel}>Link</p><AiChatSuggestion label="Label" showAvatar avatarSrc="https://i.pravatar.cc/80?img=68" showIcon subText="Subtext" badge="Badge" shortcuts={["⌘", "⌘"]} /></div>
                <div><p className={styles.stateLabel}>Link (active)</p><AiChatSuggestion label="Label" active showAvatar avatarSrc="https://i.pravatar.cc/80?img=68" showIcon subText="Subtext" badge="Badge" shortcuts={["⌘", "⌘"]} /></div>
              </div>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start", marginBottom: 24 }}>
                <div><p className={styles.stateLabel}>User bubble</p><AiChatBubble>The quick brown fox jumps over the lazy dog</AiChatBubble></div>
                <div style={{ width: 360 }}><p className={styles.stateLabel}>AI response</p><AiChatResponse text="Sentra is a software platform designed to optimize customer experience by continually improving quality assurance, training, and performance." /></div>
                <div style={{ width: 360 }}><p className={styles.stateLabel}>AI response (actions)</p><AiChatResponse text="Sentra enables organizations to simulate real customer interactions, evaluate conversations using custom scorecards." badges={["Badge", "Badge", "Badge"]} showActions /></div>
              </div>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ width: 360 }}><p className={styles.stateLabel}>Input</p><AiChatInput /></div>
                <div style={{ width: 360 }}><p className={styles.stateLabel}>Input (filled)</p><AiChatInput value="Can you explain what Sentra is?" /></div>
                <div style={{ width: 360 }}><p className={styles.stateLabel}>Footer</p><AiChatFooter /></div>
              </div>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
                <div><p className={styles.stateLabel}>Default</p><AiChatModal state="default" /></div>
                <div><p className={styles.stateLabel}>Input</p><AiChatModal state="input" inputValue="Can you explain what Sentra is?" /></div>
                <div><p className={styles.stateLabel}>Processing</p><AiChatModal state="processing" messages={[{ role: "user", content: "Can you explain what Sentra is and provide some background?" } satisfies ChatMessage]} /></div>
                <div><p className={styles.stateLabel}>Filled</p><AiChatModal state="filled" messages={[{ role: "user", content: "Can you explain what Sentra is?" } satisfies ChatMessage, { role: "assistant", content: "Sentra is a software platform designed to optimize customer experience.", badges: ["Badge", "Badge"] } satisfies ChatMessage]} /></div>
              </div>
            </div>

            <h3 className={styles.componentLabel} style={{ marginTop: "var(--space-6)" }}>AI Chat — Dark</h3>
            <div className={styles.showcaseDark} data-theme="dark">
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start", marginBottom: 24 }}>
                <div><p className={styles.stateLabel} style={{ color: "var(--fg-muted)" }}>Header</p><AiChatHeader /></div>
                <div><p className={styles.stateLabel} style={{ color: "var(--fg-muted)" }}>Link</p><AiChatSuggestion label="Label" showAvatar avatarSrc="https://i.pravatar.cc/80?img=68" showIcon subText="Subtext" badge="Badge" shortcuts={["⌘", "⌘"]} /></div>
                <div><p className={styles.stateLabel} style={{ color: "var(--fg-muted)" }}>User bubble</p><AiChatBubble>The quick brown fox</AiChatBubble></div>
                <div style={{ width: 360 }}><p className={styles.stateLabel} style={{ color: "var(--fg-muted)" }}>AI response</p><AiChatResponse text="Sentra is a software platform designed to optimize customer experience." /></div>
              </div>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
                <div><p className={styles.stateLabel} style={{ color: "var(--fg-muted)" }}>Default</p><AiChatModal state="default" /></div>
                <div><p className={styles.stateLabel} style={{ color: "var(--fg-muted)" }}>Filled</p><AiChatModal state="filled" messages={[{ role: "user", content: "Can you explain what Sentra is?" } satisfies ChatMessage, { role: "assistant", content: "Sentra is a software platform.", badges: ["Badge"] } satisfies ChatMessage]} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ PAGES ═══ */}
        <div className={styles.category}>
          <div className={styles.categoryHeader}>
            <h2 className={styles.categoryTitle}>Assembled Pages</h2>
            <span className={styles.categoryCount}>3 pages</span>
          </div>

          <div id="inbox-page" ref={setRef("inbox-page")} className={styles.componentSection}>
            <h3 className={styles.componentLabel}>Inbox Page</h3>
            <div className={styles.fullFrame}>
              <AppShell {...sidebarProps} activeItemId="inbox" onNavItemClick={(id) => alert(`Navigate to ${id}`)}>
                <InboxPage />
              </AppShell>
            </div>
          </div>

          <div id="evaluations-page" ref={setRef("evaluations-page")} className={styles.componentSection}>
            <h3 className={styles.componentLabel}>Evaluations Page</h3>
            <div className={styles.fullFrame}>
              <AppShell {...sidebarProps} activeItemId="evaluations" onNavItemClick={(id) => alert(`Navigate to ${id}`)}>
                <EvaluationsPage rows={evaluationRows} onCreate={() => alert("Create clicked")} onRowAction={(id) => alert(`Action on row ${id}`)} />
              </AppShell>
            </div>
          </div>

          <div id="create-evaluation" ref={setRef("create-evaluation")} className={styles.componentSection}>
            <h3 className={styles.componentLabel}>Create Evaluation Page</h3>
            <div className={styles.fullFrame}>
              <AppShell {...sidebarProps} activeItemId="evaluations" onNavItemClick={(id) => alert(`Navigate to ${id}`)}>
                <CreateEvaluationPage onBack={() => alert("Navigate back")} onCreate={() => alert("Create")} />
              </AppShell>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
