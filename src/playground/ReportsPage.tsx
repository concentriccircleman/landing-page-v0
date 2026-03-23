import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "../components/Select";
import { Separator } from "../components/Separator";
import { Markdown } from "../components/Markdown";
import { TopBar } from "../components/TopBar";
import { ToggleButtonGroup } from "../components/ToggleButtonGroup";
import { Input } from "../components/Input";
import {
  Plus as PlusIcon,
  CalendarMini as CalendarIcon,
  People as PeopleIcon,
  WarningExclamation as WarningIcon,
  ChevronDown,
  Calendar,
  CheckCircle,
  Users,
  Flag as FlagIcon,
  Folder as SourceIcon,
  AiSparkle,
} from "../icons/outline";
import { FeatureBanner } from "./FeatureBanner";
import styles from "./ReportsPage.module.css";

/* ═══════════════════════════════════════
   Weekly Reports types & data
   ═══════════════════════════════════════ */

interface ReportData {
  id: string;
  title: string;
  date: string;
  type: "weekly" | "monthly";
  status: "draft" | "published";
  summary: string;
  participants: Array<{ initials: string; name: string }>;
  meetingsAnalyzed: number;
  actionItems: number;
  keyDecisions: number;
  highlights: string;
}

const extendedReports: ReportData[] = [
  {
    id: "r1",
    title: "Week of Feb 10 Summary",
    date: "Feb 14, 2026",
    type: "weekly",
    status: "published",
    summary: "Strong progress on design system migration. 25 components completed, token system finalized, and review tool deployed.",
    participants: [
      { initials: "SH", name: "Shaurya" },
      { initials: "AJ", name: "Alice Johnson" },
      { initials: "BC", name: "Bob Chen" },
    ],
    meetingsAnalyzed: 8,
    actionItems: 12,
    keyDecisions: 5,
    highlights: `## Weekly Summary — Feb 10-14

### Key Accomplishments
- Completed migration of **25 core components** to the design system
- Finalized the semantic token naming convention (\`--fg-base\`, \`--bg-subtle\`, etc.)
- Deployed the Review Tool for component approval workflow
- Set up Code Connect mappings for the first 10 atoms

### Meetings Analyzed
| Meeting | Participants | Key Outcome |
|---------|-------------|-------------|
| Q1 Planning | Shaurya, Alice, Bob | Agreed on 70-component migration target |
| Design Review | Shaurya, Dave | Finalized 4px grid spacing rule |
| Sprint Retro | Full team | Adopted CSS Modules over Tailwind |

### Action Items
1. Complete remaining 45 component migrations
2. Build product assembly pipeline
3. Set up Figma Code Connect for all atoms
4. Write accessibility audit for first 25 components
5. Deploy dark mode toggle to staging

### Key Decisions
- **CSS Modules** chosen over Tailwind for component styling
- **Semantic tokens** as the canonical color format (hex values)
- **Atomic Design** methodology for component categorization
- **4px grid** as the universal spacing system
- **No external UI libraries** — all components built from scratch`,
  },
  {
    id: "r2",
    title: "Week of Feb 17 Summary",
    date: "Feb 21, 2026",
    type: "weekly",
    status: "draft",
    summary: "Migrated remaining 45 components. Review tool enhanced with persistence, dependency alerts, and version tracking.",
    participants: [
      { initials: "SH", name: "Shaurya" },
      { initials: "CD", name: "Carol Davis" },
    ],
    meetingsAnalyzed: 5,
    actionItems: 8,
    keyDecisions: 3,
    highlights: `## Weekly Summary — Feb 17-21

### Key Accomplishments
- Migrated all **70 product UI components** to the new design system
- Enhanced Review Tool with localStorage persistence and dependency alerts
- Built product assembly infrastructure (routes, DemoProvider, CLAUDE.md)
- Added keyboard navigation (arrow keys) to the component review flow

### In Progress
- Assembling first product page (Weekly Reports)
- Adding live preview renderers for all 70 components
- Preparing Code Connect mappings for Figma integration

### Meetings Analyzed
| Meeting | Participants | Key Outcome |
|---------|-------------|-------------|
| Product Sync | Shaurya, Carol | Defined page assembly workflow |
| Design System Review | Shaurya, Dave, Eve | Approved organism component set |

### Action Items
1. Complete Weekly Reports product page assembly
2. Add remaining preview renderers to Review Tool
3. Begin Settings page assembly
4. Prepare Figma pipeline documentation
5. Run full accessibility audit on all 70 components`,
  },
  {
    id: "r3",
    title: "January 2026 Monthly",
    date: "Jan 31, 2026",
    type: "monthly",
    status: "published",
    summary: "Project kickoff month. Established design system foundations, token architecture, and component pipeline.",
    participants: [
      { initials: "SH", name: "Shaurya" },
      { initials: "AJ", name: "Alice Johnson" },
      { initials: "BC", name: "Bob Chen" },
      { initials: "CD", name: "Carol Davis" },
      { initials: "DW", name: "Dave Wilson" },
    ],
    meetingsAnalyzed: 22,
    actionItems: 34,
    keyDecisions: 12,
    highlights: `## Monthly Summary — January 2026

### Overview
January was the foundation month for the Sentra design system migration. We established the core architecture, built the token system, and created the migration pipeline.

### Key Milestones
- Design system token architecture finalized
- Component manifest created with all 70 product components
- Review Tool v1 built and deployed
- First 10 atom components migrated and approved
- Dark mode support added across all tokens

### Team Contributions
- **Shaurya**: Architecture, component migration, review tool
- **Alice**: Token system, accessibility guidelines
- **Bob**: Visual design, Figma component library
- **Carol**: Product requirements, user testing
- **Dave**: Developer tooling, build pipeline`,
  },
  {
    id: "r4",
    title: "Week of Feb 3 Summary",
    date: "Feb 7, 2026",
    type: "weekly",
    status: "published",
    summary: "Established component pipeline with multi-pass system. Built first 10 atoms including Button, Input, Badge, Card.",
    participants: [
      { initials: "SH", name: "Shaurya" },
      { initials: "AJ", name: "Alice Johnson" },
    ],
    meetingsAnalyzed: 6,
    actionItems: 15,
    keyDecisions: 4,
    highlights: `## Weekly Summary — Feb 3-7

### Key Accomplishments
- Established the multi-pass component pipeline (spacing, elegance, interaction, accessibility)
- Built first 10 atom components: Button, Input, Badge, Card, Label, Separator, Skeleton, Switch, Select, Dialog
- All components passed visual review and accessibility audit
- Set up CSS Module patterns and design token integration`,
  },
];

/* ═══════════════════════════════════════
   Risk Radar types & data
   ═══════════════════════════════════════ */

type RiskType = "timeline" | "budget" | "priority" | "ownership" | "documentation" | "communication";
type RiskStatus = "active" | "snoozed" | "resolved" | "dismissed";
type Severity = "critical" | "high" | "medium" | "low";

interface Person { name: string; initials: string; role?: string; }
interface RiskSource { type: "meeting" | "document" | "slack"; title: string; date: string; participants?: string[]; excerpt?: string; }
interface ActivityEntry { action: string; date: string; actor?: string; }

interface RiskAlert {
  id: string;
  title: string;
  synthesis: string;
  suggestedAction: string;
  severity: Severity;
  type: RiskType;
  status: RiskStatus;
  people: Person[];
  detectedDate: string;
  lastUpdated: string;
  resolvedDate?: string;
  resolvedNote?: string;
  snoozedUntil?: string;
  sources: RiskSource[];
  relatedRiskIds: string[];
  activity: ActivityEntry[];
  feedback?: "useful" | "not-useful";
}

function ClockIcon(p: { width?: number; height?: number }) {
  return (
    <svg width={p.width ?? 13} height={p.height ?? 13} viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6.5" cy="6.5" r="5" />
      <path d="M6.5 3.5V6.5l2 1.5" />
    </svg>
  );
}

const initialAlerts: RiskAlert[] = [
  {
    id: "rr1",
    title: "SoftBank PoC timeline conflict",
    synthesis: "Shaurya committed to a February deadline for the design system migration, but Carol referenced a March product launch that depends on completed components. If the migration isn't done by Feb 28, product pages shipping in March will use inconsistent styling, creating a poor first impression for the SoftBank pilot.",
    suggestedAction: "Sync with Carol to align on a hard cutoff date for which components must be migrated vs. which can ship with legacy styling.",
    severity: "critical",
    type: "timeline",
    status: "active",
    people: [
      { name: "Shaurya", initials: "S", role: "Engineering Lead" },
      { name: "Carol Davis", initials: "CD", role: "Product Manager" },
    ],
    detectedDate: "Feb 20, 2026",
    lastUpdated: "Feb 21, 2026",
    sources: [
      { type: "meeting", title: "Q1 Planning Review", date: "Feb 18, 2026", participants: ["Shaurya", "Carol Davis", "Alice Johnson"], excerpt: "Shaurya: 'We need the full migration done by end of February, no exceptions.' Carol: 'The product launch is early March, we can phase it.'" },
      { type: "meeting", title: "Product Sync — Sprint 4", date: "Feb 20, 2026", participants: ["Carol Davis", "Bob Chen"], excerpt: "Carol: 'March launch timeline is firm. We'll use whatever components are ready.'" },
      { type: "document", title: "Q1 Roadmap — Design System Track", date: "Feb 15, 2026" },
    ],
    relatedRiskIds: ["rr3"],
    activity: [
      { action: "Risk detected", date: "Feb 20, 2026" },
      { action: "Severity escalated to critical", date: "Feb 21, 2026", actor: "Sentra AI" },
    ],
  },
  {
    id: "rr2",
    title: "Q2 hiring budget gap",
    synthesis: "Alice proposed 2 engineering hires starting Q2 to support the scaling roadmap, but Bob's revenue projections assume no new hires until Q3. This $180K gap could delay the infrastructure work Alice's team needs to begin in April.",
    suggestedAction: "Schedule a joint session between Alice and Bob to reconcile the hiring budget with Q2 revenue targets. Bring the CFO's latest forecast.",
    severity: "high",
    type: "budget",
    status: "active",
    people: [
      { name: "Alice Johnson", initials: "AJ", role: "VP Engineering" },
      { name: "Bob Chen", initials: "BC", role: "Finance Director" },
    ],
    detectedDate: "Feb 20, 2026",
    lastUpdated: "Feb 20, 2026",
    sources: [
      { type: "meeting", title: "Q1 Planning Review", date: "Feb 18, 2026", participants: ["Alice Johnson", "Bob Chen", "Shaurya"], excerpt: "Alice: 'We need two senior engineers by April.' Bob: 'My model doesn't have budget for that until July at the earliest.'" },
      { type: "document", title: "2026 Headcount Plan v3", date: "Feb 10, 2026" },
    ],
    relatedRiskIds: [],
    activity: [{ action: "Risk detected", date: "Feb 20, 2026" }],
  },
  {
    id: "rr3",
    title: "Sprint 5 priority conflict",
    synthesis: "Design team prioritized dark mode for Sprint 5 based on user feedback scores, but engineering flagged performance optimization as the top priority due to p95 latency hitting 3.2s. Both require the same frontend engineers and can't run concurrently in a single sprint.",
    suggestedAction: "Run a quick impact/effort matrix with Dave and Bob to determine which delivers more value this sprint.",
    severity: "medium",
    type: "priority",
    status: "active",
    people: [
      { name: "Dave Wilson", initials: "DW", role: "Design Lead" },
      { name: "Bob Chen", initials: "BC", role: "Finance Director" },
    ],
    detectedDate: "Feb 19, 2026",
    lastUpdated: "Feb 19, 2026",
    sources: [
      { type: "meeting", title: "Sprint Retro", date: "Feb 17, 2026", participants: ["Dave Wilson", "Bob Chen", "Engineering team"] },
      { type: "meeting", title: "Design Review", date: "Feb 19, 2026", participants: ["Dave Wilson", "Carol Davis"] },
    ],
    relatedRiskIds: ["rr1"],
    activity: [{ action: "Risk detected", date: "Feb 19, 2026" }],
  },
  {
    id: "rr4",
    title: "Feedback loop dual ownership",
    synthesis: "Both Carol and Frank independently claimed ownership of the customer feedback process in separate meetings. Neither has a documented handoff plan. This dual ownership risks duplicated outreach to customers and missed action items falling between the cracks.",
    suggestedAction: "Message Carol and Frank to establish a single DRI.",
    severity: "medium",
    type: "ownership",
    status: "active",
    people: [
      { name: "Carol Davis", initials: "CD", role: "Product Manager" },
      { name: "Frank Rossi", initials: "FR", role: "Customer Success" },
    ],
    detectedDate: "Feb 18, 2026",
    lastUpdated: "Feb 18, 2026",
    sources: [
      { type: "meeting", title: "Product Sync", date: "Feb 17, 2026", participants: ["Carol Davis", "Shaurya"], excerpt: "Carol: 'I'm owning the feedback loop this quarter, it's my OKR.'" },
      { type: "meeting", title: "Customer Success Standup", date: "Feb 18, 2026", participants: ["Frank Rossi", "Sarah"], excerpt: "Frank: 'The customer feedback pipeline is mine — I'm reaching out to our top 20 accounts this week.'" },
    ],
    relatedRiskIds: [],
    activity: [{ action: "Risk detected", date: "Feb 18, 2026" }],
  },
  {
    id: "rr5",
    title: "API versioning undocumented",
    synthesis: "Engineering discussed and agreed on a breaking-change versioning strategy during a standup, but the decision was never captured in the API docs or ADR repo. New team members onboarding next month won't know the convention, risking inconsistent implementations.",
    suggestedAction: "Ask the engineering lead to write a one-page ADR for the versioning strategy.",
    severity: "low",
    type: "documentation",
    status: "active",
    people: [{ name: "Engineering Team", initials: "ET", role: "Engineering" }],
    detectedDate: "Feb 17, 2026",
    lastUpdated: "Feb 17, 2026",
    sources: [
      { type: "meeting", title: "Daily Standup", date: "Feb 17, 2026", participants: ["Engineering team"], excerpt: "Lead: 'We're going with semantic versioning, breaking changes bump major. Everyone agreed? OK, moving on.'" },
    ],
    relatedRiskIds: [],
    activity: [{ action: "Risk detected", date: "Feb 17, 2026" }],
  },
  {
    id: "rr6",
    title: "Acme Corp deal at risk",
    synthesis: "Sales closed a verbal commitment from Acme Corp requiring SSO and audit logs by March. Product team is unaware and has neither feature on the current sprint plan. Without intervention, the deal could fall through at contract signing.",
    suggestedAction: "Set up a 15-min bridge between Sales (Lisa) and Product (Carol) to align on Acme Corp requirements.",
    severity: "critical",
    type: "communication",
    status: "active",
    people: [
      { name: "Lisa Park", initials: "LP", role: "Account Executive" },
      { name: "Carol Davis", initials: "CD", role: "Product Manager" },
    ],
    detectedDate: "Feb 21, 2026",
    lastUpdated: "Feb 21, 2026",
    sources: [
      { type: "meeting", title: "Sales Pipeline Review", date: "Feb 20, 2026", participants: ["Lisa Park", "Sales team"], excerpt: "Lisa: 'Acme is ready to sign but they need SSO and audit logs live by March 15.'" },
      { type: "slack", title: "#deals channel", date: "Feb 21, 2026", excerpt: "Lisa: 'Is SSO on the roadmap? Acme needs it ASAP.'" },
    ],
    relatedRiskIds: [],
    activity: [{ action: "Risk detected", date: "Feb 21, 2026" }],
  },
  {
    id: "rr7",
    title: "QA double-booking resolved",
    synthesis: "QA team was scheduled for both the mobile release regression and the web hotfix cycle simultaneously. After flagging, Dave reallocated one QA engineer to focus exclusively on the hotfix, unblocking both tracks.",
    suggestedAction: "No further action needed.",
    severity: "high",
    type: "timeline",
    status: "resolved",
    people: [
      { name: "Dave Wilson", initials: "DW", role: "Design Lead" },
      { name: "QA Team", initials: "QA", role: "Quality Assurance" },
    ],
    detectedDate: "Feb 15, 2026",
    lastUpdated: "Feb 19, 2026",
    resolvedDate: "Feb 19, 2026",
    resolvedNote: "Dave reallocated QA resources. Both tracks are now unblocked.",
    sources: [{ type: "meeting", title: "Release Planning", date: "Feb 15, 2026", participants: ["Dave Wilson", "QA Team"] }],
    relatedRiskIds: [],
    activity: [
      { action: "Risk detected", date: "Feb 15, 2026" },
      { action: "Resolved", date: "Feb 19, 2026", actor: "Dave Wilson" },
    ],
  },
  {
    id: "rr8",
    title: "Stale onboarding docs",
    synthesis: "The developer onboarding guide still references v1 API endpoints that were deprecated last quarter. New hires spend ~2 hours debugging before discovering the correct v2 endpoints. Low urgency since the next hire starts in 3 weeks.",
    suggestedAction: "Update the onboarding guide to reference v2 endpoints before the next hire's start date (March 10).",
    severity: "low",
    type: "documentation",
    status: "snoozed",
    snoozedUntil: "Mar 3, 2026",
    people: [{ name: "Engineering Team", initials: "ET", role: "Engineering" }],
    detectedDate: "Feb 14, 2026",
    lastUpdated: "Feb 20, 2026",
    sources: [{ type: "document", title: "Developer Onboarding Guide", date: "Jan 5, 2026" }],
    relatedRiskIds: ["rr5"],
    activity: [
      { action: "Risk detected", date: "Feb 14, 2026" },
      { action: "Snoozed until Mar 3", date: "Feb 20, 2026", actor: "Shaurya" },
    ],
  },
  {
    id: "rr9",
    title: "Data pipeline unowned",
    synthesis: "Following the January reorg, the data pipeline that feeds the analytics dashboard has no clear owner. Both the Data team and Platform team assume the other is maintaining it. A silent failure last week went unnoticed for 6 hours.",
    suggestedAction: "Assign a DRI for the data pipeline in the next engineering leads sync.",
    severity: "high",
    type: "ownership",
    status: "active",
    people: [
      { name: "Alice Johnson", initials: "AJ", role: "VP Engineering" },
      { name: "Data Team", initials: "DT", role: "Data Engineering" },
    ],
    detectedDate: "Feb 21, 2026",
    lastUpdated: "Feb 21, 2026",
    sources: [
      { type: "meeting", title: "Engineering Leads Sync", date: "Feb 21, 2026", participants: ["Alice Johnson", "Platform team", "Data team"], excerpt: "Alice: 'Who owns the analytics pipeline now?' [silence]" },
      { type: "slack", title: "#incidents channel", date: "Feb 19, 2026", excerpt: "Bot: 'Analytics dashboard data stale for 6h. No owner responded to page.'" },
    ],
    relatedRiskIds: [],
    activity: [{ action: "Risk detected", date: "Feb 21, 2026" }],
  },
];

/* ═══════════════════════════════════════
   Helpers
   ═══════════════════════════════════════ */

function getWeekLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7));
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  const fmt = (dt: Date) => dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const year = friday.getFullYear();
  return `Week of ${fmt(monday)}–${fmt(friday)}, ${year}`;
}

function getMonthLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function groupReportsByWeek(list: ReportData[]): { label: string; items: ReportData[] }[] {
  const groups: Map<string, ReportData[]> = new Map();
  for (const r of list) {
    const label = r.type === "monthly" ? getMonthLabel(r.date) : getWeekLabel(r.date);
    const existing = groups.get(label);
    if (existing) existing.push(r);
    else groups.set(label, [r]);
  }
  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
}

function timeAgo(dateStr: string): string {
  const now = new Date("2026-02-21T12:00:00");
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

/* ═══════════════════════════════════════
   Report Card (from WeeklyReportsPage)
   ═══════════════════════════════════════ */

function ReportCard({
  report, isSelected, onClick, buttonRef,
}: {
  report: ReportData; isSelected: boolean; onClick: () => void; buttonRef?: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      type="button"
      ref={buttonRef}
      className={`${styles.card} ${isSelected ? styles.cardSelected : ""}`}
      onClick={onClick}
    >
      <div className={styles.cardTop}>
        <div className={styles.cardTopLeft}>
          <h3 className={styles.cardTitle}>{report.title}</h3>
          <p className={styles.cardSummary}>{report.summary}</p>
        </div>
        <div className={styles.cardTopRight}>
          <Badge variant={report.status === "published" ? "info" : "secondary"} size="sm">
            {report.status === "published" ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>
      <div className={styles.cardChin}>
        <span className={styles.chinItem}><CalendarIcon />{report.date}</span>
        <span className={styles.chinDot}>&middot;</span>
        <span className={styles.chinItem}>{report.meetingsAnalyzed} meetings</span>
        <span className={styles.chinDot}>&middot;</span>
        <span className={styles.chinItem}>{report.actionItems} action items</span>
        <span className={styles.chinDot}>&middot;</span>
        <span className={styles.chinItem}><PeopleIcon />{report.participants.length}</span>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════
   Report Detail Panel
   ═══════════════════════════════════════ */

function ReportDetailView({ report, onBack }: { report: ReportData; onBack: () => void }) {
  return (
    <div className={styles.page}>
      <TopBar
        breadcrumbs={[
          { label: "Reports", onClick: onBack },
          { label: report.title.length > 50 ? report.title.slice(0, 47) + "..." : report.title },
        ]}
      />
      <div className={styles.detailContent}>
        <div className={styles.detailInner}>
          <div className={styles.detailHeader}>
            <h1 className={styles.detailTitle}>{report.title}</h1>
            <div className={styles.detailMeta}>
              <Badge variant={report.status === "published" ? "info" : "secondary"} size="sm">
                {report.status === "published" ? "Published" : "Draft"}
              </Badge>
              <span className={styles.detailMetaText}>{report.date}</span>
              <span className={styles.detailMetaSep}>&middot;</span>
              <span className={styles.detailMetaText}>{report.type === "weekly" ? "Weekly Report" : "Monthly Report"}</span>
            </div>
          </div>

          <div className={styles.detailStats}>
            <div className={styles.detailStatItem}>
              <span className={styles.detailStatValue}>{report.meetingsAnalyzed}</span>
              <span className={styles.detailStatLabel}>meetings</span>
            </div>
            <span className={styles.detailStatSep} />
            <div className={styles.detailStatItem}>
              <span className={styles.detailStatValue}>{report.actionItems}</span>
              <span className={styles.detailStatLabel}>action items</span>
            </div>
            <span className={styles.detailStatSep} />
            <div className={styles.detailStatItem}>
              <span className={styles.detailStatValue}>{report.keyDecisions}</span>
              <span className={styles.detailStatLabel}>decisions</span>
            </div>
            <span className={styles.detailStatSep} />
            <div className={styles.detailStatItem}>
              <span className={styles.detailStatValue}>{report.participants.length}</span>
              <span className={styles.detailStatLabel}>contributors</span>
            </div>
          </div>

          <Separator />

          <div className={styles.markdownSection}>
            <Markdown content={report.highlights} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Risk Card (compact, for inline lists)
   ═══════════════════════════════════════ */

function RiskCardCompact({ alert, onClick, showRiskBadge }: { alert: RiskAlert; onClick: () => void; showRiskBadge?: boolean }) {
  const sev = alert.severity;
  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onClick()}>
      <div className={styles.cardTop}>
        <div className={styles.cardTopLeft}>
          <div className={styles.riskTitleRow}>
            <span className={
              sev === "critical" ? styles.severityTag_critical
              : sev === "high" ? styles.severityTag_high
              : sev === "medium" ? styles.severityTag_medium
              : styles.severityTag_low
            }>
              <span className={styles.severityTagDot} />
              {sev === "critical" ? "Critical" : sev === "high" ? "High" : sev === "medium" ? "Medium" : "Low"}
            </span>
            <h3 className={styles.cardTitle}>{alert.title}</h3>
          </div>
          <p className={styles.cardSummary}>{alert.synthesis}</p>
        </div>
      </div>
      <div className={styles.cardChin}>
        <span className={styles.chinItem}><SourceIcon width={11} height={11} />{alert.sources.length} {alert.sources.length === 1 ? "source" : "sources"}</span>
        <span className={styles.chinDot}>&middot;</span>
        <span className={styles.chinItem}>{timeAgo(alert.detectedDate)}</span>
        <span className={styles.chinDot}>&middot;</span>
        <span className={styles.chinItem}>{alert.people.map((p) => p.name).join(", ")}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Main Component
   ═══════════════════════════════════════ */

export function ReportsPage({ onOpenChat }: { onOpenChat?: () => void } = {}) {
  const [view, setView] = useState<"all" | "risks">("all");
  const [tab, setTab] = useState("all");
  const [sort, setSort] = useState("newest");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const lastSelectedRef = useRef<string | null>(null);
  const rowRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const reports = extendedReports;
  const alerts = initialAlerts;

  const filteredReports = useMemo(() => {
    let list = reports;
    if (tab === "published") list = list.filter((r) => r.status === "published");
    if (tab === "drafts") list = list.filter((r) => r.status === "draft");
    if (sort === "newest") list = [...list].sort((a, b) => b.date.localeCompare(a.date));
    if (sort === "oldest") list = [...list].sort((a, b) => a.date.localeCompare(b.date));
    return list;
  }, [reports, tab, sort]);

  const selectedReport = selectedReportId ? reports.find((r) => r.id === selectedReportId) ?? null : null;

  const activeAlerts = useMemo(() => alerts.filter((a) => a.status === "active"), [alerts]);
  const criticalHighAlerts = useMemo(() => activeAlerts.filter((a) => a.severity === "critical" || a.severity === "high"), [activeAlerts]);
  const snoozedAlerts = useMemo(() => alerts.filter((a) => a.status === "snoozed"), [alerts]);
  const resolvedAlerts = useMemo(() => alerts.filter((a) => a.status === "resolved" || a.status === "dismissed"), [alerts]);

  const handleSelectReport = useCallback((id: string) => {
    lastSelectedRef.current = id;
    setSelectedReportId(id);
    setSelectedRiskId(null);
  }, []);

  const handleBack = useCallback(() => {
    const rowId = lastSelectedRef.current;
    setSelectedReportId(null);
    setSelectedRiskId(null);
    if (!rowId) return;
    window.requestAnimationFrame(() => { rowRefs.current[rowId]?.focus(); });
  }, []);

  useEffect(() => {
    if (!selectedReport) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); handleBack(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedReport, handleBack]);

  const publishedCount = reports.filter((r) => r.status === "published").length;
  const draftsCount = reports.filter((r) => r.status === "draft").length;

  const reportTabItems = [
    { value: "all", label: "All", count: reports.length },
    { value: "published", label: "Published", count: publishedCount },
    { value: "drafts", label: "Drafts", count: draftsCount },
  ];

  const viewToggleItems = [
    { value: "all", label: "All Reports" },
    { value: "risks", label: "Risks" },
  ];

  const handleRiskClick = useCallback((_id: string) => {
    setSelectedRiskId(_id);
  }, []);

  if (selectedReport) {
    return <ReportDetailView report={selectedReport} onBack={handleBack} />;
  }

  return (
    <div className={styles.page}>
      <TopBar
        breadcrumbs={[{ label: "Reports" }]}
        actions={
          <>
            {view === "all" && (
              <>
                <ToggleButtonGroup items={reportTabItems} value={tab} onChange={(v) => setTab(v as string)} size="sm" />
                <div style={{ width: 140 }}>
                  <Select value={sort} onValueChange={setSort} size="sm">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest first</SelectItem>
                      <SelectItem value="oldest">Oldest first</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <Button variant="primary" size="sm"><PlusIcon /> New Report</Button>
            {onOpenChat && (
              <Button variant="secondary" size="sm" onClick={onOpenChat}>
                <AiSparkle width={14} height={14} />
                Open Chat
              </Button>
            )}
          </>
        }
      />

      <div className={styles.contentArea}>
        <div className={styles.listPanel}>
          <div className={styles.listInner}>
            <div className={styles.pageHeader}>
              <div className={styles.pageHeaderRow}>
                <h1 className={styles.pageTitle}>Reports</h1>
                <div className={styles.viewToggle}>
                  <ToggleButtonGroup
                    items={viewToggleItems}
                    value={view}
                    onChange={(v) => setView(v as "all" | "risks")}
                    size="sm"
                  />
                </div>
              </div>
              <p className={styles.pageDesc}>
                {view === "all"
                  ? "Weekly summaries, monthly reports, and high-priority risks in one place."
                  : "All active risks, snoozed items, and resolved alerts."}
              </p>
            </div>

            <FeatureBanner storageKey="reports">
              AI-generated reports and risk detection from your meetings and data.
            </FeatureBanner>
          </div>

          {view === "all" ? (
            <>
              <div className={styles.listInner}>
                {criticalHighAlerts.length > 0 && (
                  <>
                    <div className={styles.groupHeader}>
                      <span className={styles.groupLabel}>Attention Needed</span>
                      <span className={styles.groupCount}>{criticalHighAlerts.length}</span>
                    </div>
                    <div className={styles.groupItems}>
                      {criticalHighAlerts.map((alert) => (
                        <RiskCardCompact key={alert.id} alert={alert} onClick={() => handleRiskClick(alert.id)} showRiskBadge />
                      ))}
                    </div>
                    <Separator className={styles.sectionDivider} />
                  </>
                )}
                {filteredReports.length === 0 ? (
                  <div className={styles.noResults}>
                    <p className={styles.noResultsText}>No reports found</p>
                    <p className={styles.noResultsHint}>Try a different filter.</p>
                  </div>
                ) : (
                  <div className={styles.timeline}>
                    {groupReportsByWeek(filteredReports).map((group) => (
                      <div key={group.label} className={styles.weekGroup}>
                        <div className={styles.weekHeader}>
                          <span className={styles.weekPill}>
                            {group.label}
                            <span className={styles.weekCount}>{group.items.length}</span>
                          </span>
                        </div>
                        <div className={styles.weekItems}>
                          {group.items.map((report) => (
                            <ReportCard
                              key={report.id}
                              report={report}
                              isSelected={false}
                              onClick={() => handleSelectReport(report.id)}
                              buttonRef={(el) => { rowRefs.current[report.id] = el; }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.listInner}>
              {activeAlerts.length === 0 && snoozedAlerts.length === 0 && resolvedAlerts.length === 0 && (
                <div className={styles.noResults}>
                  <WarningIcon width={20} height={20} />
                  <p className={styles.noResultsText}>No risks detected.</p>
                </div>
              )}

              {(["critical", "high", "medium", "low"] as Severity[]).map((sev) => {
                const items = activeAlerts.filter((a) => a.severity === sev);
                if (items.length === 0) return null;
                const label = sev.charAt(0).toUpperCase() + sev.slice(1);
                return (
                  <div key={sev} className={styles.statusGroup}>
                    <div className={styles.groupHeader}>
                      <span className={styles.groupLabel}>{label}</span>
                      <span className={styles.groupCount}>{items.length}</span>
                    </div>
                    <div className={styles.groupItems}>
                      {items.map((alert) => (
                        <RiskCardCompact key={alert.id} alert={alert} onClick={() => handleRiskClick(alert.id)} />
                      ))}
                    </div>
                  </div>
                );
              })}

              {snoozedAlerts.length > 0 && (
                <div className={styles.statusGroup}>
                  <div className={styles.groupHeader}>
                    <span className={styles.groupLabel}>Snoozed</span>
                    <span className={styles.groupCount}>{snoozedAlerts.length}</span>
                  </div>
                  <div className={styles.groupItems}>
                    {snoozedAlerts.map((alert) => (
                      <div key={alert.id} className={`${styles.card} ${styles.cardInactive}`} onClick={() => handleRiskClick(alert.id)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && handleRiskClick(alert.id)}>
                        <div className={styles.cardTop}>
                          <div className={styles.cardTopLeft}>
                            <h3 className={styles.cardTitle}>{alert.title}</h3>
                            <p className={styles.cardSummary}>{alert.synthesis}</p>
                          </div>
                        </div>
                        <div className={styles.cardChin}>
                          {alert.snoozedUntil && (
                            <span className={styles.chinItem}><ClockIcon width={11} height={11} /> {alert.snoozedUntil}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resolvedAlerts.length > 0 && (
                <div className={styles.statusGroup}>
                  <div className={styles.groupHeader}>
                    <span className={styles.groupLabel}>Resolved</span>
                    <span className={styles.groupCount}>{resolvedAlerts.length}</span>
                  </div>
                  <div className={styles.groupItems}>
                    {resolvedAlerts.map((alert) => (
                      <div key={alert.id} className={`${styles.card} ${styles.cardInactive}`} onClick={() => handleRiskClick(alert.id)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && handleRiskClick(alert.id)}>
                        <div className={styles.cardTop}>
                          <div className={styles.cardTopLeft}>
                            <h3 className={styles.cardTitle}>{alert.title}</h3>
                            <p className={styles.cardSummary}>{alert.synthesis}</p>
                          </div>
                        </div>
                        <div className={styles.cardChin}>
                          <span className={styles.chinItem}><CheckCircle width={11} height={11} /> Resolved {alert.resolvedDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
