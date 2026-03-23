import { useState, useEffect, useCallback, useRef } from "react";
import { DemoProvider } from "../product/DemoProvider";
import { AppShell } from "../components/AppShell";
import type { NavItem, NavSection } from "../components/SidebarNav";
import { ThemeProvider, useTheme } from "../components/ThemeProvider/ThemeProvider";
import { HomePage } from "./v2-snapshot/HomePage";
import { WeeklyReportsPage } from "./v2-snapshot/WeeklyReportsPage";
import { MeetingNotesPage } from "./v2-snapshot/MeetingNotesPage";
import { TodosPage } from "./v2-snapshot/TodosPage";
import { MemoryPage } from "./v2-snapshot/MemoryPage";
import { SettingsPage } from "./v2-snapshot/SettingsPage";
import { AppsPage } from "./v2-snapshot/AppsPage";
import { DeepResearchPage } from "./v2-snapshot/DeepResearchPage";
import { RiskRadarPage } from "./v2-snapshot/RiskRadarPage";
import { ReportsPage } from "./v2-snapshot/ReportsPage";
import { ResearchPanel } from "./v2-snapshot/ResearchPanel";
import { ResearchProvider } from "./v2-snapshot/ResearchContext";
import { SunFilled, MoonFilled } from "../icons/filled";
import { AiSparkle } from "../icons/outline";
import styles from "./ProductTab.module.css";

const topItems: NavItem[] = [
  { id: "home", label: "Home", icon: "home" },
];

const sections: NavSection[] = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { id: "memory", label: "Memory", icon: "evaluations" },
      { id: "weekly-reports", label: "Weekly Reports", icon: "reports" },
      { id: "meeting-notes", label: "Meeting Notes", icon: "reviews" },
      { id: "deep-research", label: "Deep Research", icon: "workflows" },
      { id: "risk-radar", label: "Risk Radar", icon: "alerts" },
      { id: "reports", label: "Reports", icon: "reports" },
    ],
  },
  {
    id: "personal",
    label: "Personal",
    items: [
      { id: "todos", label: "Todos", icon: "assignments" },
      { id: "apps", label: "Apps", icon: "calibrations" },
    ],
  },
];

const footerItems: NavItem[] = [
  { id: "help", label: "Help", icon: "help" },
  { id: "settings", label: "Settings", icon: "settings" },
];

function ActivePage({ page, sageMeetingCompleted, onOpenChat }: { page: string; sageMeetingCompleted?: boolean; onOpenChat?: () => void }) {
  switch (page) {
    case "home": return <HomePage onOpenChat={onOpenChat} />;
    case "weekly-reports": return <WeeklyReportsPage onOpenChat={onOpenChat} />;
    case "meeting-notes": return <MeetingNotesPage sageMeetingCompleted={sageMeetingCompleted} onOpenChat={onOpenChat} />;
    case "todos": return <TodosPage onOpenChat={onOpenChat} />;
    case "memory": return <MemoryPage onOpenChat={onOpenChat} />;
    case "settings": return <SettingsPage />;
    case "apps": return <AppsPage />;
    case "deep-research": return <DeepResearchPage />;
    case "risk-radar": return <RiskRadarPage onOpenChat={onOpenChat} />;
    case "reports": return <ReportsPage onOpenChat={onOpenChat} />;
    default: return <HomePage />;
  }
}

function AccentToggle() {
  const { accent, setAccent } = useTheme();
  const isSage = accent === "sage";

  return (
    <button
      type="button"
      onClick={() => setAccent(isSage ? "blue" : "sage")}
      aria-label={isSage ? "Switch to blue accent" : "Switch to sage green accent"}
      className={`${styles.footerBtn} ${isSage ? styles.footerBtnActive : ""}`}
    >
      <span className={styles.footerBtnIcon}>
        {isSage ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 11C3 11 4 5 10 2C10 2 9 8 4 11" fill="#5f8a65" />
            <path d="M3 11C4.5 8 6.5 5.5 10 2" stroke="#3a5940" strokeWidth="1" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" fill="#3b82f6" />
          </svg>
        )}
      </span>
      {isSage ? "Sage" : "Blue"}
    </button>
  );
}

function FontToggle() {
  const { fontFamily, setFontFamily } = useTheme();
  const isInter = fontFamily === "inter";

  return (
    <button
      type="button"
      onClick={() => setFontFamily(isInter ? "geist" : "inter")}
      aria-label={isInter ? "Switch to Geist font" : "Switch to Inter font"}
      className={`${styles.footerBtn} ${isInter ? styles.footerBtnActive : ""}`}
    >
      <span className={styles.footerBtnIcon}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <text x="1" y="11.5" fontSize="11" fontWeight="600" fontFamily="system-ui" fill="currentColor">A</text>
        </svg>
      </span>
      {isInter ? "Inter" : "Geist"}
    </button>
  );
}

function GrayscaleToggle() {
  const { grayscale, setGrayscale } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setGrayscale(!grayscale)}
      aria-label={grayscale ? "Switch to lighter mode" : "Switch to grayscale mode"}
      className={`${styles.footerBtn} ${grayscale ? styles.footerBtnActive : ""}`}
    >
      <span className={styles.footerBtnIcon}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.25" />
          <path d="M7 1a6 6 0 0 1 0 12z" fill="currentColor" />
        </svg>
      </span>
      Grayscale
    </button>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={styles.footerBtn}
    >
      <span className={styles.footerBtnIcon}>
        {isDark ? <MoonFilled /> : <SunFilled />}
      </span>
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}

function ResearchToggle({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isOpen ? "Close research panel" : "Open research panel"}
      className={`${styles.footerBtn} ${isOpen ? styles.footerBtnActive : ""}`}
    >
      <span className={styles.footerBtnIcon}>
        <AiSparkle width={14} height={14} />
      </span>
      Research
      <kbd className={styles.kbdHint}>⌘⇧E</kbd>
    </button>
  );
}

const DEFAULT_PANEL_WIDTH = 380;
const MIN_PANEL_WIDTH = 300;
const MAX_PANEL_WIDTH = 540;

function ProductShell({ sageMeetingCompleted, initialPage }: { sageMeetingCompleted?: boolean; initialPage?: string }) {
  const [activeNav, setActiveNav] = useState(initialPage ?? "home");
  const [researchOpen, setResearchOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(DEFAULT_PANEL_WIDTH);

  useEffect(() => {
    if (initialPage) setActiveNav(initialPage);
  }, [initialPage]);

  const rowRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const toggleResearch = useCallback(() => setResearchOpen((o) => !o), []);

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    if (id === "deep-research") setResearchOpen(false);
  };

  /* Keyboard shortcut: Cmd+Shift+E / Ctrl+Shift+E */
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "e") {
        e.preventDefault();
        toggleResearch();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggleResearch]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMove = (ev: MouseEvent) => {
      if (!isDragging.current || !rowRef.current) return;
      const containerRect = rowRef.current.getBoundingClientRect();
      const newWidth = Math.round(containerRect.right - ev.clientX);
      setPanelWidth(Math.max(MIN_PANEL_WIDTH, Math.min(MAX_PANEL_WIDTH, newWidth)));
    };

    const onUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, []);

  const handleDragDoubleClick = useCallback(() => {
    setPanelWidth(DEFAULT_PANEL_WIDTH);
  }, []);

  const showPanel = researchOpen && activeNav !== "deep-research";

  return (
    <div style={{ height: "calc(100vh - 45px)" }}>
      <AppShell
        workspaceName="Sentra"
        workspaceAvatar={{ backgroundColor: "var(--tag-purple-700)" }}
        topItems={topItems}
        sections={sections}
        footerItems={footerItems}
        activeItemId={activeNav}
        onNavItemClick={handleNavClick}
        footerContent={
          <>
            <AccentToggle />
            <FontToggle />
            <GrayscaleToggle />
            <ResearchToggle isOpen={researchOpen} onToggle={toggleResearch} />
            <ThemeToggle />
          </>
        }
      >
        <div className={styles.pageRow} ref={rowRef}>
          <div className={styles.pageMain}>
            <ActivePage page={activeNav} sageMeetingCompleted={sageMeetingCompleted} onOpenChat={toggleResearch} />
          </div>
          {showPanel && (
            <>
              <div
                className={styles.researchDragHandle}
                onMouseDown={handleDragStart}
                onDoubleClick={handleDragDoubleClick}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize research panel"
              />
              <aside className={styles.researchPane} style={{ width: panelWidth }}>
                <ResearchPanel
                  onClose={() => setResearchOpen(false)}
                  onNavigate={(page) => { setActiveNav(page); setResearchOpen(false); }}
                  pageContext={activeNav}
                />
              </aside>
            </>
          )}
        </div>
      </AppShell>
    </div>
  );
}

export function ProductTabV2({ sageMeetingCompleted, initialPage }: { sageMeetingCompleted?: boolean; initialPage?: string } = {}) {
  return (
    <ThemeProvider>
      <DemoProvider>
        <ResearchProvider>
          <ProductShell sageMeetingCompleted={sageMeetingCompleted} initialPage={initialPage} />
        </ResearchProvider>
      </DemoProvider>
    </ThemeProvider>
  );
}
