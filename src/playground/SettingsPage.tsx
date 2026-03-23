import { useState } from "react";
import { useDemo } from "../product/DemoProvider";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import { Switch } from "../components/Switch";
import { Separator } from "../components/Separator";
import { Avatar } from "../components/Avatar";
import { Tabs, TabsList, TabsTrigger } from "../components/Tabs";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "../components/Select";
import { TopBar } from "../components/TopBar";
import styles from "./SettingsPage.module.css";

const LEADER_ROLES = new Set(["Admin", "PM", "Manager", "Lead", "Director", "VP", "CTO", "CEO"]);

const integrations = [
  { id: "gcal", name: "Google Calendar", desc: "Auto-import meetings from Google Calendar", connected: true, scope: "workspace" as const },
  { id: "slack", name: "Slack", desc: "Post summaries and notifications to Slack channels", connected: true, scope: "workspace" as const },
  { id: "zoom", name: "Zoom", desc: "Record and transcribe Zoom meetings", connected: false, scope: "workspace" as const },
  { id: "notion", name: "Notion", desc: "Export reports and notes to Notion pages", connected: false, scope: "workspace" as const },
  { id: "personal-gcal", name: "Personal Google Calendar", desc: "Your personal calendar for scheduling", connected: true, scope: "personal" as const },
  { id: "personal-drive", name: "Google Drive", desc: "Save recordings and exports to your Drive", connected: false, scope: "personal" as const },
];

const teamMembers = [
  { id: "u1", name: "Shaurya", email: "shaurya@sentra.ai", role: "Admin", initials: "SH" },
  { id: "u2", name: "Alice Johnson", email: "alice@sentra.ai", role: "Engineer", initials: "AJ" },
  { id: "u3", name: "Bob Chen", email: "bob@sentra.ai", role: "Designer", initials: "BC" },
  { id: "u4", name: "Carol Davis", email: "carol@sentra.ai", role: "PM", initials: "CD" },
  { id: "u5", name: "Dave Wilson", email: "dave@sentra.ai", role: "Engineer", initials: "DW" },
];

export function SettingsPage() {
  const { mockUser } = useDemo();
  const isLeader = LEADER_ROLES.has(mockUser.role);
  const [tab, setTab] = useState("profile");
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [slackNotifs, setSlackNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [autoRecord, setAutoRecord] = useState(true);
  const [aiSummaries, setAiSummaries] = useState(true);
  const [timezone, setTimezone] = useState("PST");
  const [connectedIntegrations, setConnectedIntegrations] = useState(
    new Set(integrations.filter((i) => i.connected).map((i) => i.id))
  );

  const toggleIntegration = (id: string) => {
    setConnectedIntegrations((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={styles.page}>
      <TopBar breadcrumbs={[{ label: "Settings" }]} />

      <p className={styles.pageDescription}>Manage your account, preferences, and integrations.</p>

      <div className={styles.tabsWrapper}>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            {isLeader && <TabsTrigger value="team">Team</TabsTrigger>}
          </TabsList>
        </Tabs>
      </div>

      <div className={styles.content}>
        {tab === "profile" && (
          <>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Profile</h2>
              <p className={styles.sectionDesc}>Your personal information and account details.</p>
              <div className={styles.avatarSection}>
                <Avatar content="letters" initials={mockUser.avatar} size="40" />
                <div className={styles.avatarInfo}>
                  <Button variant="secondary" size="sm">Change avatar</Button>
                  <span style={{ fontSize: "var(--font-size-xs)", color: "var(--fg-muted)" }}>JPG, PNG, or GIF. Max 2MB.</span>
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <div className={styles.fieldRow}>
                  <Label htmlFor="settings-name">Full name</Label>
                  <Input id="settings-name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className={styles.fieldRow}>
                  <Label htmlFor="settings-email">Email</Label>
                  <Input id="settings-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className={styles.fieldRow}>
                  <Label htmlFor="settings-role">Role</Label>
                  <Input id="settings-role" value={mockUser.role} disabled />
                </div>
              </div>
              <div style={{ marginTop: "var(--space-4)" }}>
                <Button variant="primary" size="sm">Save changes</Button>
              </div>
            </div>
          </>
        )}

        {tab === "notifications" && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Notifications</h2>
            <p className={styles.sectionDesc}>Choose how and when you receive notifications.</p>
            <div className={styles.fieldGroup}>
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>Email notifications</span>
                  <span className={styles.toggleDesc}>Receive meeting summaries and action items via email.</span>
                </div>
                <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
              </div>
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>Slack notifications</span>
                  <span className={styles.toggleDesc}>Get real-time notifications in your Slack workspace.</span>
                </div>
                <Switch checked={slackNotifs} onCheckedChange={setSlackNotifs} />
              </div>
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>Weekly digest</span>
                  <span className={styles.toggleDesc}>Receive a summary of all meetings and action items every Monday.</span>
                </div>
                <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
              </div>
            </div>
          </div>
        )}

        {tab === "preferences" && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Preferences</h2>
            <p className={styles.sectionDesc}>Customize your Sentra experience.</p>
            <div className={styles.fieldGroup}>
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>Auto-record meetings</span>
                  <span className={styles.toggleDesc}>Automatically start recording when a meeting begins.</span>
                </div>
                <Switch checked={autoRecord} onCheckedChange={setAutoRecord} />
              </div>
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <span className={styles.toggleLabel}>AI-generated summaries</span>
                  <span className={styles.toggleDesc}>Automatically generate meeting summaries after each call. When disabled, Sentra will still record and transcribe but won't produce a summary or extract action items.</span>
                </div>
                <Switch checked={aiSummaries} onCheckedChange={setAiSummaries} />
              </div>
              <div className={styles.fieldRow} style={{ marginTop: "var(--space-4)" }}>
                <Label>Timezone</Label>
                <div style={{ width: 200 }}>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PST">Pacific (PST)</SelectItem>
                    <SelectItem value="MST">Mountain (MST)</SelectItem>
                    <SelectItem value="CST">Central (CST)</SelectItem>
                    <SelectItem value="EST">Eastern (EST)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "integrations" && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Integrations</h2>
            <p className={styles.sectionDesc}>Connect Sentra with your tools and services.</p>

            <div className={styles.intSection}>
              <h3 className={styles.intSectionTitle}>Workspace Integrations</h3>
              <p className={styles.intSectionDesc}>Shared across your team — managed by workspace admins.</p>
              <div className={styles.intList}>
                {integrations.filter((i) => i.scope === "workspace").map((int) => {
                  const isConnected = connectedIntegrations.has(int.id);
                  return (
                    <div key={int.id} className={styles.intCard}>
                      <div className={styles.intCardBody}>
                        <span className={styles.intCardName}>{int.name}</span>
                        <span className={styles.intCardDesc}>{int.desc}</span>
                      </div>
                      <div className={styles.intCardRight}>
                        {isConnected && <Badge variant="success" size="sm">Connected</Badge>}
                        <Button
                          variant={isConnected ? "ghost" : "secondary"}
                          size="sm"
                          onClick={() => toggleIntegration(int.id)}
                        >
                          {isConnected ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div className={styles.intSection}>
              <h3 className={styles.intSectionTitle}>Personal Connections</h3>
              <p className={styles.intSectionDesc}>Your personal accounts and services.</p>
              <div className={styles.intList}>
                {integrations.filter((i) => i.scope === "personal").map((int) => {
                  const isConnected = connectedIntegrations.has(int.id);
                  return (
                    <div key={int.id} className={styles.intCard}>
                      <div className={styles.intCardBody}>
                        <span className={styles.intCardName}>{int.name}</span>
                        <span className={styles.intCardDesc}>{int.desc}</span>
                      </div>
                      <div className={styles.intCardRight}>
                        {isConnected && <Badge variant="success" size="sm">Connected</Badge>}
                        <Button
                          variant={isConnected ? "ghost" : "secondary"}
                          size="sm"
                          onClick={() => toggleIntegration(int.id)}
                        >
                          {isConnected ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab === "team" && isLeader && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Team Members</h2>
            <p className={styles.sectionDesc}>Manage your workspace members and their roles.</p>

            <div className={styles.teamHeader}>
              <Input placeholder="Search members..." size="sm" style={{ width: 200 }} />
              <Button variant="primary" size="sm">Invite Member</Button>
            </div>

            <div className={styles.teamTable}>
              <div className={styles.teamTableHead}>
                <span className={styles.teamCol}>Member</span>
                <span className={styles.teamColRole}>Role</span>
                <span className={styles.teamColActions}>Actions</span>
              </div>
              {teamMembers.map((m) => (
                <div key={m.id} className={styles.teamRow}>
                  <div className={styles.teamMember}>
                    <Avatar content="letters" initials={m.initials} size="28" />
                    <div className={styles.teamMemberInfo}>
                      <span className={styles.teamMemberName}>{m.name}</span>
                      <span className={styles.teamMemberEmail}>{m.email}</span>
                    </div>
                  </div>
                  <div className={styles.teamColRole}>
                    <Badge variant={m.role === "Admin" ? "info" : "outline"} size="sm">{m.role}</Badge>
                  </div>
                  <div className={styles.teamColActions}>
                    <Select value={m.role.toLowerCase()} size="sm">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="engineer">Engineer</SelectItem>
                        <SelectItem value="designer">Designer</SelectItem>
                        <SelectItem value="pm">PM</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
