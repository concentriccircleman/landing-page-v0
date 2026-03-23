import { useState } from "react";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { Switch } from "../../components/Switch";
import { TopBar } from "../../components/TopBar";
import { MagnifyingGlass, Cog, XMark } from "../../icons/outline";
import { FeatureBanner } from "../FeatureBanner";
import styles from "../AppsPage.module.css";

interface AppItem {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  color: string;
  icon: string;
  category: string;
}

const initialApps: AppItem[] = [
  { id: "a1", name: "Slack", description: "Sync meeting notes and action items to Slack channels automatically.", status: "active", color: "#4A154B", icon: "S", category: "Communication" },
  { id: "a2", name: "Google Calendar", description: "Auto-import meetings from Google Calendar. Detect and join scheduled calls.", status: "active", color: "#4285F4", icon: "G", category: "Calendar" },
  { id: "a3", name: "Notion", description: "Export weekly reports and meeting notes to Notion pages and databases.", status: "inactive", color: "#37352F", icon: "N", category: "Productivity" },
  { id: "a4", name: "Linear", description: "Create Linear issues from meeting action items. Auto-assign to team members.", status: "active", color: "#5E6AD2", icon: "L", category: "Project Management" },
  { id: "a5", name: "HubSpot", description: "Log meeting notes as CRM activities. Auto-update deal stages from conversations.", status: "inactive", color: "#FF7A59", icon: "H", category: "CRM" },
  { id: "a6", name: "Zoom", description: "Automatically record and transcribe Zoom meetings. Join with one click.", status: "active", color: "#2D8CFF", icon: "Z", category: "Meetings" },
  { id: "a7", name: "Google Meet", description: "Record and transcribe Google Meet calls. Browser extension required.", status: "active", color: "#00897B", icon: "M", category: "Meetings" },
  { id: "a8", name: "Microsoft Teams", description: "Connect to Teams meetings. Transcription and note-taking available.", status: "inactive", color: "#6264A7", icon: "T", category: "Meetings" },
];

function GridIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="5" height="5" rx="1" />
      <rect x="8" y="1" width="5" height="5" rx="1" />
      <rect x="1" y="8" width="5" height="5" rx="1" />
      <rect x="8" y="8" width="5" height="5" rx="1" />
    </svg>
  );
}

function ListIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 3h12M1 7h12M1 11h12" />
    </svg>
  );
}

export function AppsPage() {
  const [apps, setApps] = useState(initialApps);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [configApp, setConfigApp] = useState<AppItem | null>(null);

  const toggleApp = (id: string) => {
    setApps((prev) => prev.map((a) =>
      a.id === id ? { ...a, status: a.status === "active" ? "inactive" as const : "active" as const } : a
    ));
  };

  const activeCount = apps.filter((a) => a.status === "active").length;

  const filtered = apps.filter((a) =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(filtered.map((a) => a.category))];

  return (
    <div className={styles.page}>
      <TopBar
        breadcrumbs={[{ label: "Apps" }]}
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <MagnifyingGlass
                width={13}
                height={13}
                style={{ position: "absolute", left: 10, color: "var(--fg-muted)", pointerEvents: "none" } as React.CSSProperties}
              />
              <input
                type="text"
                placeholder="Search apps..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: 180,
                  height: 30,
                  paddingLeft: 30,
                  paddingRight: 10,
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-base)",
                  fontSize: "var(--font-size-xs)",
                  color: "var(--fg-base)",
                  fontFamily: "var(--font-family)",
                  outline: "none",
                }}
              />
            </div>
            <div className={styles.viewToggle}>
              <button
                type="button"
                className={`${styles.viewToggleBtn} ${viewMode === "grid" ? styles.viewToggleBtnActive : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <GridIcon />
              </button>
              <span className={styles.viewToggleDivider} />
              <button
                type="button"
                className={`${styles.viewToggleBtn} ${viewMode === "list" ? styles.viewToggleBtnActive : ""}`}
                onClick={() => setViewMode("list")}
                title="List view"
              >
                <ListIcon />
              </button>
            </div>
          </div>
        }
      />

      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Apps</h1>
          <p className={styles.pageDesc}>Integrations and tools connected to your workspace.</p>
        </div>

        <FeatureBanner storageKey="apps">
          Connect and manage third-party tools and integrations with your workspace.
        </FeatureBanner>

        <div className={styles.headerRow}>
          <div className={styles.headerLeft}>
            <h2 className={styles.headerTitle}>Integrations</h2>
            <span className={styles.headerCount}>{activeCount} of {apps.length} active</span>
          </div>
        </div>

        {viewMode === "grid" ? (
          /* ── Grid View ── */
          <div>
            {categories.map((cat) => (
              <div key={cat} className={styles.categoryGroup}>
                <div className={styles.categoryLabel}>{cat}</div>
                <div className={styles.grid}>
                  {filtered.filter((a) => a.category === cat).map((app) => (
                    <div key={app.id} className={styles.gridCard}>
                      <div className={styles.gridCardTop}>
                        <div className={styles.appIcon} style={{ background: app.color }}>
                          {app.icon}
                        </div>
                        <span className={styles.gridCardName}>{app.name}</span>
                        <Switch
                          checked={app.status === "active"}
                          onCheckedChange={() => toggleApp(app.id)}
                        />
                      </div>
                      <div className={styles.gridCardDesc}>{app.description}</div>
                      <div className={styles.gridCardFooter}>
                        <Badge variant={app.status === "active" ? "success" : "secondary"} size="sm">
                          {app.status === "active" ? "Connected" : "Inactive"}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => setConfigApp(app)}>
                          <Cog width={13} height={13} /> Configure
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── List View ── */
          <div>
            {categories.map((cat) => (
              <div key={cat} className={styles.categoryGroup}>
                <div className={styles.categoryLabel}>{cat}</div>
                <div className={styles.listContainer}>
                  {filtered.filter((a) => a.category === cat).map((app) => (
                    <div key={app.id} className={styles.listRow}>
                      <div className={`${styles.appIcon} ${styles.listIconSmall}`} style={{ background: app.color }}>
                        {app.icon}
                      </div>
                      <div className={styles.listRowInfo}>
                        <span className={styles.listRowName}>{app.name}</span>
                        <span className={styles.listRowDesc}>{app.description}</span>
                      </div>
                      <Badge variant={app.status === "active" ? "success" : "secondary"} size="sm">
                        {app.status === "active" ? "Connected" : "Inactive"}
                      </Badge>
                      <div className={styles.listRowActions}>
                        <Switch
                          checked={app.status === "active"}
                          onCheckedChange={() => toggleApp(app.id)}
                        />
                        <Button variant="ghost" size="sm" onClick={() => setConfigApp(app)}>
                          <Cog width={13} height={13} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Configure Overlay ── */}
      {configApp && (
        <div className={styles.configOverlay} onClick={() => setConfigApp(null)}>
          <div className={styles.configCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.configHeader}>
              <div className={styles.configHeaderLeft}>
                <div className={styles.appIcon} style={{ background: configApp.color }}>
                  {configApp.icon}
                </div>
                <div>
                  <div className={styles.configTitle}>{configApp.name}</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setConfigApp(null)}>
                <XMark width={14} height={14} />
              </Button>
            </div>
            <div className={styles.configBody}>
              <div className={styles.configFieldGroup}>
                <span className={styles.configFieldLabel}>Status</span>
                <div className={styles.configToggleRow}>
                  <span className={styles.configToggleLabel}>
                    {configApp.status === "active" ? "Connected & syncing" : "Not connected"}
                  </span>
                  <Switch
                    checked={configApp.status === "active"}
                    onCheckedChange={() => {
                      toggleApp(configApp.id);
                      setConfigApp((prev) => prev ? { ...prev, status: prev.status === "active" ? "inactive" : "active" } : null);
                    }}
                  />
                </div>
              </div>
              <div className={styles.configFieldGroup}>
                <span className={styles.configFieldLabel}>Category</span>
                <div className={styles.configFieldValue}>{configApp.category}</div>
              </div>
              <div className={styles.configFieldGroup}>
                <span className={styles.configFieldLabel}>Description</span>
                <div className={styles.configFieldValue}>{configApp.description}</div>
              </div>
              <div className={styles.configFieldGroup}>
                <span className={styles.configFieldLabel}>Permissions</span>
                <div className={styles.configToggleRow}>
                  <span className={styles.configToggleLabel}>Read access</span>
                  <Switch checked={true} onCheckedChange={() => {}} />
                </div>
                <div className={styles.configToggleRow}>
                  <span className={styles.configToggleLabel}>Write access</span>
                  <Switch checked={configApp.status === "active"} onCheckedChange={() => {}} />
                </div>
              </div>
            </div>
            <div className={styles.configFooter}>
              <Button variant="ghost" size="sm" onClick={() => setConfigApp(null)}>Close</Button>
              <Button variant="primary" size="sm" onClick={() => setConfigApp(null)}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
