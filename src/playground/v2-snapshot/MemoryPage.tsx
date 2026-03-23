import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Separator } from "../../components/Separator";
import { TopBar } from "../../components/TopBar";
import { ToggleButtonGroup } from "../../components/ToggleButtonGroup";
import {
  XMark as CloseIcon,
  Link as LinkIcon,
  CheckCircle,
  ShieldCheck,
  AiSparkle,
  Calendar,
} from "../../icons/outline";
import { FeatureBanner } from "../FeatureBanner";
import styles from "../MemoryPage.module.css";

type MemoryType = "decision" | "rule" | "insight" | "event";

interface MemoryItem {
  id: string;
  type: MemoryType;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  source: string;
  confidence: "high" | "medium" | "low";
  relatedIds?: string[];
}

const memoryItems: MemoryItem[] = [
  {
    id: "mem15",
    type: "decision",
    title: "Launch timeline moved to March 28",
    summary:
      "After reviewing the remaining work on the design system migration, the team agreed to push the launch date from March 15 to March 28. This gives an extra buffer for QA and accessibility audits. The sales team has been notified and customer communications are being updated.",
    date: "Feb 20, 2026",
    tags: ["launch", "timeline", "decision"],
    source: "Leadership Sync",
    confidence: "high",
    relatedIds: ["mem5"],
  },
  {
    id: "mem5",
    type: "event",
    title: "Revenue target: $150K MRR by March",
    summary:
      "Q1 revenue target discussed. Current run rate at $120K MRR. Need to close 3 enterprise deals to hit target. Pipeline looks healthy with 5 deals in late-stage negotiations. Key risk is the Acme Corp deal which depends on the new evaluation features shipping on time.",
    date: "Feb 20, 2026",
    tags: ["revenue", "business", "target"],
    source: "Q1 Planning Review",
    confidence: "medium",
    relatedIds: ["mem15"],
  },
  {
    id: "mem6",
    type: "event",
    title: "Hiring plan: 2 engineers for Q2",
    summary:
      "Alice drafting hiring plan. Looking for senior React engineers with design system experience. Budget approved for two headcount. Job descriptions to be posted by end of week. Referral bonus increased to $5K. Target start date is April 15.",
    date: "Feb 20, 2026",
    tags: ["hiring", "team", "plan"],
    source: "Q1 Planning Review",
    confidence: "medium",
  },
  {
    id: "mem14",
    type: "insight",
    title: "Customer churn correlated with onboarding time",
    summary:
      "Analysis of Q4 churn data shows customers who take longer than 14 days to complete onboarding are 3x more likely to churn within 90 days. The product team should prioritize reducing time-to-value in the onboarding flow. Suggested intervention: automated check-ins at day 3, 7, and 10.",
    date: "Feb 19, 2026",
    tags: ["churn", "onboarding", "analytics"],
    source: "Customer Success Review",
    confidence: "high",
  },
  {
    id: "mem13",
    type: "rule",
    title: "All PRs require design review for UI changes",
    summary:
      "Any pull request that touches UI components or pages must have a design review approval before merging. This applies to both new features and bug fixes. Design team will aim for 24-hour turnaround on reviews. Use the 'needs-design-review' label in GitHub.",
    date: "Feb 19, 2026",
    tags: ["process", "design", "code-review"],
    source: "Engineering All-Hands",
    confidence: "high",
    relatedIds: ["mem3"],
  },
  {
    id: "mem1",
    type: "decision",
    title: "Key decision on token naming",
    summary:
      "Agreed to use semantic names (--fg-base) instead of color names (--gray-900). This applies to all tokens across the design system. Semantic naming makes it possible to support theming and dark mode without changing component code. All existing color references must be migrated.",
    date: "Feb 18, 2026",
    tags: ["design-system", "tokens", "decision"],
    source: "Design System Review",
    confidence: "high",
    relatedIds: ["mem4", "mem8"],
  },
  {
    id: "mem12",
    type: "event",
    title: "Acme Corp enterprise pilot kicked off",
    summary:
      "The Acme Corp pilot officially started with 50 seats. Their primary use case is meeting intelligence for their sales team. Key stakeholders: VP of Sales (John Davis) and CTO (Maria Lopez). Success criteria: 80% weekly active usage after 30 days. First check-in scheduled for March 5.",
    date: "Feb 18, 2026",
    tags: ["enterprise", "pilot", "sales"],
    source: "Customer Kickoff",
    confidence: "high",
    relatedIds: ["mem5"],
  },
  {
    id: "mem2",
    type: "decision",
    title: "CSS Modules over Tailwind",
    summary:
      "Team decided CSS Modules provide better co-location and design token integration than Tailwind. All new components must use .module.css files. Benefits: scoped styles, no runtime cost, direct token usage via var(). Existing Tailwind usage will be migrated incrementally.",
    date: "Feb 15, 2026",
    tags: ["architecture", "styling", "decision"],
    source: "Sprint Retro",
    confidence: "high",
    relatedIds: ["mem7", "mem1"],
  },
  {
    id: "mem11",
    type: "insight",
    title: "Meeting summaries most used on Mondays",
    summary:
      "Usage analytics show a 4x spike in meeting summary views on Monday mornings between 8-10am. Users are catching up on the previous week's meetings. This suggests we should prioritize the weekly digest email and ensure Monday morning performance is optimized.",
    date: "Feb 15, 2026",
    tags: ["analytics", "usage", "product"],
    source: "Product Analytics Review",
    confidence: "medium",
  },
  {
    id: "mem4",
    type: "rule",
    title: "4px grid spacing rule",
    summary:
      "All spacing values must be multiples of 4px using the --space-* token scale. Zero raw pixel values allowed in components. This ensures visual consistency across the entire product. The spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48px.",
    date: "Feb 14, 2026",
    tags: ["spacing", "design-system", "rule"],
    source: "Q1 Planning",
    confidence: "high",
    relatedIds: ["mem1"],
  },
  {
    id: "mem10",
    type: "decision",
    title: "API versioning strategy: URL path",
    summary:
      "After evaluating header-based vs URL-path versioning, the team chose URL path versioning (/api/v1/, /api/v2/) for clarity and ease of testing. Breaking changes will increment the major version. Non-breaking additions are allowed within a version.",
    date: "Feb 13, 2026",
    tags: ["api", "architecture", "backend"],
    source: "Architecture Review",
    confidence: "high",
  },
  {
    id: "mem3",
    type: "insight",
    title: "Figma workflow for component parity",
    summary:
      "Components in Figma should mirror the atomic hierarchy: atoms, molecules, organisms. Code Connect mappings will link React components to Figma nodes. This creates a single source of truth and ensures designers and engineers are always aligned on component structure and naming.",
    date: "Feb 12, 2026",
    tags: ["figma", "workflow", "design"],
    source: "Design Review",
    confidence: "high",
    relatedIds: ["mem13"],
  },
  {
    id: "mem8",
    type: "rule",
    title: "Dark mode via data-theme attribute",
    summary:
      "Dark mode implemented using [data-theme='dark'] on the root element. All tokens have light and dark variants in globals.css. Components must never use hardcoded colors — only token references. This ensures automatic dark mode support without per-component work.",
    date: "Feb 11, 2026",
    tags: ["dark-mode", "design-system", "tokens"],
    source: "Sprint Planning",
    confidence: "high",
    relatedIds: ["mem1"],
  },
  {
    id: "mem7",
    type: "decision",
    title: "No external UI libraries",
    summary:
      "All migrated components built from scratch using pure React, TypeScript, and CSS Modules. Replaces Radix UI, lucide-react, and other dependencies. This gives full control over accessibility, animation, and token integration. Bundle size reduced by ~40KB.",
    date: "Feb 10, 2026",
    tags: ["architecture", "decision", "dependencies"],
    source: "Design System Review",
    confidence: "high",
    relatedIds: ["mem2"],
  },
  {
    id: "mem9",
    type: "event",
    title: "Series A planning discussions started",
    summary:
      "Initial conversations with 3 VC firms for a potential Series A round in Q3. Target raise: $8-12M. Key metrics they're looking at: MRR growth rate, net retention, and enterprise pipeline. Board deck being prepared by CFO. No term sheets yet.",
    date: "Feb 7, 2026",
    tags: ["fundraising", "business", "strategy"],
    source: "Board Meeting",
    confidence: "low",
  },
  {
    id: "mem16",
    type: "rule",
    title: "Feature flags for all new features",
    summary:
      "All new user-facing features must be behind a feature flag before deployment. Use the LaunchDarkly SDK for flag management. Flags should follow the naming convention: team-feature-description (e.g., product-meeting-ai-summary). Flags older than 90 days should be cleaned up.",
    date: "Jan 30, 2026",
    tags: ["process", "deployment", "feature-flags"],
    source: "Engineering All-Hands",
    confidence: "high",
  },
  {
    id: "mem17",
    type: "insight",
    title: "Enterprise deals close faster with POC",
    summary:
      "Reviewing our closed deals from Q4, enterprises that went through a structured 2-week proof of concept closed 60% faster than those with standard demo-only sales cycles. The POC template should be standardized and offered proactively to all enterprise prospects.",
    date: "Jan 28, 2026",
    tags: ["sales", "enterprise", "process"],
    source: "Sales Retrospective",
    confidence: "medium",
    relatedIds: ["mem12"],
  },
];

const typeLabel: Record<MemoryType, string> = {
  decision: "Decision",
  rule: "Rule",
  insight: "Insight",
  event: "Event",
};

const typeIcon: Record<MemoryType, React.FC<{ width?: number; height?: number }>> = {
  decision: CheckCircle,
  rule: ShieldCheck,
  insight: AiSparkle,
  event: Calendar,
};

const typeDotColor: Record<MemoryType, string> = {
  decision: "var(--status-blue)",
  rule: "var(--status-green)",
  insight: "var(--status-purple)",
  event: "var(--status-yellow)",
};


const typeBadgeVariant: Record<MemoryType, "info" | "success" | "secondary" | "warning"> = {
  decision: "info",
  rule: "success",
  insight: "secondary",
  event: "warning",
};

const confidenceVariant: Record<string, "success" | "warning" | "secondary"> = {
  high: "success",
  medium: "warning",
  low: "secondary",
};

const allTypes: MemoryType[] = ["decision", "rule", "insight", "event"];

const typeToggleItems = allTypes.map((type) => ({
  value: type,
  label: typeLabel[type],
  count: memoryItems.filter((m) => m.type === type).length,
  dot: typeDotColor[type],
}));

function groupByDate(list: MemoryItem[]): { date: string; items: MemoryItem[] }[] {
  const groups: Map<string, MemoryItem[]> = new Map();
  for (const item of list) {
    const existing = groups.get(item.date);
    if (existing) {
      existing.push(item);
    } else {
      groups.set(item.date, [item]);
    }
  }
  return Array.from(groups.entries()).map(([date, entries]) => ({ date, items: entries }));
}

/* ── Timeline Row ── */

function TimelineRow({
  item,
  isSelected,
  onSelect,
  isFirst,
  isLast,
  buttonRef,
  detailPanelId,
}: {
  item: MemoryItem;
  isSelected: boolean;
  onSelect: () => void;
  isFirst: boolean;
  isLast: boolean;
  buttonRef?: (el: HTMLButtonElement | null) => void;
  detailPanelId: string;
}) {
  return (
    <div className={`${styles.row} ${isFirst ? styles.rowFirst : ""} ${isLast ? styles.rowLast : ""}`}>
      <div className={styles.rowLine}>
        <span className={styles.dot} style={{ background: typeDotColor[item.type], boxShadow: isSelected ? `0 0 6px ${typeDotColor[item.type]}` : undefined, transition: "box-shadow 200ms ease" }}>
          {(() => { const Icon = typeIcon[item.type]; return <Icon />; })()}
        </span>
      </div>

      <button
        type="button"
        className={`${styles.rowBtn} ${isSelected ? styles.rowSelected : ""}`}
        onClick={onSelect}
        aria-pressed={isSelected}
        aria-expanded={isSelected}
        aria-controls={detailPanelId}
        ref={buttonRef}
      >
        <span className={styles.rowTitle}>{item.title}</span>
        <p className={styles.rowPreview}>{item.summary}</p>
        <div className={styles.rowMeta}>
          <span className={styles.rowSource}>{item.source}</span>
          <span className={styles.rowMetaDot}>&middot;</span>
          <span className={styles.rowDate}>{item.date}</span>
        </div>
      </button>
    </div>
  );
}

/* ── Detail Panel (inline, two-panel) ── */

function DetailPanel({
  item,
  allItems,
  onClose,
  onNavigate,
  panelId,
}: {
  item: MemoryItem;
  allItems: MemoryItem[];
  onClose: () => void;
  onNavigate: (id: string) => void;
  panelId: string;
}) {
  const related = item.relatedIds
    ? item.relatedIds.map((rid) => allItems.find((m) => m.id === rid)).filter(Boolean) as MemoryItem[]
    : [];

  return (
    <div className={styles.detailPanel} role="region" aria-label={item.title} id={panelId}>
      <div className={styles.detailPanelHeader}>
        <span className={styles.detailPanelLabel}>Memory Detail</span>
        <button
          type="button"
          className={styles.closeBtnInner}
          onClick={onClose}
          aria-label="Close detail panel"
        >
          <CloseIcon />
        </button>
      </div>

      <div className={styles.detailContent} key={item.id}>
        <div className={styles.detailHeader}>
          <h2 className={styles.detailTitle}>{item.title}</h2>
          <div className={styles.detailMeta}>
            <Badge variant={typeBadgeVariant[item.type]} size="sm">
              {typeLabel[item.type]}
            </Badge>
            <span className={styles.detailMetaDot}>&middot;</span>
            <span className={styles.detailMetaText}>{item.date}</span>
            <span className={styles.detailMetaDot}>&middot;</span>
            <Badge variant={confidenceVariant[item.confidence]} size="sm">
              {item.confidence}
            </Badge>
            <span className={styles.detailMetaDot}>&middot;</span>
            <span className={styles.detailMetaText}>{item.source}</span>
          </div>
        </div>

        <Separator />

        <p className={styles.detailSummary}>{item.summary}</p>

        {item.tags.length > 0 && (
          <div className={styles.detailTags}>
            {item.tags.map((tag) => (
              <Badge key={tag} variant="outline" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <div className={styles.detailSection}>
            <h3 className={styles.detailSectionLabel}>Related Memories</h3>
            <div className={styles.relatedList}>
              {related.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={styles.relatedItem}
                  onClick={() => onNavigate(r.id)}
                  aria-label={`Open related memory: ${r.title}`}
                >
                  <LinkIcon />
                  <span className={styles.relatedTitle}>{r.title}</span>
                  <Badge variant={typeBadgeVariant[r.type]} size="sm">
                    {typeLabel[r.type]}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main page ── */

export function MemoryPage({ onOpenChat }: { onOpenChat?: () => void } = {}) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set());
  const rowRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lastSelectedRef = useRef<string | null>(null);
  const detailPanelId = "memory-detail-panel";

  const handleTypeChange = useCallback((next: Set<string> | string) => {
    setActiveTypes(next as Set<string>);
  }, []);

  const filtered = useMemo(() => {
    let list = memoryItems;
    if (activeTypes.size > 0) {
      list = list.filter((m) => activeTypes.has(m.type));
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.summary.toLowerCase().includes(q) ||
          m.tags.some((t) => t.includes(q)) ||
          m.type.includes(q)
      );
    }
    return list;
  }, [search, activeTypes]);

  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  const selectedItem = selectedId ? memoryItems.find((m) => m.id === selectedId) ?? null : null;

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

  const handleNavigate = useCallback((id: string) => {
    lastSelectedRef.current = id;
    setSelectedId(id);
  }, []);

  useEffect(() => {
    if (!selectedItem) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedItem, handleClose]);

  const topBarActions = (
    <>
      <ToggleButtonGroup
        items={typeToggleItems}
        value={activeTypes}
        onChange={handleTypeChange}
        multi
        size="sm"
      />
      <div className={styles.topBarSearch}>
        <Input
          placeholder="Search memories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="sm"
        />
      </div>
      {onOpenChat && (
        <Button variant="secondary" size="sm" onClick={onOpenChat}>
          <AiSparkle width={14} height={14} />
          Open Chat
        </Button>
      )}
    </>
  );

  return (
    <div className={styles.page}>
      <TopBar
        breadcrumbs={[{ label: `Memory (${memoryItems.length})` }]}
        actions={topBarActions}
      />

      <div className={styles.contentArea}>
        <div className={styles.listPanel}>
          <div className={styles.listInner}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Memory</h1>
              <p className={styles.pageDesc}>Decisions, events, and insights your team has captured over time.</p>
            </div>
            <FeatureBanner storageKey="memory">
              An ever-growing timeline of decisions, events, and insights captured from your work.
            </FeatureBanner>
            {filtered.length === 0 ? (
              <div className={styles.noResults}>
                <p className={styles.noResultsText}>No memories found</p>
                <p className={styles.noResultsHint}>Try a different search term or filter.</p>
              </div>
            ) : (
              <div className={styles.timelineInner}>
              <div className={styles.timeline}>
                {groups.map((group, gi) => {
                  const isLastGroup = gi === groups.length - 1;
                  return (
                    <div key={group.date} className={styles.dateGroup}>
                      <div className={styles.dateHeader}>
                        <span className={styles.datePill}>
                          {group.date}
                          <span className={styles.dateCount}>
                            {group.items.length}
                          </span>
                        </span>
                      </div>
                      {group.items.map((item, ii) => (
                        <TimelineRow
                          key={item.id}
                          item={item}
                          isSelected={selectedId === item.id}
                          onSelect={() => handleSelect(item.id)}
                          isFirst={gi === 0 && ii === 0}
                          isLast={isLastGroup && ii === group.items.length - 1}
                          detailPanelId={detailPanelId}
                          buttonRef={(el) => {
                            rowRefs.current[item.id] = el;
                          }}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Right panel: only appears once memory is selected */}
        {selectedItem ? (
          <div className={styles.detailPane}>
            <DetailPanel
              item={selectedItem}
              allItems={memoryItems}
              onClose={handleClose}
              onNavigate={handleNavigate}
              panelId={detailPanelId}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
