import { useState } from "react";
import { useDemo } from "../../product/DemoProvider";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Label } from "../../components/Label";
import { Switch } from "../../components/Switch";
import { Separator } from "../../components/Separator";
import { Avatar } from "../../components/Avatar";
import { Tabs, TabsList, TabsTrigger } from "../../components/Tabs";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "../../components/Select";
import { TopBar } from "../../components/TopBar";
import styles from "../SettingsPage.module.css";

export function SettingsPage() {
  const { mockUser } = useDemo();
  const [tab, setTab] = useState("profile");
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [slackNotifs, setSlackNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [autoRecord, setAutoRecord] = useState(true);
  const [aiSummaries, setAiSummaries] = useState(true);
  const [timezone, setTimezone] = useState("PST");

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

            <Separator />

            <div className={styles.section} style={{ marginTop: "var(--space-6)" }}>
              <div className={styles.dangerZone}>
                <h3 className={styles.dangerTitle}>Danger zone</h3>
                <p className={styles.dangerDesc}>Permanently delete your account and all associated data. This action cannot be undone.</p>
                <Button variant="destructive" size="sm">Delete account</Button>
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
                  <span className={styles.toggleDesc}>Automatically generate meeting summaries after each call.</span>
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
      </div>
    </div>
  );
}
