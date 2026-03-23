import { useState, useMemo, useCallback } from "react";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { Input } from "../../components/Input";
import { Separator } from "../../components/Separator";
import { TopBar } from "../../components/TopBar";
import { ToggleButtonGroup } from "../../components/ToggleButtonGroup";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../components/Select";
import {
  WarningExclamation as WarningIcon,
  ChevronDown,
  Calendar as CalendarIcon,
  ChatBubble as MessageIcon,
  CheckCircle,
  Users as PeopleIcon,
  Flag as FlagIcon,
  ThumbDown,
  Folder as SourceIcon,
  XMark,
  AiSparkle,
} from "../../icons/outline";

function ClockIcon(p: { width?: number; height?: number }) {
  return (
    <svg width={p.width ?? 13} height={p.height ?? 13} viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6.5" cy="6.5" r="5" />
      <path d="M6.5 3.5V6.5l2 1.5" />
    </svg>
  );
}
import { FeatureBanner } from "../FeatureBanner";
import styles from "../RiskRadarPage.module.css";

/* ═══════════════════════════════════════
   Types
   ═══════════════════════════════════════ */

type RiskType = "timeline" | "budget" | "priority" | "ownership" | "documentation" | "communication";
type RiskStatus = "active" | "snoozed" | "resolved" | "dismissed";
type Severity = "critical" | "high" | "medium" | "low";

interface Person {
  name: string;
  initials: string;
  role?: string;
}

interface RiskSource {
  type: "meeting" | "document" | "slack";
  title: string;
  date: string;
  participants?: string[];
  excerpt?: string;
}

interface ActivityEvent {
  action: string;
  date: string;
  actor?: string;
}

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
  sources: RiskSource[];
  relatedRiskIds: string[];
  snoozedUntil?: string;
  resolvedDate?: string;
  resolvedNote?: string;
  feedback?: "useful" | "not-useful";
  activity: ActivityEvent[];
}

/* ═══════════════════════════════════════
   Mock Data
   ═══════════════════════════════════════ */

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
    activity: [
      { action: "Risk detected", date: "Feb 20, 2026" },
    ],
  },
  {
    id: "rr3",
    title: "Sprint 5 priority conflict",
    synthesis: "Design team prioritized dark mode for Sprint 5 based on user feedback scores, but engineering flagged performance optimization as the top priority due to p95 latency hitting 3.2s. Both require the same frontend engineers and can't run concurrently in a single sprint.",
    suggestedAction: "Run a quick impact/effort matrix with Dave and Bob to determine which delivers more value this sprint. Consider splitting dark mode into CSS-only changes (low effort) vs. component refactors (high effort).",
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
    activity: [
      { action: "Risk detected", date: "Feb 19, 2026" },
    ],
  },
  {
    id: "rr4",
    title: "Feedback loop dual ownership",
    synthesis: "Both Carol and Frank independently claimed ownership of the customer feedback process in separate meetings. Neither has a documented handoff plan. This dual ownership risks duplicated outreach to customers and missed action items falling between the cracks.",
    suggestedAction: "Message Carol and Frank to establish a single DRI. Suggest Carol owns synthesis and Frank owns collection, with a shared Notion doc for tracking.",
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
    activity: [
      { action: "Risk detected", date: "Feb 18, 2026" },
    ],
  },
  {
    id: "rr5",
    title: "API versioning undocumented",
    synthesis: "Engineering discussed and agreed on a breaking-change versioning strategy during a standup, but the decision was never captured in the API docs or ADR repo. New team members onboarding next month won't know the convention, risking inconsistent implementations.",
    suggestedAction: "Ask the engineering lead to write a one-page ADR (Architecture Decision Record) for the versioning strategy and add it to the docs repo.",
    severity: "low",
    type: "documentation",
    status: "active",
    people: [
      { name: "Engineering Team", initials: "ET", role: "Engineering" },
    ],
    detectedDate: "Feb 17, 2026",
    lastUpdated: "Feb 17, 2026",
    sources: [
      { type: "meeting", title: "Daily Standup", date: "Feb 17, 2026", participants: ["Engineering team"], excerpt: "Lead: 'We're going with semantic versioning, breaking changes bump major. Everyone agreed? OK, moving on.'" },
    ],
    relatedRiskIds: [],
    activity: [
      { action: "Risk detected", date: "Feb 17, 2026" },
    ],
  },
  {
    id: "rr6",
    title: "Acme Corp deal at risk",
    synthesis: "Sales closed a verbal commitment from Acme Corp requiring SSO and audit logs by March. Product team is unaware and has neither feature on the current sprint plan. Without intervention, the deal could fall through at contract signing.",
    suggestedAction: "Set up a 15-min bridge between Sales (Lisa) and Product (Carol) to align on Acme Corp requirements and assess sprint impact.",
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
    activity: [
      { action: "Risk detected", date: "Feb 21, 2026" },
    ],
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
    sources: [
      { type: "meeting", title: "Release Planning", date: "Feb 15, 2026", participants: ["Dave Wilson", "QA Team"] },
    ],
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
    people: [
      { name: "Engineering Team", initials: "ET", role: "Engineering" },
    ],
    detectedDate: "Feb 14, 2026",
    lastUpdated: "Feb 20, 2026",
    sources: [
      { type: "document", title: "Developer Onboarding Guide", date: "Jan 5, 2026" },
    ],
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
    suggestedAction: "Assign a DRI for the data pipeline in the next engineering leads sync. Document the ownership in the service catalog.",
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
    activity: [
      { action: "Risk detected", date: "Feb 21, 2026" },
    ],
  },
];

/* ═══════════════════════════════════════
   Constants & Helpers
   ═══════════════════════════════════════ */

const severityColor: Record<Severity, string> = {
  critical: "var(--status-red)",
  high: "var(--fg-error)",
  medium: "var(--status-yellow)",
  low: "var(--fg-muted)",
};

const severityBadgeVariant: Record<Severity, "destructive" | "warning" | "secondary"> = {
  critical: "destructive",
  high: "destructive",
  medium: "warning",
  low: "secondary",
};

const statusBadgeVariant: Record<RiskStatus, "success" | "warning" | "secondary" | "info"> = {
  active: "info",
  snoozed: "warning",
  resolved: "success",
  dismissed: "secondary",
};

const typeLabel: Record<RiskType, string> = {
  timeline: "Timeline",
  budget: "Budget",
  priority: "Priority",
  ownership: "Ownership",
  documentation: "Documentation",
  communication: "Communication",
};

const sourceTypeLabel: Record<string, string> = {
  meeting: "Meeting",
  document: "Doc",
  slack: "Slack",
};

const snoozeOptions = [
  { label: "1 hour", value: "1h" },
  { label: "4 hours", value: "4h" },
  { label: "24 hours", value: "24h" },
  { label: "1 week", value: "1w" },
];

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
   Sub-Components
   ═══════════════════════════════════════ */

function AvatarChip({ person }: { person: Person }) {
  return (
    <span className={styles.avatarChip} title={`${person.name}${person.role ? ` — ${person.role}` : ""}`}>
      {person.initials}
    </span>
  );
}

function SnoozeDropdown({ onSnooze }: { onSnooze: (val: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.snoozeWrap}>
      <Button variant="ghost" size="sm" onClick={() => setOpen(!open)}>
        <ClockIcon width={13} height={13} /> Snooze <ChevronDown width={10} height={10} />
      </Button>
      {open && (
        <div className={styles.snoozeMenu}>
          {snoozeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={styles.snoozeOption}
              onClick={() => { onSnooze(opt.value); setOpen(false); }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   Risk Card
   ═══════════════════════════════════════ */

function RiskCard({
  alert,
  onOpen,
}: {
  alert: RiskAlert;
  onOpen: () => void;
}) {
  const isInactive = alert.status === "resolved" || alert.status === "dismissed" || alert.status === "snoozed";
  const isActive = alert.status === "active";

  return (
    <div
      className={`${styles.riskCard} ${isInactive ? styles.riskCardInactive : ""}`}
    >
      <button type="button" className={styles.riskCardMain} onClick={onOpen}>
        <div className={styles.riskCardTopRow}>
          <Badge variant={severityBadgeVariant[alert.severity]} size="sm">
            {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
          </Badge>
          <div className={styles.riskCardTimeline}>
            <span className={styles.riskCardMetaText}>{typeLabel[alert.type]}</span>
            <span className={styles.riskCardMetaDot}>·</span>
            <span className={styles.riskCardMetaText}>{timeAgo(alert.detectedDate)}</span>
            {!isActive && (
              <>
                <span className={styles.riskCardMetaDot}>·</span>
                <Badge variant={statusBadgeVariant[alert.status]} size="sm">{alert.status}</Badge>
              </>
            )}
          </div>
        </div>

        <span className={styles.riskCardTitle}>{alert.title}</span>

        <p className={styles.riskCardSynthesis}>{alert.synthesis}</p>

        <div className={styles.riskCardFooter}>
          <div className={styles.riskCardDetails}>
            <div className={styles.riskCardPeople}>
              {alert.people.map((p) => (
                <AvatarChip key={p.initials} person={p} />
              ))}
              <span className={styles.riskCardPeopleNames}>
                {alert.people.map((p) => p.name).join(", ")}
              </span>
            </div>
            {alert.sources.length > 0 && (
              <span className={styles.riskCardSourceCount}>
                <SourceIcon width={11} height={11} />
                {alert.sources.length} {alert.sources.length === 1 ? "source" : "sources"}
              </span>
            )}
          </div>
          {isActive && (
            <button type="button" className={styles.takeActionBtn} onClick={(e) => { e.stopPropagation(); onOpen(); }}>
              Take Action
            </button>
          )}
        </div>
      </button>

      {alert.status === "snoozed" && alert.snoozedUntil && (
        <div className={styles.riskCardSnoozedBar}>
          <ClockIcon width={12} height={12} /> {alert.snoozedUntil}
        </div>
      )}

      {alert.status === "resolved" && alert.resolvedNote && (
        <div className={styles.riskCardResolvedBar}>
          <CheckCircle width={12} height={12} /> {alert.resolvedNote}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   Detail Page
   ═══════════════════════════════════════ */

function RiskDetailView({
  alert,
  allAlerts,
  onBack,
  onResolve,
  onSnooze,
  onDismiss,
  onFeedback,
}: {
  alert: RiskAlert;
  allAlerts: RiskAlert[];
  onBack: () => void;
  onResolve: () => void;
  onSnooze: (val: string) => void;
  onDismiss: () => void;
  onFeedback: (val: "useful" | "not-useful") => void;
}) {
  const [showCompose, setShowCompose] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [resolveMode, setResolveMode] = useState(false);
  const [resolveNote, setResolveNote] = useState("");


  const relatedAlerts = allAlerts.filter((a) => alert.relatedRiskIds.includes(a.id));

  return (
    <div className={styles.page}>
      <TopBar
        breadcrumbs={[
          { label: "Risk Radar", onClick: onBack },
          { label: alert.title.length > 50 ? alert.title.slice(0, 47) + "..." : alert.title },
        ]}
        actions={
          alert.status === "active" ? (
            <div className={styles.detailTopActions}>
              <Button variant="primary" size="sm" onClick={() => setResolveMode(true)}>
                <CheckCircle width={13} height={13} /> Resolve
              </Button>
              <SnoozeDropdown onSnooze={onSnooze} />
              <Button variant="ghost" size="sm" onClick={onDismiss}>
                <ThumbDown width={13} height={13} /> Dismiss
              </Button>
            </div>
          ) : undefined
        }
      />

      <div className={styles.detailContent}>
        <div className={styles.detailInner}>

          {/* ── Hero Header ── */}
          <div className={styles.detailHero}>
            <h1 className={styles.detailTitle}>{alert.title}</h1>
            <div className={styles.detailMeta}>
              <Badge variant={severityBadgeVariant[alert.severity]} size="sm">{alert.severity}</Badge>
              <Badge variant="outline" size="sm">{typeLabel[alert.type]}</Badge>
              <Badge variant={statusBadgeVariant[alert.status]} size="sm">{alert.status}</Badge>
              <span className={styles.detailMetaSep}>&middot;</span>
              <span className={styles.detailMetaText}>Detected {alert.detectedDate}</span>
              <span className={styles.detailMetaSep}>&middot;</span>
              <span className={styles.detailMetaText}>Updated {alert.lastUpdated}</span>
            </div>
          </div>

          {/* ── Summary Stats ── */}
          <div className={styles.detailStats}>
            <div className={styles.detailStatItem}>
              <span className={styles.detailStatValue}>{alert.people.length}</span>
              <span className={styles.detailStatLabel}>people</span>
            </div>
            <span className={styles.detailStatSep} />
            <div className={styles.detailStatItem}>
              <span className={styles.detailStatValue}>{alert.sources.length}</span>
              <span className={styles.detailStatLabel}>sources</span>
            </div>
            <span className={styles.detailStatSep} />
            <div className={styles.detailStatItem}>
              <span className={styles.detailStatValue}>{alert.detectedDate.replace(", 2026", "")}</span>
              <span className={styles.detailStatLabel}>detected</span>
            </div>
            <span className={styles.detailStatSep} />
            <div className={styles.detailStatItem}>
              <span className={`${styles.detailStatValue} ${styles.detailStatCapitalize}`}>{alert.severity}</span>
              <span className={styles.detailStatLabel}>severity</span>
            </div>
          </div>

          <Separator />

          {/* ── Synthesis ── */}
          <p className={styles.detailSynthesis}>{alert.synthesis}</p>

          {/* ── Suggested Action ── */}
          {alert.status === "active" && (
            <div className={styles.detailActionCallout}>
              <div className={styles.detailActionHeader}>
                <span className={styles.detailActionTag}>
                  <FlagIcon width={12} height={12} />
                  Suggested Action
                </span>
              </div>
              <p className={styles.detailActionText}>{alert.suggestedAction}</p>
              <div className={styles.detailActionButtons}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setShowCompose(!showCompose); setShowSchedule(false); }}
                >
                  <MessageIcon width={14} height={14} /> Message Person
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setShowSchedule(!showSchedule); setShowCompose(false); }}
                >
                  <CalendarIcon width={13} height={13} /> Schedule Meeting
                </Button>
              </div>

              {/* Inline compose card */}
              {showCompose && (
                <div className={styles.inlineActionCard}>
                  <div className={styles.inlineActionCardHeader}>
                    <div className={styles.inlineActionCardHeaderLeft}>
                      <span className={styles.inlineActionCardIcon}><MessageIcon width={13} height={13} /></span>
                      <span className={styles.inlineActionCardTitle}>Send Message</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setShowCompose(false)}>
                      <XMark width={12} height={12} />
                    </Button>
                  </div>
                  <div className={styles.inlineActionCardBody}>
                    <div className={styles.inlineFieldRow}>
                      <span className={styles.inlineFieldLabel}>To</span>
                      <span className={styles.inlineFieldValue}>
                        {alert.people.map((p) => (
                          <span key={p.initials} className={styles.recipientChip}>
                            <span className={styles.recipientAvatar}>{p.initials}</span>
                            {p.name}
                          </span>
                        ))}
                      </span>
                    </div>
                    <div className={styles.inlineFieldRow}>
                      <span className={styles.inlineFieldLabel}>Subject</span>
                      <span className={styles.inlineFieldValue}>Re: {alert.title}</span>
                    </div>
                    <textarea
                      className={styles.inlineTextarea}
                      placeholder="Write your message..."
                      rows={3}
                      defaultValue={`Hey — Sentra flagged a risk we should discuss:\n\n"${alert.synthesis.slice(0, 120)}..."\n\nSuggested next step: ${alert.suggestedAction}\n\nCan we sync on this?`}
                    />
                  </div>
                  <div className={styles.inlineActionCardFooter}>
                    <Button variant="ghost" size="sm" onClick={() => setShowCompose(false)}>Cancel</Button>
                    <Button variant="primary" size="sm" onClick={() => setShowCompose(false)}>
                      <MessageIcon width={12} height={12} /> Send
                    </Button>
                  </div>
                </div>
              )}

              {/* Inline schedule card */}
              {showSchedule && (
                <div className={styles.inlineActionCard}>
                  <div className={styles.inlineActionCardHeader}>
                    <div className={styles.inlineActionCardHeaderLeft}>
                      <span className={styles.inlineActionCardIcon}><CalendarIcon width={13} height={13} /></span>
                      <span className={styles.inlineActionCardTitle}>Schedule Meeting</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setShowSchedule(false)}>
                      <XMark width={12} height={12} />
                    </Button>
                  </div>
                  <div className={styles.inlineActionCardBody}>
                    <div className={styles.inlineFieldRow}>
                      <span className={styles.inlineFieldLabel}>With</span>
                      <span className={styles.inlineFieldValue}>
                        {alert.people.map((p) => (
                          <span key={p.initials} className={styles.recipientChip}>
                            <span className={styles.recipientAvatar}>{p.initials}</span>
                            {p.name}
                          </span>
                        ))}
                      </span>
                    </div>
                    <div className={styles.inlineFieldRow}>
                      <span className={styles.inlineFieldLabel}>Topic</span>
                      <span className={styles.inlineFieldValue}>{alert.title}</span>
                    </div>
                    <div className={styles.inlineScheduleGrid}>
                      {[
                        { time: "Tomorrow 10 AM", label: "Best availability" },
                        { time: "Tomorrow 2 PM", label: "Afternoon slot" },
                        { time: "Thu 9:30 AM", label: "Next open slot" },
                        { time: "Fri 11 AM", label: "End of week" },
                      ].map((slot, i) => (
                        <button
                          key={i}
                          type="button"
                          className={`${styles.inlineScheduleSlot} ${selectedSlot === i ? styles.inlineScheduleSlotSelected : ""}`}
                          onClick={() => setSelectedSlot(i)}
                        >
                          <span className={styles.inlineScheduleTime}>{slot.time}</span>
                          <span className={styles.inlineScheduleLabel}>{slot.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={styles.inlineActionCardFooter}>
                    <Button variant="ghost" size="sm" onClick={() => setShowSchedule(false)}>Cancel</Button>
                    <Button variant="primary" size="sm" onClick={() => setShowSchedule(false)}>
                      <CalendarIcon width={12} height={12} /> Confirm
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Resolve form ── */}
          {resolveMode && (
            <div className={styles.resolveForm}>
              <h3 className={styles.sectionTitle}>Resolve this risk</h3>
              <textarea
                className={styles.resolveTextarea}
                placeholder="Add a resolution note (optional)..."
                value={resolveNote}
                onChange={(e) => setResolveNote(e.target.value)}
                rows={3}
              />
              <div className={styles.resolveFormActions}>
                <Button variant="primary" size="sm" onClick={() => { onResolve(); setResolveMode(false); }}>
                  Confirm Resolve
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setResolveMode(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* ── People Involved ── */}
          <div className={styles.detailSection}>
            <h3 className={styles.flatSectionTitle}>People Involved</h3>
            <div className={styles.flatList}>
              {alert.people.map((person) => (
                <div key={person.initials} className={styles.flatRow}>
                  <span className={styles.personAvatar}>{person.initials}</span>
                  <div className={styles.flatRowContent}>
                    <span className={styles.flatRowName}>{person.name}</span>
                    {person.role && <span className={styles.flatRowMeta}>{person.role}</span>}
                  </div>
                  <div className={styles.flatRowActions}>
                    <Button variant="secondary" size="sm" onClick={() => setShowCompose(true)}>
                      <MessageIcon width={13} height={13} /> Message
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setShowSchedule(true)}>
                      <CalendarIcon width={13} height={13} /> Meet
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Evidence & Sources ── */}
          <div className={styles.detailSection}>
            <h3 className={styles.flatSectionTitle}>Evidence &amp; Sources</h3>
            <div className={styles.flatList}>
              {alert.sources.map((src, i) => (
                <div key={i} className={styles.flatRow}>
                  <div className={styles.flatRowContent}>
                    <div className={styles.flatRowTop}>
                      <Badge variant="outline" size="sm">{sourceTypeLabel[src.type]}</Badge>
                      <span className={styles.flatRowName}>{src.title}</span>
                    </div>
                    {src.excerpt && <p className={styles.flatRowExcerpt}>{src.excerpt}</p>}
                    {src.participants && (
                      <span className={styles.flatRowMeta}>{src.participants.join(", ")}</span>
                    )}
                  </div>
                  <span className={styles.flatRowDate}>{src.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Related Risks ── */}
          {relatedAlerts.length > 0 && (
            <div className={styles.detailSection}>
              <h3 className={styles.flatSectionTitle}>Related Risks</h3>
              <div className={styles.flatList}>
                {relatedAlerts.map((ra) => (
                  <div key={ra.id} className={`${styles.flatRow} ${styles.flatRowClickable}`} onClick={() => onSelect(ra)}>
                    <div className={styles.flatRowContent}>
                      <span className={styles.flatRowName}>{ra.title}</span>
                      <span className={styles.flatRowMeta}>
                        {typeLabel[ra.type]} &middot; Detected {ra.detectedDate} &middot; {ra.people.length} people
                      </span>
                    </div>
                    <div className={styles.flatRowBadges}>
                      <Badge variant={severityBadgeVariant[ra.severity]} size="sm">{ra.severity}</Badge>
                      <Badge variant={statusBadgeVariant[ra.status]} size="sm">{ra.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Activity ── */}
          <div className={styles.detailSection}>
            <h3 className={styles.flatSectionTitle}>Activity</h3>
            <div className={styles.flatList}>
              {alert.activity.map((evt, i) => (
                <div key={i} className={styles.flatRow}>
                  <span className={styles.activityDot} />
                  <div className={styles.flatRowContent}>
                    <span className={styles.flatRowName}>{evt.action}{evt.actor ? ` by ${evt.actor}` : ""}</span>
                  </div>
                  <span className={styles.flatRowDate}>{evt.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Feedback ── */}
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Feedback</h3>
            <div className={styles.feedbackRow}>
              <span className={styles.feedbackLabel}>Was this risk alert useful?</span>
              <div className={styles.feedbackButtons}>
                <button
                  type="button"
                  className={`${styles.feedbackBtn} ${alert.feedback === "useful" ? styles.feedbackBtnActive : ""}`}
                  onClick={() => onFeedback("useful")}
                >
                  Yes, useful
                </button>
                <button
                  type="button"
                  className={`${styles.feedbackBtn} ${alert.feedback === "not-useful" ? styles.feedbackBtnActive : ""}`}
                  onClick={() => onFeedback("not-useful")}
                >
                  Not useful
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Main Page Component
   ═══════════════════════════════════════ */

export function RiskRadarPage({ onOpenChat }: { onOpenChat?: () => void } = {}) {
  const [alerts, setAlerts] = useState<RiskAlert[]>(initialAlerts);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const selectedAlert = useMemo(() => alerts.find((a) => a.id === selectedId) ?? null, [alerts, selectedId]);

  const activeAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (a.status !== "active") return false;
      if (severityFilter.size > 0 && !severityFilter.has(a.severity)) return false;
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return a.title.toLowerCase().includes(q) || a.synthesis.toLowerCase().includes(q) || a.people.some((p) => p.name.toLowerCase().includes(q));
      }
      return true;
    });
  }, [alerts, severityFilter, typeFilter, search]);

  const snoozedAlerts = useMemo(() => alerts.filter((a) => a.status === "snoozed"), [alerts]);
  const resolvedAlerts = useMemo(() => alerts.filter((a) => a.status === "resolved" || a.status === "dismissed"), [alerts]);

  const counts = useMemo(() => {
    const active = alerts.filter((a) => a.status === "active");
    return {
      total: active.length,
      critical: active.filter((a) => a.severity === "critical").length,
      high: active.filter((a) => a.severity === "high").length,
      medium: active.filter((a) => a.severity === "medium").length,
      low: active.filter((a) => a.severity === "low").length,
      resolved: alerts.filter((a) => a.status === "resolved" || a.status === "dismissed").length,
      newThisWeek: active.filter((a) => a.detectedDate.includes("Feb 2")).length,
    };
  }, [alerts]);

  const updateAlert = useCallback((id: string, patch: Partial<RiskAlert>) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  const handleResolve = useCallback((id: string) => {
    updateAlert(id, {
      status: "resolved",
      resolvedDate: "Feb 21, 2026",
      resolvedNote: "Marked as resolved.",
      activity: [...(alerts.find((a) => a.id === id)?.activity ?? []), { action: "Resolved", date: "Feb 21, 2026", actor: "You" }],
    });
  }, [alerts, updateAlert]);

  const handleSnooze = useCallback((id: string, val: string) => {
    const labelMap: Record<string, string> = { "1h": "1 hour", "4h": "4 hours", "24h": "tomorrow", "1w": "next week" };
    updateAlert(id, {
      status: "snoozed",
      snoozedUntil: `Snoozed for ${labelMap[val] ?? val}`,
      activity: [...(alerts.find((a) => a.id === id)?.activity ?? []), { action: `Snoozed for ${labelMap[val] ?? val}`, date: "Feb 21, 2026", actor: "You" }],
    });
  }, [alerts, updateAlert]);

  const handleDismiss = useCallback((id: string) => {
    updateAlert(id, {
      status: "dismissed",
      feedback: "not-useful",
      activity: [...(alerts.find((a) => a.id === id)?.activity ?? []), { action: "Dismissed as not useful", date: "Feb 21, 2026", actor: "You" }],
    });
  }, [alerts, updateAlert]);

  const handleFeedback = useCallback((id: string, val: "useful" | "not-useful") => {
    updateAlert(id, { feedback: val });
  }, [updateAlert]);

  /* ── Detail view ── */
  if (selectedAlert) {
    return (
      <RiskDetailView
        alert={selectedAlert}
        allAlerts={alerts}
        onBack={() => setSelectedId(null)}
        onResolve={() => handleResolve(selectedAlert.id)}
        onSnooze={(val) => handleSnooze(selectedAlert.id, val)}
        onDismiss={() => handleDismiss(selectedAlert.id)}
        onFeedback={(val) => handleFeedback(selectedAlert.id, val)}
      />
    );
  }

  /* ── Severity toggle items ── */
  const severityItems = [
    { value: "critical", label: "Critical", count: counts.critical, dot: "var(--status-red)" },
    { value: "high", label: "High", count: counts.high, dot: "var(--fg-error)" },
    { value: "medium", label: "Medium", count: counts.medium, dot: "var(--status-yellow)" },
    { value: "low", label: "Low", count: counts.low, dot: "var(--fg-muted)" },
  ];

  /* ── List view ── */
  return (
    <div className={styles.page}>
      <TopBar
        breadcrumbs={[{ label: `Risk Radar (${counts.total})` }]}
        actions={
          <div className={styles.topBarActions}>
            <ToggleButtonGroup
              items={severityItems}
              value={severityFilter}
              onChange={(v) => setSeverityFilter(v as Set<string>)}
              multi
              size="sm"
            />
            <div style={{ width: 130 }}>
              <Select value={typeFilter} onValueChange={setTypeFilter} size="sm">
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="timeline">Timeline</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="ownership">Ownership</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={styles.topBarSearch}>
              <Input
                placeholder="Search risks..."
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
          </div>
        }
      />

      <div className={styles.content}>
        <div className={styles.listInner}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Risk Radar</h1>
            <p className={styles.pageDesc}>Active risks, alerts, and issues that need your attention.</p>
          </div>
          <FeatureBanner storageKey="risk-radar">
            AI-detected risks and conflicts across your projects, prioritized by severity.
          </FeatureBanner>

          {activeAlerts.length === 0 && snoozedAlerts.length === 0 && resolvedAlerts.length === 0 && (
            <div className={styles.emptyState}>
              <WarningIcon width={20} height={20} />
              <p>No risks matching your filters.</p>
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
                    <div
                      key={alert.id}
                      className={styles.card}
                      onClick={() => setSelectedId(alert.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setSelectedId(alert.id)}
                    >
                      <div className={styles.cardTop}>
                        <div className={styles.cardTopLeft}>
                          <div className={styles.cardTitleRow}>
                            {(sev === "critical" || sev === "high") && <span className={styles.severityDotRed} />}
                            {sev === "medium" && <span className={styles.severityDotYellow} />}
                            <h3 className={styles.cardTitle}>{alert.title}</h3>
                          </div>
                          <p className={styles.cardSummary}>{alert.synthesis}</p>
                        </div>
                      </div>
                      <div className={styles.cardChin}>
                        <span className={styles.cardMetaItem}>
                          <SourceIcon width={11} height={11} />
                          {alert.sources.length} {alert.sources.length === 1 ? "source" : "sources"}
                        </span>
                        <span className={styles.chinDot}>&middot;</span>
                        <span className={styles.cardMetaItem}>{timeAgo(alert.detectedDate)}</span>
                        <span className={styles.chinDot}>&middot;</span>
                        <span className={styles.cardMetaItem}>
                          {alert.people.map((p) => p.name).join(", ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* ── Snoozed ── */}
          {snoozedAlerts.length > 0 && (
            <div className={styles.statusGroup}>
              <div className={styles.groupHeader}>
                <span className={styles.groupLabel}>Snoozed</span>
                <span className={styles.groupCount}>{snoozedAlerts.length}</span>
              </div>
              <div className={styles.groupItems}>
                {snoozedAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`${styles.card} ${styles.cardInactive}`}
                    onClick={() => setSelectedId(alert.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedId(alert.id)}
                  >
                    <div className={styles.cardTop}>
                      <div className={styles.cardTopLeft}>
                        <h3 className={styles.cardTitle}>{alert.title}</h3>
                        <p className={styles.cardSummary}>{alert.synthesis}</p>
                      </div>
                    </div>
                    <div className={styles.cardChin}>
                      {alert.snoozedUntil && (
                        <span className={styles.cardMetaItem}>
                          <ClockIcon width={11} height={11} /> {alert.snoozedUntil}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Resolved ── */}
          {resolvedAlerts.length > 0 && (
            <div className={styles.statusGroup}>
              <div className={styles.groupHeader}>
                <span className={styles.groupLabel}>Resolved</span>
                <span className={styles.groupCount}>{resolvedAlerts.length}</span>
              </div>
              <div className={styles.groupItems}>
                {resolvedAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`${styles.card} ${styles.cardInactive}`}
                    onClick={() => setSelectedId(alert.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedId(alert.id)}
                  >
                    <div className={styles.cardTop}>
                      <div className={styles.cardTopLeft}>
                        <h3 className={styles.cardTitle}>{alert.title}</h3>
                        <p className={styles.cardSummary}>{alert.synthesis}</p>
                      </div>
                    </div>
                    <div className={styles.cardChin}>
                      <span className={styles.cardMetaItem}>
                        <CheckCircle width={11} height={11} /> Resolved {alert.resolvedDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
