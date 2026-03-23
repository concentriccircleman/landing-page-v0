import { useState, useCallback, lazy, Suspense } from "react";

const DesignSystemTab = lazy(() => import("./DesignSystemTab").then(m => ({ default: m.DesignSystemTab })));
const ExperimentsTab = lazy(() => import("./ExperimentsTab").then(m => ({ default: m.ExperimentsTab })));
const MigrationAtomsTab = lazy(() => import("./MigrationAtomsTab").then(m => ({ default: m.MigrationAtomsTab })));
const ReviewTool = lazy(() => import("./ReviewTool").then(m => ({ default: m.ReviewTool })));
const ProductTab = lazy(() => import("./ProductTab").then(m => ({ default: m.ProductTab })));
const MeetingRecorderPage = lazy(() => import("./MeetingRecorderPage").then(m => ({ default: m.MeetingRecorderPage })));
const ProjectSageTab = lazy(() => import("./ProjectSageTab").then(m => ({ default: m.ProjectSageTab })));
const ProductTabV2 = lazy(() => import("./ProductTabV2").then(m => ({ default: m.ProductTabV2 })));

/* ── Tab navigation styles ── */
const tabNavStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  gap: 0,
  borderBottom: "1px solid var(--border-subtle)",
  background: "var(--bg-base)",
  padding: "0 2rem",
  fontFamily: "var(--font-family)",
};

const tabBtnBase: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 44,
  padding: "0 20px",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 500,
  fontFamily: "inherit",
  color: "var(--fg-muted)",
  position: "relative",
  transition: "color 150ms ease",
};

const tabBtnActive: React.CSSProperties = {
  ...tabBtnBase,
  color: "var(--fg-base)",
};

const tabs = [
  { id: "design-system", label: "Design System" },
  { id: "experiments", label: "Experiments" },
  { id: "migration-atoms", label: "Migration" },
  { id: "review", label: "Review" },
  { id: "product", label: "Product" },
  { id: "product-v2", label: "Product V2 (Baseline)" },
  { id: "meeting-recorder", label: "Meeting Recorder" },
  { id: "project-sage", label: "Project Sage" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function Playground() {
  const urlTab = new URLSearchParams(window.location.search).get("tab") as TabId | null;
  const [activeTab, setActiveTab] = useState<TabId>(urlTab ?? "product");
  const [sageMeetingCompleted, setSageMeetingCompleted] = useState(false);
  const [productInitialPage, setProductInitialPage] = useState<string | undefined>();

  const handleNavigateToProduct = useCallback(() => {
    setSageMeetingCompleted(true);
    setProductInitialPage("meeting-notes");
    setActiveTab("product");
  }, []);

  const handleNavigateToSage = useCallback(() => {
    setActiveTab("project-sage");
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-family)", minHeight: "100vh", background: "var(--bg-subtle)" }}>
      <nav style={tabNavStyle}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            style={activeTab === tab.id ? tabBtnActive : tabBtnBase}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span style={{ position: "absolute", bottom: 0, left: 20, right: 20, height: 2, background: "var(--fg-base)", borderRadius: 1 }} />
            )}
          </button>
        ))}
      </nav>

      <Suspense fallback={<div style={{ padding: "2rem", color: "var(--fg-muted)" }}>Loading…</div>}>
        {activeTab === "design-system" && <DesignSystemTab />}
        {activeTab === "experiments" && <ExperimentsTab />}
        {activeTab === "migration-atoms" && <MigrationAtomsTab />}
        {activeTab === "review" && <ReviewTool />}
        {activeTab === "product" && <ProductTab sageMeetingCompleted={sageMeetingCompleted} initialPage={productInitialPage} onNavigateToSage={handleNavigateToSage} />}
        {activeTab === "meeting-recorder" && <MeetingRecorderPage />}
        {activeTab === "product-v2" && <ProductTabV2 />}
        {activeTab === "project-sage" && <ProjectSageTab onNavigateToProduct={handleNavigateToProduct} />}
      </Suspense>
    </div>
  );
}
