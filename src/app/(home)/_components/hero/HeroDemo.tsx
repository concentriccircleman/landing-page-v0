"use client";

import { useState, useCallback } from "react";

type PageId = "home" | "memory" | "weekly-reports" | "meeting-notes" | "deep-research" | "risk-radar" | "chart" | "todo" | "apps";

const pageConfig: Record<PageId, { title: string; desc: string; hint: string }> = {
  home:             { title: "Home",            desc: "Welcome back, Shaurya",                                    hint: "Ask anything..." },
  memory:           { title: "Memory",          desc: "Your organization's collective knowledge",                 hint: "Search organizational memory..." },
  "weekly-reports": { title: "Weekly Reports",  desc: "AI-generated summaries of your week",                      hint: "Ask about this week's highlights..." },
  "meeting-notes":  { title: "Meeting Notes",   desc: "Review and manage your meeting recordings",                hint: "Ask about meetings..." },
  "deep-research":  { title: "Deep Research",   desc: "AI-powered research across your data",                     hint: "Start a research query..." },
  "risk-radar":     { title: "Risk Radar",      desc: "AI-detected risks and conflicts across your organization", hint: "Ask about risks, conflicts, or action items..." },
  chart:            { title: "Reports",         desc: "Analytics and insights dashboard",                         hint: "Ask about trends or metrics..." },
  todo:             { title: "Commitments",     desc: "Your tasks and action items",                              hint: "Ask about your tasks..." },
  apps:             { title: "Apps",            desc: "Connected integrations",                                   hint: "Search apps..." },
};

const navToPage: Record<string, PageId> = {
  home: "home", memory: "memory", reports: "weekly-reports", meeting: "meeting-notes",
  research: "deep-research", radar: "risk-radar", chart: "chart", todo: "todo", apps: "apps",
};

export default function HeroDemo() {
  const [activePage, setActivePage] = useState<PageId>("risk-radar");
  const [toastVisible, setToastVisible] = useState(true);
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);
  const [checkedTodos, setCheckedTodos] = useState<Set<string>>(new Set(["Schedule pilot onboarding calls"]));
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const handleNav = useCallback((icon: string) => {
    const page = navToPage[icon];
    if (page) setActivePage(page);
  }, []);

  const toggleTodo = useCallback((text: string) => {
    setCheckedTodos(prev => {
      const next = new Set(prev);
      if (next.has(text)) next.delete(text); else next.add(text);
      return next;
    });
  }, []);

  const toggleRisk = useCallback((title: string) => {
    setExpandedRisk(prev => prev === title ? null : title);
  }, []);

  const cfg = pageConfig[activePage];

  return (
    <div className="w-full h-full relative">
      <div
        className="w-full h-full flex overflow-hidden"
        style={{
          borderRadius: 10,
          background: "#f5f5f5",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08), 0 12px 40px rgba(0,0,0,0.1), 0 24px 64px rgba(0,0,0,0.06)",
        }}
      >
        {/* ── Sidebar ── */}
        <div
          className="shrink-0 flex flex-col h-full select-none"
          style={{ width: 172, background: "#f5f5f5", fontFamily: "var(--font-geist-sans, Geist, system-ui, sans-serif)" }}
        >
          <div className="flex items-center gap-2 px-3 pt-3 pb-1.5 cursor-pointer group">
            <div className="shrink-0 flex items-center justify-center" style={{ width: 18, height: 18, borderRadius: 4, background: "#fff", padding: 1, boxShadow: "0 0 0 0.5px rgba(0,0,0,0.08)" }}>
              <div className="w-full h-full flex items-center justify-center" style={{ borderRadius: 3, background: "#7c3aed" }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: "#fff", lineHeight: 1 }}>S</span>
              </div>
            </div>
            <span className="group-hover:text-[#18181b] transition-colors" style={{ fontSize: 12, fontWeight: 500, color: "#52525b" }}>Sentra</span>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="ml-auto opacity-40 group-hover:opacity-70 transition-opacity">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="flex flex-col gap-3 py-1.5">
            <div className="flex flex-col gap-px px-2.5">
              <NavItem icon="home" label="Home" active={activePage === "home"} hovered={hoveredNav === "home"} onClick={handleNav} onHover={setHoveredNav} />
            </div>
            <div className="flex flex-col gap-px px-2.5">
              <SectionHeader label="Workspace" />
              <NavItem icon="memory" label="Memory" active={activePage === "memory"} hovered={hoveredNav === "memory"} onClick={handleNav} onHover={setHoveredNav} />
              <NavItem icon="reports" label="Weekly Reports" active={activePage === "weekly-reports"} hovered={hoveredNav === "reports"} onClick={handleNav} onHover={setHoveredNav} />
              <NavItem icon="meeting" label="Meeting Notes" active={activePage === "meeting-notes"} hovered={hoveredNav === "meeting"} onClick={handleNav} onHover={setHoveredNav} />
              <NavItem icon="research" label="Deep Research" active={activePage === "deep-research"} hovered={hoveredNav === "research"} onClick={handleNav} onHover={setHoveredNav} />
              <NavItem icon="radar" label="Risk Radar" active={activePage === "risk-radar"} hovered={hoveredNav === "radar"} onClick={handleNav} onHover={setHoveredNav} />
              <NavItem icon="chart" label="Reports" active={activePage === "chart"} hovered={hoveredNav === "chart"} onClick={handleNav} onHover={setHoveredNav} />
            </div>
            <div className="flex flex-col gap-px px-2.5">
              <SectionHeader label="Personal" />
              <NavItem icon="todo" label="Commitments" active={activePage === "todo"} hovered={hoveredNav === "todo"} onClick={handleNav} onHover={setHoveredNav} />
              <NavItem icon="apps" label="Apps" active={activePage === "apps"} hovered={hoveredNav === "apps"} onClick={handleNav} onHover={setHoveredNav} />
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-px px-2.5 pb-3">
            <NavItem icon="help" label="Help" hovered={hoveredNav === "help"} onClick={() => {}} onHover={setHoveredNav} />
            <NavItem icon="settings" label="Settings" hovered={hoveredNav === "settings"} onClick={() => {}} onHover={setHoveredNav} />
          </div>
        </div>

        {/* ── Content area ── */}
        <div className="flex-1 flex flex-col min-w-0 p-2 pl-0">
          <div
            className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden"
            style={{ background: "#fff", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.06)" }}
          >
            {/* TopBar */}
            <div className="shrink-0 flex items-center justify-between px-4" style={{ height: 40, borderBottom: "1px solid #efeff0" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#18181b" }}>{cfg.title}</span>
              <div className="flex items-center gap-1.5">
                <IconBtn tooltip="Search"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></IconBtn>
                <IconBtn tooltip="Settings"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg></IconBtn>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4" style={{ scrollbarWidth: "none" }}>
              <PageContent
                page={activePage}
                expandedRisk={expandedRisk}
                onToggleRisk={toggleRisk}
                checkedTodos={checkedTodos}
                onToggleTodo={toggleTodo}
              />
            </div>

            {/* Research panel hint */}
            <div className="shrink-0 flex items-center gap-2 px-4 cursor-pointer group/hint" style={{ height: 36, borderTop: "1px solid #efeff0", background: "#fafafa" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/hint:scale-110 transition-transform">
                <path d="M12 3v1m0 16v1m-7.07-2.93l.71-.71M18.36 5.64l.71-.71M3 12h1m16 0h1M5.64 5.64l-.71-.71m13.43 13.43l-.71-.71"/><circle cx="12" cy="12" r="4"/>
              </svg>
              <span className="group-hover/hint:text-[#71717a] transition-colors" style={{ fontSize: 10, color: "#a1a1aa" }}>{cfg.hint}</span>
              <span className="ml-auto flex items-center group-hover/hint:bg-[#efeff0] transition-colors" style={{ fontSize: 9, color: "#a1a1aa", background: "#f5f5f5", border: "1px solid #efeff0", borderRadius: 3, padding: "1px 5px", lineHeight: "16px" }}>⌘⇧E</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating toast */}
      {toastVisible && (
        <div
          onClick={() => setToastVisible(false)}
          className="absolute bottom-12 left-[38%] flex items-center gap-2.5 px-4 py-2.5 z-10 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
          style={{
            background: "#18181b",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.06) inset",
            animation: "toast-in 0.4s ease-out",
          }}
        >
          <span className="shrink-0" style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563eb", boxShadow: "0 0 6px rgba(37,99,235,0.8)", animation: "pulse-dot 2s ease-in-out infinite" }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: "#e0e0e0" }}>New risk detected</span>
          <span style={{ fontSize: 10, color: "#71717a" }}>just now</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 opacity-0 group-hover:opacity-100 hover:stroke-white transition-all">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </div>
      )}

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 6px rgba(37,99,235,0.8); }
          50% { box-shadow: 0 0 12px rgba(37,99,235,1), 0 0 4px rgba(37,99,235,0.6); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════
   Page content per nav item
   ═══════════════════════════════ */

interface ContentProps {
  page: PageId;
  expandedRisk: string | null;
  onToggleRisk: (title: string) => void;
  checkedTodos: Set<string>;
  onToggleTodo: (text: string) => void;
}

function PageContent({ page, expandedRisk, onToggleRisk, checkedTodos, onToggleTodo }: ContentProps) {
  switch (page) {
    case "risk-radar": return <RiskRadarContent expandedRisk={expandedRisk} onToggleRisk={onToggleRisk} />;
    case "meeting-notes": return <MeetingNotesContent />;
    case "memory": return <MemoryContent />;
    case "weekly-reports": return <WeeklyReportsContent />;
    case "todo": return <CommitmentsContent checkedTodos={checkedTodos} onToggleTodo={onToggleTodo} />;
    case "home": return <HomeContent />;
    default: return <GenericContent page={page} />;
  }
}

function RiskRadarContent({ expandedRisk, onToggleRisk }: { expandedRisk: string | null; onToggleRisk: (t: string) => void }) {
  return (
    <>
      <div className="mb-3">
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#18181b", margin: 0 }}>Risk Radar</h3>
        <p style={{ fontSize: 10, color: "#71717a", margin: "2px 0 0" }}>AI-detected risks and conflicts across your organization</p>
      </div>
      <FeatureBanner text="Sentra continuously monitors meetings, documents, and messages to detect risks." />
      <div className="flex flex-col gap-4">
        <SeverityGroup label="Critical" count={1}>
          <RiskCard severity="critical" title="SoftBank PoC timeline conflict" synthesis="Shaurya committed to a Feb deadline for the design system migration, but Carol referenced a March product launch that depends on completed components." sources={3} date="Feb 20" people={["S","CD"]} expanded={expandedRisk === "SoftBank PoC timeline conflict"} onToggle={onToggleRisk} />
        </SeverityGroup>
        <SeverityGroup label="High" count={2}>
          <RiskCard severity="high" title="Q2 hiring budget gap" synthesis="Alice proposed 2 engineering hires starting Q2, but Bob's revenue projections assume no new hires until Q3." sources={2} date="Feb 19" people={["AJ","BC"]} expanded={expandedRisk === "Q2 hiring budget gap"} onToggle={onToggleRisk} />
          <RiskCard severity="high" title="Sprint priority conflict" synthesis="Design system migration and SoftBank PoC are competing for the same engineering resources in Sprint 5." sources={2} date="Feb 21" people={["S","AJ"]} expanded={expandedRisk === "Sprint priority conflict"} onToggle={onToggleRisk} />
        </SeverityGroup>
        <SeverityGroup label="Medium" count={1}>
          <RiskCard severity="medium" title="Acme Corp deal — no clear owner" synthesis="Bob mentioned the Acme Corp enterprise deal in the Q1 review, but no owner has been assigned and no next steps have been documented." sources={1} date="Feb 18" people={["BC"]} expanded={expandedRisk === "Acme Corp deal — no clear owner"} onToggle={onToggleRisk} />
        </SeverityGroup>
      </div>
    </>
  );
}

function MeetingNotesContent() {
  const [activeRow, setActiveRow] = useState<string | null>("Q1 Planning Review");
  return (
    <>
      <div className="mb-3">
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#18181b", margin: 0 }}>Meeting Notes</h3>
        <p style={{ fontSize: 10, color: "#71717a", margin: "2px 0 0" }}>Review and manage your meeting recordings</p>
      </div>
      <div className="flex flex-col gap-2">
        <MeetingRow title="Q1 Planning Review" summary="Aligned on Q1 goals. Design system migration target: 70 components." date="Feb 20" duration="45 min" participants={["SH","AJ","BC"]} topics={["Revenue targets","Team expansion"]} active={activeRow === "Q1 Planning Review"} onClick={setActiveRow} />
        <MeetingRow title="Design System Sync" summary="Reviewed token system. Dark mode support required from day one." date="Feb 18" duration="30 min" participants={["SH","AJ"]} topics={["CSS Modules","Tokens"]} active={activeRow === "Design System Sync"} onClick={setActiveRow} />
        <MeetingRow title="Investor Update Prep" summary="Prepared deck for seed round update. Finalized metrics slide." date="Feb 15" duration="25 min" participants={["SH","BC"]} topics={["Fundraising","Metrics"]} active={activeRow === "Investor Update Prep"} onClick={setActiveRow} />
        <MeetingRow title="Product Roadmap Sync" summary="Discussed Q2 feature priorities and resource allocation across teams." date="Feb 12" duration="35 min" participants={["SH","AJ","BC"]} topics={["Roadmap","Priorities"]} active={activeRow === "Product Roadmap Sync"} onClick={setActiveRow} />
      </div>
    </>
  );
}

function MemoryContent() {
  return (
    <>
      <div className="mb-3">
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#18181b", margin: 0 }}>Memory</h3>
        <p style={{ fontSize: 10, color: "#71717a", margin: "2px 0 0" }}>Your organization&apos;s collective knowledge</p>
      </div>
      <FeatureBanner text="Sentra automatically captures and indexes decisions, context, and institutional knowledge." />
      <div className="flex flex-col gap-2">
        <MemoryCard type="decision" title="CSS Modules chosen for styling" body="Team agreed CSS Modules is the right styling approach for the design system. Tokens are the single source of truth." date="Feb 20" />
        <MemoryCard type="milestone" title="Design system: 25 components migrated" body="Migration pipeline established. Multi-pass review: token compliance, a11y, dark mode, visual regression." date="Feb 18" />
        <MemoryCard type="insight" title="$120K MRR run rate" body="Bob confirmed current run rate. $150K target by March is achievable if Acme Corp deal closes." date="Feb 20" />
        <MemoryCard type="decision" title="2 engineering hires planned for Q2" body="Alice drafted hiring plan for frontend specialists who understand design systems." date="Feb 20" />
      </div>
    </>
  );
}

function WeeklyReportsContent() {
  return (
    <>
      <div className="mb-3">
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#18181b", margin: 0 }}>Weekly Reports</h3>
        <p style={{ fontSize: 10, color: "#71717a", margin: "2px 0 0" }}>AI-generated summaries of your week</p>
      </div>
      <div className="flex flex-col gap-2">
        <ReportCard title="Week of Feb 17 – 21" meetings={4} decisions={6} risks={3} highlights={["SoftBank PoC timeline escalated to critical","Design system reached 25 components","Q2 hiring plan drafted"]} />
        <ReportCard title="Week of Feb 10 – 14" meetings={3} decisions={4} risks={1} highlights={["Token system finalized","Acme Corp deal entered pipeline","Sprint velocity up 20%"]} />
      </div>
    </>
  );
}

function CommitmentsContent({ checkedTodos, onToggleTodo }: { checkedTodos: Set<string>; onToggleTodo: (t: string) => void }) {
  return (
    <>
      <div className="mb-3">
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#18181b", margin: 0 }}>Commitments</h3>
        <p style={{ fontSize: 10, color: "#71717a", margin: "2px 0 0" }}>Your tasks and action items</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <TodoItem text="Finalize enterprise pricing deck" due="Mar 22" who="SH" done={checkedTodos.has("Finalize enterprise pricing deck")} onToggle={onToggleTodo} />
        <TodoItem text="Complete component migration pipeline" due="Feb 28" who="SH" done={checkedTodos.has("Complete component migration pipeline")} onToggle={onToggleTodo} />
        <TodoItem text="Sync with Carol on PoC timeline" due="Feb 24" who="SH" urgent done={checkedTodos.has("Sync with Carol on PoC timeline")} onToggle={onToggleTodo} />
        <TodoItem text="Draft SOC 2 audit timeline" due="Mar 25" who="AJ" done={checkedTodos.has("Draft SOC 2 audit timeline")} onToggle={onToggleTodo} />
        <TodoItem text="Update revenue projections dashboard" due="Mar 1" who="BC" done={checkedTodos.has("Update revenue projections dashboard")} onToggle={onToggleTodo} />
        <TodoItem text="Schedule pilot onboarding calls" due="Mar 21" who="AJ" done={checkedTodos.has("Schedule pilot onboarding calls")} onToggle={onToggleTodo} />
      </div>
    </>
  );
}

function HomeContent() {
  return (
    <>
      <div className="mb-4">
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#18181b", margin: 0 }}>Good morning, Shaurya</h3>
        <p style={{ fontSize: 10, color: "#71717a", margin: "2px 0 0" }}>Here&apos;s what&apos;s happening across your organization</p>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <StatCard label="Open Risks" value="4" color="#ef4444" />
        <StatCard label="This Week" value="4 meetings" color="#2563eb" />
        <StatCard label="Pending" value="5 tasks" color="#f59e0b" />
      </div>
      <div className="mb-2.5">
        <span style={{ fontSize: 10, fontWeight: 500, color: "#71717a" }}>Recent Activity</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <ActivityRow icon="radar" text="New critical risk: SoftBank PoC timeline conflict" time="2h ago" />
        <ActivityRow icon="meeting" text="Q1 Planning Review notes ready" time="3h ago" />
        <ActivityRow icon="memory" text="New decision captured: CSS Modules for styling" time="5h ago" />
        <ActivityRow icon="todo" text="Carol assigned: Sync on PoC timeline" time="6h ago" />
      </div>
    </>
  );
}

function GenericContent({ page }: { page: string }) {
  const cfg = pageConfig[page as PageId];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <div className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: "50%", background: "#f5f5f5" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{iconPaths[page] || iconPaths.home}</svg>
      </div>
      <span style={{ fontSize: 12, fontWeight: 500, color: "#71717a" }}>{cfg?.title || page}</span>
      <span style={{ fontSize: 10, color: "#a1a1aa" }}>{cfg?.desc}</span>
    </div>
  );
}

/* ═══════════════════════════════
   Shared sub-components
   ═══════════════════════════════ */

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1 h-6 px-1">
      <svg width="7" height="7" viewBox="0 0 6 6" fill="none" className="opacity-50"><path d="M1.5 1L4.5 3L1.5 5" fill="currentColor" /></svg>
      <span style={{ fontSize: 10, fontWeight: 500, color: "#71717a" }}>{label}</span>
    </div>
  );
}

const iconPaths: Record<string, React.ReactNode> = {
  home: <path d="M3 9.5l7-5.5 7 5.5v8.5a1 1 0 01-1 1h-4v-5h-4v5H4a1 1 0 01-1-1z" />,
  memory: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8M16 17H8M10 9H8" /></>,
  reports: <><path d="M18 20V10M12 20V4M6 20v-6" /></>,
  meeting: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><circle cx="11" cy="15" r="2" /><path d="M11 13v-2" /></>,
  research: <><circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10z"/><path d="M2 12h20"/></>,
  radar: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></>,
  chart: <><path d="M18 20V10M12 20V4M6 20v-6" /></>,
  todo: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M9 15l2 2 4-4" /></>,
  apps: <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></>,
  help: <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
};

function NavItem({ icon, label, active, hovered, onClick, onHover }: { icon: string; label: string; active?: boolean; hovered?: boolean; onClick?: (icon: string) => void; onHover?: (icon: string | null) => void }) {
  const isHighlighted = active || hovered;
  return (
    <button
      type="button"
      onClick={() => onClick?.(icon)}
      onMouseEnter={() => onHover?.(icon)}
      onMouseLeave={() => onHover?.(null)}
      className="flex items-center gap-2 w-full border-none cursor-pointer"
      style={{
        height: 26, paddingLeft: 6, borderRadius: 4, fontFamily: "inherit",
        background: active ? "#efeff0" : hovered ? "rgba(0,0,0,0.03)" : "transparent",
        color: isHighlighted ? "#18181b" : "#52525b",
        transition: "background 0.15s ease, color 0.15s ease",
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">{iconPaths[icon]}</svg>
      <span style={{ fontSize: 11, fontWeight: active ? 600 : 500, lineHeight: 1 }}>{label}</span>
    </button>
  );
}

function IconBtn({ children, tooltip }: { children: React.ReactNode; tooltip?: string }) {
  return (
    <div
      title={tooltip}
      className="flex items-center justify-center cursor-pointer"
      style={{
        width: 24, height: 24, borderRadius: 4, color: "#71717a",
        transition: "background 0.15s ease, color 0.15s ease",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f5f5f5"; (e.currentTarget as HTMLElement).style.color = "#18181b"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#71717a"; }}
    >
      {children}
    </div>
  );
}

function FeatureBanner({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 px-3 mb-4" style={{ height: 28, background: "#eff6ff", borderRadius: 5, border: "0.5px solid #bfdbfe" }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v1m0 16v1m-7.07-2.93l.71-.71M18.36 5.64l.71-.71M3 12h1m16 0h1M5.64 5.64l-.71-.71m13.43 13.43l-.71-.71"/><circle cx="12" cy="12" r="4"/>
      </svg>
      <span style={{ fontSize: 9, color: "#1d4ed8", fontWeight: 500 }}>{text}</span>
    </div>
  );
}

/* ── Risk Radar ── */

const severityColors: Record<string, { dot: string; bg: string }> = {
  critical: { dot: "#ef4444", bg: "rgba(239,68,68,0.04)" },
  high: { dot: "#f59e0b", bg: "rgba(245,158,11,0.04)" },
  medium: { dot: "#3b82f6", bg: "rgba(59,130,246,0.04)" },
  low: { dot: "#6b7280", bg: "rgba(107,114,128,0.04)" },
};
const avatarColors: Record<string, string> = { S: "#2563eb", CD: "#be123c", AJ: "#7c3aed", BC: "#059669", SH: "#2563eb" };

function SeverityGroup({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span style={{ fontSize: 10, fontWeight: 500, color: "#71717a" }}>{label}</span>
        <span style={{ fontSize: 9, fontWeight: 500, color: "#a1a1aa", fontFamily: "monospace" }}>{count}</span>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function RiskCard({ severity, title, synthesis, sources, date, people, expanded, onToggle }: { severity: string; title: string; synthesis: string; sources: number; date: string; people: string[]; expanded: boolean; onToggle: (t: string) => void }) {
  const sev = severityColors[severity] || severityColors.low;
  return (
    <div
      onClick={() => onToggle(title)}
      className="cursor-pointer group/card"
      style={{
        background: expanded ? sev.bg : "#fff",
        borderRadius: 8,
        boxShadow: expanded
          ? `0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px ${sev.dot}22`
          : "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.06)",
        overflow: "hidden",
        transition: "box-shadow 0.2s ease, background 0.2s ease",
      }}
      onMouseEnter={e => { if (!expanded) (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)"; }}
      onMouseLeave={e => { if (!expanded) (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.06)"; }}
    >
      <div style={{ padding: "10px 12px" }}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="shrink-0" style={{ width: 7, height: 7, borderRadius: "50%", background: sev.dot, transition: "transform 0.15s ease", transform: expanded ? "scale(1.3)" : "scale(1)" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#18181b" }}>{title}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto shrink-0" style={{ transition: "transform 0.2s ease", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        <p style={{ fontSize: 10, color: "#52525b", margin: 0, lineHeight: 1.5, overflow: "hidden", transition: "max-height 0.25s ease", maxHeight: expanded ? 100 : 18 }}>{synthesis}</p>
      </div>
      <div className="flex items-center gap-3 px-3" style={{ height: 28, background: expanded ? "rgba(0,0,0,0.02)" : "#fafafa", boxShadow: "inset 0 1px 0 #efeff0", transition: "background 0.2s ease" }}>
        <span style={{ fontSize: 9, color: "#a1a1aa" }}>{sources} sources</span>
        <span style={{ fontSize: 9, color: "#a1a1aa" }}>{date}</span>
        <div className="flex -space-x-1.5 ml-auto">{people.map((p) => <AvatarDot key={p} initials={p} />)}</div>
      </div>
    </div>
  );
}

/* ── Meeting Notes ── */

function MeetingRow({ title, summary, date, duration, participants, topics, active, onClick }: { title: string; summary: string; date: string; duration: string; participants: string[]; topics: string[]; active?: boolean; onClick?: (t: string) => void }) {
  return (
    <div
      onClick={() => onClick?.(title)}
      className="cursor-pointer"
      style={{
        display: "flex", gap: 10, padding: "10px 12px", borderRadius: 8, background: "#fff",
        boxShadow: active
          ? "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.06), 0 0 0 1.5px rgba(37,99,235,0.2)"
          : "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.2s ease, transform 0.15s ease",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = active ? "0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06), 0 0 0 1.5px rgba(37,99,235,0.25)" : "0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = active ? "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.06), 0 0 0 1.5px rgba(37,99,235,0.2)" : "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.06)"; }}
    >
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 12, fontWeight: 600, color: "#18181b" }}>{title}</span>
          {active && <span style={{ fontSize: 8, fontWeight: 500, color: "#1d4ed8", background: "#dbeafe", borderRadius: 3, padding: "1px 5px", lineHeight: "14px" }}>AI Summary</span>}
        </div>
        <p style={{ fontSize: 10, color: "#52525b", margin: 0, lineHeight: 1.4 }} className="truncate">{summary}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {topics.map((t) => <span key={t} style={{ fontSize: 8, fontWeight: 500, color: "#71717a", background: "#fafafa", border: "0.5px solid #efeff0", borderRadius: 3, padding: "1px 4px", lineHeight: "14px" }}>{t}</span>)}
        </div>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-1.5">
        <span style={{ fontSize: 9, color: "#a1a1aa" }}>{date}</span>
        <span style={{ fontSize: 8, color: "#a1a1aa" }}>{duration}</span>
        <div className="flex -space-x-1.5">{participants.map((p) => <AvatarDot key={p} initials={p} />)}</div>
      </div>
    </div>
  );
}

/* ── Memory ── */

const typeColors: Record<string, string> = { decision: "#2563eb", milestone: "#059669", insight: "#7c3aed", blocker: "#ef4444" };

function MemoryCard({ type, title, body, date }: { type: string; title: string; body: string; date: string }) {
  return (
    <div
      className="cursor-pointer"
      style={{ background: "#fff", borderRadius: 8, padding: "10px 12px", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.06)", transition: "box-shadow 0.2s ease" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.06)"; }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="shrink-0" style={{ width: 7, height: 7, borderRadius: "50%", background: typeColors[type] || "#71717a" }} />
        <span style={{ fontSize: 9, fontWeight: 500, color: typeColors[type] || "#71717a", textTransform: "capitalize" }}>{type}</span>
        <span style={{ fontSize: 9, color: "#a1a1aa", marginLeft: "auto" }}>{date}</span>
      </div>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#18181b", margin: "0 0 3px" }}>{title}</p>
      <p style={{ fontSize: 10, color: "#52525b", margin: 0, lineHeight: 1.5 }} className="line-clamp-2">{body}</p>
    </div>
  );
}

/* ── Weekly Reports ── */

function ReportCard({ title, meetings, decisions, risks, highlights }: { title: string; meetings: number; decisions: number; risks: number; highlights: string[] }) {
  return (
    <div
      className="cursor-pointer"
      style={{ background: "#fff", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.06)", overflow: "hidden", transition: "box-shadow 0.2s ease" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.06)"; }}
    >
      <div style={{ padding: "10px 12px" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#18181b", margin: "0 0 4px" }}>{title}</p>
        <div className="flex gap-3 mb-3">
          <span style={{ fontSize: 9, color: "#52525b" }}><b style={{ color: "#18181b" }}>{meetings}</b> meetings</span>
          <span style={{ fontSize: 9, color: "#52525b" }}><b style={{ color: "#18181b" }}>{decisions}</b> decisions</span>
          <span style={{ fontSize: 9, color: "#52525b" }}><b style={{ color: "#18181b" }}>{risks}</b> risks</span>
        </div>
        <div className="flex flex-col gap-1">
          {highlights.map((h) => (
            <div key={h} className="flex items-start gap-1.5">
              <span style={{ color: "#2563eb", fontSize: 10, lineHeight: 1.5 }}>•</span>
              <span style={{ fontSize: 10, color: "#52525b", lineHeight: 1.5 }}>{h}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Commitments ── */

function TodoItem({ text, due, who, done, urgent, onToggle }: { text: string; due: string; who: string; done?: boolean; urgent?: boolean; onToggle: (t: string) => void }) {
  return (
    <div
      className="flex items-center gap-2.5 py-1 cursor-pointer group/todo"
      onClick={() => onToggle(text)}
      style={{ borderRadius: 4, transition: "background 0.15s ease" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.015)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      <div
        className="shrink-0"
        style={{
          width: 14, height: 14, borderRadius: 3,
          border: done ? "none" : "1.5px solid #d4d4d8",
          background: done ? "#2563eb" : "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.2s ease, border-color 0.2s ease, transform 0.15s ease",
          transform: done ? "scale(1)" : "scale(1)",
        }}
        onMouseEnter={e => { if (!done) (e.currentTarget as HTMLElement).style.borderColor = "#2563eb"; }}
        onMouseLeave={e => { if (!done) (e.currentTarget as HTMLElement).style.borderColor = "#d4d4d8"; }}
      >
        {done && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
      </div>
      <span className="flex-1" style={{ fontSize: 11, color: done ? "#a1a1aa" : "#18181b", textDecoration: done ? "line-through" : "none", fontWeight: 500, transition: "color 0.2s ease" }}>{text}</span>
      {urgent && !done && <span style={{ fontSize: 8, fontWeight: 600, color: "#ef4444", background: "#fef2f2", borderRadius: 3, padding: "1px 5px", lineHeight: "14px" }}>Urgent</span>}
      <AvatarDot initials={who} />
      <span style={{ fontSize: 9, color: "#a1a1aa" }}>{due}</span>
    </div>
  );
}

/* ── Home ── */

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="cursor-pointer"
      style={{ background: "#fff", borderRadius: 6, padding: "8px 10px", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.06)", transition: "box-shadow 0.2s ease, transform 0.15s ease" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.06)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
    >
      <p style={{ fontSize: 9, color: "#71717a", margin: 0 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 700, color, margin: "2px 0 0", fontVariantNumeric: "tabular-nums" }}>{value}</p>
    </div>
  );
}

function ActivityRow({ icon, text, time }: { icon: string; text: string; time: string }) {
  return (
    <div
      className="flex items-center gap-2 py-1 cursor-pointer"
      style={{ borderRadius: 4, transition: "background 0.15s ease" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.015)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">{iconPaths[icon]}</svg>
      <span className="flex-1 truncate" style={{ fontSize: 10, color: "#52525b" }}>{text}</span>
      <span className="shrink-0" style={{ fontSize: 9, color: "#a1a1aa" }}>{time}</span>
    </div>
  );
}

/* ── Shared avatar ── */

function AvatarDot({ initials }: { initials: string }) {
  return (
    <span className="flex items-center justify-center shrink-0" style={{ width: 16, height: 16, borderRadius: "50%", background: avatarColors[initials] || "#71717a", border: "1.5px solid #fff", fontSize: 7, fontWeight: 700, color: "#fff" }}>
      {initials}
    </span>
  );
}
