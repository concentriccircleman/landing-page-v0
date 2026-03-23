import { useState, useMemo, useCallback, useRef } from "react";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Input } from "../components/Input";
import { Avatar } from "../components/Avatar";
import { Separator } from "../components/Separator";
import { Markdown } from "../components/Markdown";
import { TopBar } from "../components/TopBar";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "../components/Select";
import {
  Plus as PlusIcon,
  People as PeopleIcon,
  Cog as SettingsIcon,
  AiSparkle,
  Calendar as CalendarIcon,
} from "../icons/outline";
import styles from "./WeeklyReportsPage.module.css";

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
  citations?: Array<{ id: number; label: string; source: string; date: string }>;
}

interface Comment {
  id: string;
  author: { initials: string; name: string };
  text: string;
  date: string;
}

const mockComments: Record<string, Comment[]> = {
  r1: [
    { id: "c1", author: { initials: "AJ", name: "Alice Johnson" }, text: "Great progress on the migration! Can we get a breakdown of which components still need accessibility audits?", date: "Feb 15, 2026" },
    { id: "c2", author: { initials: "CD", name: "Carol Davis" }, text: "The token naming convention looks solid. Let's make sure we document the migration guide for the team.", date: "Feb 15, 2026" },
  ],
  r3: [
    { id: "c3", author: { initials: "DW", name: "Dave Wilson" }, text: "Build pipeline improvements are on track for next month. Should we include benchmarks in the next monthly?", date: "Feb 1, 2026" },
  ],
};

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
    citations: [
      { id: 1, label: "Q1 Planning", source: "Meeting", date: "Feb 10, 2026" },
      { id: 2, label: "Design Review", source: "Meeting", date: "Feb 12, 2026" },
      { id: 3, label: "Sprint Retro", source: "Meeting", date: "Feb 14, 2026" },
    ],
    highlights: `## Weekly Business Report

### Summary

This was a high-velocity execution week. The team completed the migration of 25 core components to the new design system, finalized the semantic token naming convention, and deployed the Review Tool for component approval. The foundation is now solid enough to begin assembling product pages. However, the remaining 45 components represent significant work, and the timeline to complete them before the Q1 launch target is tight.

### Unique Cross-Functional Insights & Decisions

- **Insight: CSS Modules chosen over Tailwind for component styling** [3]. *Impact:* This decision ensures component styles are fully scoped and eliminates class name collisions at scale. While Tailwind offers speed for prototyping, CSS Modules provide the encapsulation required for a design system consumed by multiple product surfaces. This choice also avoids a hard dependency on a third-party utility framework.
- **Insight: Semantic tokens adopted as the canonical color format** [2]. *Impact:* By using names like \`--fg-base\` and \`--bg-subtle\` instead of raw color values, we decouple the design language from specific palettes. This is essential for supporting dark mode, theming, and accessibility without rewriting component code. Every future theme change becomes a token swap, not a codebase refactor.
- **Insight: 4px grid established as the universal spacing system** [2]. *Impact:* A consistent spatial scale eliminates subjective spacing decisions, speeds up design-to-code handoff, and ensures visual harmony across all components. This is a foundational constraint that compounds in value as the system grows.

### Progress & Changes

Strong forward momentum across the design system migration. 25 of 70 components are fully migrated, the Review Tool is live and being used for approvals, and Code Connect mappings are in place for the first 10 atoms. The product assembly pipeline is ready to begin consuming these components for the first product page.

### Risks & Blockers

**RISK: Remaining 45 Component Migrations (Medium Severity)**

The Q1 target requires all 70 components migrated and approved. At the current pace of ~25/week, we are on track, but any disruption (team availability, scope creep, accessibility rework) could put the timeline at risk. The accessibility audit on the first 25 components may surface issues that require rework.

**RISK: Figma Code Connect Coverage Gap (Low Severity)**

Only the first 10 atoms have Code Connect mappings. Designers are working ahead of the mapped components, which may lead to inconsistencies between Figma designs and shipped code if the mapping backlog grows.

### Deep Dive: The Migration Velocity Challenge

The first 25 components were the most straightforward atoms — Button, Input, Badge, Card, etc. The remaining 45 include complex composites like DataTable, Calendar, MarkdownEditor, and MediaPlayer. These will require significantly more time per component for implementation, accessibility, and review. The team should expect velocity to slow and plan accordingly.

### Suggested Next Steps

1. **Prioritize composite components by product page dependency.** Start with components needed for the Weekly Reports page assembly, not alphabetical order.
2. **Parallelize accessibility audit and migration.** Run audits on batches of 10 instead of waiting for all 70 to complete.
3. **Set up Figma Code Connect automation** to reduce manual mapping overhead for the remaining 60 components.`,
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
    citations: [
      { id: 1, label: "Product Sync", source: "Meeting", date: "Feb 17, 2026" },
      { id: 2, label: "Design System Review", source: "Meeting", date: "Feb 19, 2026" },
    ],
    highlights: `## Weekly Business Report

### Summary

A landmark week — all 70 product UI components have been migrated to the new design system. The Review Tool was enhanced with persistence, dependency alerts, and version tracking. Product assembly infrastructure is in place and the first product pages are being built. The migration phase is effectively complete; the focus now shifts to product assembly and quality assurance.

### Unique Cross-Functional Insights & Decisions

- **Insight: Product assembly infrastructure is now the critical path.** *Impact:* With all components migrated, the bottleneck shifts from design system to product integration. Routes, DemoProvider, and the assembly pipeline are now the foundation that every product page depends on. Any instability here cascades to all downstream work.
- **Insight: Review Tool persistence prevents lost work.** [1] *Impact:* Adding localStorage persistence means reviewers can resume their work across sessions. This removes a major friction point that was causing incomplete reviews and repeated effort.

### Progress & Changes

All 70 components fully migrated and available in the design system. Review Tool enhanced with localStorage persistence, dependency alerts, and keyboard navigation. Product assembly infrastructure built: routes system, DemoProvider for mock data, and CLAUDE.md documentation. First product page (Weekly Reports) is actively being assembled.

### Risks & Blockers

**RISK: Product Assembly Quality (Medium Severity)**

Assembling product pages from 70 components introduces integration complexity. Components tested in isolation may behave differently when composed together. Edge cases in spacing, overflow, and responsive behavior are expected and will require dedicated QA time.

**RISK: Figma-to-Code Drift (Medium Severity, Rising)**

Code Connect mappings are still pending for 60 components [2]. As designers iterate in Figma while engineers build in code, the two sources of truth may diverge. Establishing mappings should be prioritized before the drift becomes costly to reconcile.

### Suggested Next Steps

1. **Complete the Weekly Reports page assembly** as the reference implementation for all future product pages.
2. **Begin Settings and Meeting Notes page assembly** in parallel.
3. **Schedule a full accessibility audit** across all 70 components before the Q1 launch gate.
4. **Establish Figma Code Connect mappings** for remaining 60 components to prevent design drift.`,
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
    highlights: `## Monthly Business Report

### Summary

January was the foundation month for the Sentra design system migration. The team established the core token architecture, created the component manifest for all 70 product components, built and deployed Review Tool v1, and completed the first 10 atom migrations. The month ended with a strong architectural foundation and clear execution path for February.

### Unique Cross-Functional Insights & Decisions

- **Insight: Token architecture is the foundation of everything.** *Impact:* The decision to invest heavily in a robust token system before migrating any components ensures that every future component inherits consistent theming, dark mode support, and accessibility compliance by default. This upfront cost saves exponential rework downstream.
- **Insight: Component manifest as the single source of truth.** *Impact:* Cataloging all 70 components with their dependencies, status, and ownership creates organizational clarity. Teams can now prioritize, parallelize, and track progress against a shared, authoritative list.
- **Insight: Review Tool v1 enables quality gates.** *Impact:* Building the review and approval workflow early in the process ensures that every migrated component meets the bar before it enters the system. This prevents quality debt from accumulating and reduces the cost of fixing issues later.

### Progress & Changes

Design system token architecture finalized with full dark mode support. Component manifest created covering all 70 product components. Review Tool v1 built, deployed, and in active use. First 10 atom components (Button, Input, Badge, Card, Label, Separator, Skeleton, Switch, Select, Dialog) migrated and approved.

### Risks & Blockers

**RISK: Migration Velocity Uncertainty (Medium Severity)**

The first 10 atoms were relatively simple. The remaining 60 components include complex composites whose migration time is harder to estimate. February planning should account for a potential slowdown.

**RISK: Design-Engineering Alignment (Low Severity)**

Figma designs and code implementations are currently maintained separately. Without Code Connect mappings, these may drift as the pace of work increases.

### Suggested Next Steps

1. **Accelerate component migration** to 25+ per week in February, starting with product-page dependencies.
2. **Establish Figma Code Connect** pipeline to keep design and code in sync.
3. **Begin product assembly planning** so page builds can start as soon as components are available.`,
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
    highlights: `## Weekly Business Report

### Summary

The team established the multi-pass component pipeline and delivered the first 10 atom components. This week validated the entire migration methodology — from token integration through visual review to accessibility audit. The pipeline is proven and ready to scale. All 10 atoms passed review on first submission, confirming that the upfront investment in architecture and process is paying off.

### Unique Cross-Functional Insights & Decisions

- **Insight: Multi-pass pipeline (spacing → elegance → interaction → accessibility) validated.** *Impact:* By decomposing component migration into four discrete passes, the team can parallelize work and catch issues earlier. Each pass has clear acceptance criteria, reducing ambiguity and rework. This methodology will scale to all remaining 60 components.
- **Insight: CSS Module patterns standardized across all components.** *Impact:* A consistent module pattern (one \`.module.css\` per component, token-only values, no magic numbers) ensures that any engineer can pick up any component and immediately understand its styling approach. This reduces onboarding time and review friction.

### Progress & Changes

Multi-pass component pipeline established and documented. First 10 atom components built: Button, Input, Badge, Card, Label, Separator, Skeleton, Switch, Select, and Dialog. All 10 passed visual review and accessibility audit. CSS Module patterns and design token integration confirmed working across all atoms.

### Risks & Blockers

**RISK: Pipeline Scalability (Low Severity)**

The pipeline was validated on simple atoms. More complex components (DataTable, Calendar, MarkdownEditor) may expose gaps in the process that require iteration. The team should plan for process refinement as complexity increases.

### Suggested Next Steps

1. **Scale migration to 25 components/week** now that the pipeline is proven.
2. **Prioritize components by product page dependency** rather than complexity.
3. **Document the multi-pass pipeline** so new team members can contribute independently.`,
  },
];

/* ── Week grouping ── */

function getWeekLabel(dateStr: string): string {
  const d = new Date(dateStr + " 12:00:00");
  const day = d.getDay();
  const mon = new Date(d);
  mon.setDate(d.getDate() - ((day + 6) % 7));
  const fri = new Date(mon);
  fri.setDate(mon.getDate() + 4);
  const fmt = (dt: Date) =>
    dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `Week of ${fmt(mon)}\u2013${fmt(fri)}`;
}

function getMonthLabel(dateStr: string): string {
  const d = new Date(dateStr + " 12:00:00");
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function groupByWeek(list: ReportData[]): { label: string; items: ReportData[] }[] {
  const groups: Map<string, ReportData[]> = new Map();
  for (const r of list) {
    const label = r.type === "monthly" ? getMonthLabel(r.date) : getWeekLabel(r.date);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(r);
  }
  return Array.from(groups, ([label, items]) => ({ label, items }));
}

/* ── Sidebar Report Item ── */

function SidebarReportItem({
  report,
  isSelected,
  onClick,
}: {
  report: ReportData;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.sidebarItem} ${isSelected ? styles.sidebarItemActive : ""}`}
      onClick={onClick}
    >
      <span className={styles.sidebarItemTitle}>{report.title}</span>
      <span className={styles.sidebarItemMeta}>
        {report.date}
        {report.status === "draft" && (
          <Badge variant="secondary" size="sm">Draft</Badge>
        )}
      </span>
    </button>
  );
}

/* ── Settings Dropdown ── */

function SettingsDropdown({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <>
      <div className={styles.settingsBackdrop} onClick={onClose} />
      <div className={styles.settingsDropdown}>
        <div className={styles.settingsTitle}>Report Settings</div>
        <Separator />
        <label className={styles.settingsRow}>
          <span>Auto-publish weekly reports</span>
          <input type="checkbox" defaultChecked />
        </label>
        <label className={styles.settingsRow}>
          <span>Include action items</span>
          <input type="checkbox" defaultChecked />
        </label>
        <label className={styles.settingsRow}>
          <span>Email notifications on publish</span>
          <input type="checkbox" />
        </label>
      </div>
    </>
  );
}

export function WeeklyReportsPage({ onOpenChat }: { onOpenChat?: () => void } = {}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sort, setSort] = useState("newest");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState<Record<string, Comment[]>>(mockComments);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const sorted = useMemo(() => {
    const list = [...extendedReports];
    if (sort === "newest") list.sort((a, b) => b.date.localeCompare(a.date));
    if (sort === "oldest") list.sort((a, b) => a.date.localeCompare(b.date));
    return list;
  }, [sort]);

  const selectedReport = selectedId
    ? (extendedReports.find((r) => r.id === selectedId) ?? null)
    : null;
  const comments = selectedReport ? (localComments[selectedReport.id] ?? []) : [];

  const handleAddComment = useCallback(() => {
    if (!commentText.trim() || !selectedReport) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: { initials: "SH", name: "Shaurya" },
      text: commentText.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setLocalComments((prev) => ({
      ...prev,
      [selectedReport.id]: [...(prev[selectedReport.id] ?? []), newComment],
    }));
    setCommentText("");
  }, [commentText, selectedReport]);

  return (
    <div className={styles.page}>
      <TopBar
        breadcrumbs={
          selectedReport
            ? [
                { label: "Weekly Reports", onClick: () => setSelectedId(null) },
                { label: selectedReport.title },
              ]
            : [{ label: "Weekly Reports" }]
        }
        actions={
          <>
            <div style={{ width: 130 }}>
              <Select value={sort} onValueChange={setSort} size="sm">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div style={{ position: "relative" }}>
              <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(!settingsOpen)}>
                <SettingsIcon width={14} height={14} />
              </Button>
              <SettingsDropdown open={settingsOpen} onClose={() => setSettingsOpen(false)} />
            </div>
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

      {!selectedReport ? (
        /* ── Landing: grouped report cards (matches Reports page) ── */
        <div className={styles.landingScroll}>
          <div className={styles.landingInner}>
            {groupByWeek(sorted).map((group) => (
              <div key={group.label} className={styles.weekGroup}>
                <div className={styles.weekHeader}>
                  <span className={styles.weekPill}>
                    {group.label}
                    <span className={styles.weekCount}>{group.items.length}</span>
                  </span>
                </div>
                <div className={styles.weekItems}>
                  {group.items.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={styles.card}
                      onClick={() => setSelectedId(r.id)}
                    >
                      <div className={styles.cardTop}>
                        <div className={styles.cardTopLeft}>
                          <h3 className={styles.cardTitle}>{r.title}</h3>
                          <p className={styles.cardSummary}>{r.summary}</p>
                        </div>
                        <div className={styles.cardTopRight}>
                          <Badge variant={r.status === "published" ? "info" : "secondary"} size="sm">
                            {r.status === "published" ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </div>
                      <div className={styles.cardChin}>
                        <span className={styles.chinItem}><CalendarIcon width={12} height={12} />{r.date}</span>
                        <span className={styles.chinDot}>&middot;</span>
                        <span className={styles.chinItem}>{r.meetingsAnalyzed} meetings</span>
                        <span className={styles.chinDot}>&middot;</span>
                        <span className={styles.chinItem}>{r.actionItems} action items</span>
                        <span className={styles.chinDot}>&middot;</span>
                        <span className={styles.chinItem}><PeopleIcon width={12} height={12} />{r.participants.length}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── Detail: sidebar + article ── */
        <div className={styles.splitLayout}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <span className={styles.sidebarLabel}>Reports</span>
              <span className={styles.sidebarCount}>{extendedReports.length}</span>
            </div>
            <div className={styles.sidebarList}>
              {sorted.map((r) => (
                <SidebarReportItem
                  key={r.id}
                  report={r}
                  isSelected={selectedId === r.id}
                  onClick={() => setSelectedId(r.id)}
                />
              ))}
            </div>
          </aside>

          <main className={styles.articleArea}>
            <article className={styles.article} key={selectedReport.id}>
              <header className={styles.articleHeader}>
                <h1 className={styles.articleTitle}>{selectedReport.title}</h1>
                <div className={styles.articleMeta}>
                  <Badge variant={selectedReport.status === "published" ? "info" : "secondary"} size="sm">
                    {selectedReport.status === "published" ? "Published" : "Draft"}
                  </Badge>
                  <span className={styles.articleMetaText}>{selectedReport.date}</span>
                  <span className={styles.articleMetaSep}>&middot;</span>
                  <span className={styles.articleMetaText}>
                    {selectedReport.type === "weekly" ? "Weekly Report" : "Monthly Report"}
                  </span>
                  <span className={styles.articleMetaSep}>&middot;</span>
                  <span className={styles.articleMetaText}>
                    <PeopleIcon width={12} height={12} style={{ verticalAlign: "-2px", marginRight: 2 }} />
                    {selectedReport.participants.map((p) => p.name).join(", ")}
                  </span>
                </div>
              </header>

              <Separator />

              <div className={styles.markdownSection}>
                <Markdown content={selectedReport.highlights} />
              </div>

              {selectedReport.citations && selectedReport.citations.length > 0 && (
                <div className={styles.citationsSection}>
                  <h3 className={styles.citationsTitle}>Sources</h3>
                  <div className={styles.citationsList}>
                    {selectedReport.citations.map((c) => (
                      <div key={c.id} className={styles.citationRow}>
                        <span className={styles.citationNumber}>[{c.id}]</span>
                        <span className={styles.citationLabel}>{c.label}</span>
                        <Badge variant="outline" size="sm">{c.source}</Badge>
                        <span className={styles.citationDate}>{c.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div className={styles.commentsSection}>
                <h3 className={styles.commentsTitle}>
                  Comments
                  {comments.length > 0 && <span className={styles.commentsCount}>{comments.length}</span>}
                </h3>
                {comments.length > 0 && (
                  <div className={styles.commentsList}>
                    {comments.map((c) => (
                      <div key={c.id} className={styles.commentRow}>
                        <Avatar content="letters" initials={c.author.initials} size="28" />
                        <div className={styles.commentBody}>
                          <div className={styles.commentMeta}>
                            <span className={styles.commentAuthor}>{c.author.name}</span>
                            <span className={styles.commentDate}>{c.date}</span>
                          </div>
                          <p className={styles.commentText}>{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className={styles.commentInput}>
                  <Avatar content="letters" initials="SH" size="28" />
                  <Input
                    ref={commentInputRef}
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    size="sm"
                    onKeyDown={(e) => { if (e.key === "Enter") handleAddComment(); }}
                  />
                  <Button variant="primary" size="sm" onClick={handleAddComment} disabled={!commentText.trim()}>
                    Post
                  </Button>
                </div>
              </div>
            </article>
          </main>
        </div>
      )}
    </div>
  );
}
