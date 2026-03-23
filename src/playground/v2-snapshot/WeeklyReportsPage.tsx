import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "../../components/Select";
import { Separator } from "../../components/Separator";
import { Markdown } from "../../components/Markdown";
import { TopBar } from "../../components/TopBar";
import { ToggleButtonGroup } from "../../components/ToggleButtonGroup";
import { Plus as PlusIcon, CalendarMini as CalendarIcon, People as PeopleIcon, AiSparkle } from "../../icons/outline";
import { FeatureBanner } from "../FeatureBanner";
import styles from "../WeeklyReportsPage.module.css";

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

function getWeekLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7));
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  const fmt = (dt: Date) =>
    dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const year = friday.getFullYear();
  return `Week of ${fmt(monday)}–${fmt(friday)}, ${year}`;
}

function getMonthLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function groupReportsByWeek(
  list: ReportData[]
): { label: string; items: ReportData[] }[] {
  const groups: Map<string, ReportData[]> = new Map();
  for (const r of list) {
    const label =
      r.type === "monthly" ? getMonthLabel(r.date) : getWeekLabel(r.date);
    const existing = groups.get(label);
    if (existing) existing.push(r);
    else groups.set(label, [r]);
  }
  return Array.from(groups.entries()).map(([label, items]) => ({
    label,
    items,
  }));
}

function ReportCard({
  report,
  isSelected,
  onClick,
  buttonRef,
}: {
  report: ReportData;
  isSelected: boolean;
  onClick: () => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
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
          <Badge
            variant={report.status === "published" ? "info" : "secondary"}
            size="sm"
          >
            {report.status === "published" ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>
      <div className={styles.cardChin}>
        <span className={styles.chinItem}>
          <CalendarIcon />
          {report.date}
        </span>
        <span className={styles.chinDot}>&middot;</span>
        <span className={styles.chinItem}>
          {report.meetingsAnalyzed} meetings
        </span>
        <span className={styles.chinDot}>&middot;</span>
        <span className={styles.chinItem}>
          {report.actionItems} action items
        </span>
        <span className={styles.chinDot}>&middot;</span>
        <span className={styles.chinItem}>
          <PeopleIcon />
          {report.participants.length}
        </span>
      </div>
    </button>
  );
}

function ReportDetailView({
  report,
  onBack,
}: {
  report: ReportData;
  onBack: () => void;
}) {
  return (
    <div className={styles.page}>
      <TopBar
        breadcrumbs={[
          { label: "Weekly Reports", onClick: onBack },
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
              <span className={styles.detailMetaText}>
                {report.type === "weekly" ? "Weekly Report" : "Monthly Report"}
              </span>
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

export function WeeklyReportsPage({ onOpenChat }: { onOpenChat?: () => void } = {}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState("all");
  const [sort, setSort] = useState("newest");
  const lastSelectedRef = useRef<string | null>(null);
  const rowRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const reports = extendedReports;

  const filtered = useMemo(() => {
    let list = reports;
    if (tab === "published") list = list.filter((r) => r.status === "published");
    if (tab === "drafts") list = list.filter((r) => r.status === "draft");
    if (sort === "newest") list = [...list].sort((a, b) => b.date.localeCompare(a.date));
    if (sort === "oldest") list = [...list].sort((a, b) => a.date.localeCompare(b.date));
    return list;
  }, [reports, tab, sort]);

  const selectedReport = selectedId ? reports.find((r) => r.id === selectedId) ?? null : null;

  const handleSelect = useCallback((id: string) => {
    lastSelectedRef.current = id;
    setSelectedId(id);
  }, []);

  const handleClose = useCallback(() => {
    const rowId = lastSelectedRef.current;
    setSelectedId(null);
    if (!rowId) return;
    window.requestAnimationFrame(() => {
      rowRefs.current[rowId]?.focus();
    });
  }, []);

  useEffect(() => {
    if (!selectedReport) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedReport, handleClose]);

  if (selectedReport) {
    return (
      <ReportDetailView
        report={selectedReport}
        onBack={handleClose}
      />
    );
  }

  const publishedCount = reports.filter((r) => r.status === "published").length;
  const draftsCount = reports.filter((r) => r.status === "draft").length;

  const tabItems = [
    { value: "all", label: "All", count: reports.length },
    { value: "published", label: "Published", count: publishedCount },
    { value: "drafts", label: "Drafts", count: draftsCount },
  ];

  return (
    <div className={styles.page}>
      <TopBar
        breadcrumbs={[{ label: "Weekly Reports" }]}
        actions={
          <>
            <ToggleButtonGroup
              items={tabItems}
              value={tab}
              onChange={(v) => setTab(v as string)}
              size="sm"
            />
            <div style={{ width: 140 }}>
              <Select value={sort} onValueChange={setSort} size="sm">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="primary" size="sm">
              <PlusIcon /> New Report
            </Button>
            {onOpenChat && (
              <Button variant="secondary" size="sm" onClick={onOpenChat}>
                <AiSparkle width={14} height={14} />
                Open Chat
              </Button>
            )}
          </>
        }
      />

      <div className={styles.content}>
        <div className={styles.listInner}>
          {filtered.length === 0 ? (
            <div className={styles.noResults}>
              <p className={styles.noResultsText}>No reports found</p>
              <p className={styles.noResultsHint}>Try a different filter.</p>
            </div>
          ) : (
            <>
              <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Weekly Reports</h1>
                <p className={styles.pageDesc}>Summaries of meetings, decisions, and action items by week.</p>
              </div>
              <FeatureBanner storageKey="weekly-reports">
                Auto-generated summaries of your team's meetings, decisions, and progress each week.
              </FeatureBanner>
              <div className={styles.timeline}>
                {groupReportsByWeek(filtered).map((group) => (
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
                          onClick={() => handleSelect(report.id)}
                          buttonRef={(el) => {
                            rowRefs.current[report.id] = el;
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
