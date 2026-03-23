import { useState } from "react";
import {
  LinkedInNotificationsPage,
  LiAvatar,
  LiActionButton,
  LiTabItem,
  LiOverflowButton,
  LiNewNotificationsBanner,
  LiNewsIcon,
  LiJobIcon,
  LiEventIcon,
  LiProfileViewIcon,
  LiNotificationItem,
  LiTabBar,
  LiNotificationFeed,
  LiVerifiedBadge,
  LiProfileSidebar,
  LiPromotedCard,
  liStyles,
} from "../components/LinkedInTest";
import {
  MeetingNotifBarPreview,
  RecordingPillPreview,
  MeetingNoteEditorPreview,
} from "./MeetingRecorderPreviews";

const sectionHeading: React.CSSProperties = {
  fontSize: "0.875rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--fg-muted)",
  marginBottom: "1rem",
};

const label: React.CSSProperties = {
  fontSize: 11,
  color: "var(--fg-muted)",
  marginBottom: 4,
  fontFamily: "var(--font-family)",
};

const componentCard: React.CSSProperties = {
  background: "var(--bg-base)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-card)",
  padding: "var(--space-4)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-3)",
};

const skuTag: React.CSSProperties = {
  fontSize: 10,
  fontFamily: "var(--font-family)",
  fontWeight: 600,
  letterSpacing: "0.06em",
  color: "var(--tag-purple-text)",
  background: "var(--tag-purple-bg)",
  padding: "2px 6px",
  borderRadius: "var(--radius-sm)",
  textTransform: "uppercase",
};

const layerBadge = (color: string): React.CSSProperties => ({
  fontSize: 10,
  fontFamily: "var(--font-family)",
  fontWeight: 600,
  letterSpacing: "0.06em",
  color: color,
  background: `${color}15`,
  padding: "2px 8px",
  borderRadius: "var(--radius-sm)",
  textTransform: "uppercase",
});

function ComponentShowcase({
  sku,
  name,
  layer,
  children,
}: {
  sku: string;
  name: string;
  layer: "atom" | "molecule" | "organism" | "page";
  children: React.ReactNode;
}) {
  const layerColors = {
    atom: "var(--tag-purple-text)",
    molecule: "var(--fg-info)",
    organism: "var(--fg-success)",
    page: "var(--fg-warning)",
  };

  return (
    <div style={componentCard}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={skuTag}>{sku}</span>
        <span style={layerBadge(layerColors[layer])}>{layer}</span>
        <span
          style={{
            fontFamily: "var(--font-family-display)",
            fontSize: 15,
            fontWeight: 600,
            color: "var(--fg-base)",
          }}
        >
          {name}
        </span>
      </div>
      <div
        style={{
          background: "var(--bg-subtle)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-4)",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function ExperimentsTab() {
  const [tabBarDemo, setTabBarDemo] = useState("All");

  return (
    <div style={{ padding: "2rem", fontFamily: "var(--font-family)" }}>
      <h1
        style={{
          fontFamily: "var(--font-family-display)",
          fontSize: 24,
          fontWeight: 600,
          color: "var(--fg-base)",
          marginBottom: 4,
        }}
      >
        Experiments
      </h1>
      <p
        style={{
          fontSize: 14,
          color: "var(--fg-muted)",
          marginBottom: "2rem",
          lineHeight: 1.5,
        }}
      >
        Migration dry run — LinkedIn Notifications page rebuilt with Sentra
        design tokens. Every component individually showcased, then assembled
        into the full page.
      </p>

      {/* ═══════════════════════════════════════
          Meeting Recorder — Blue Pass
          ═══════════════════════════════════════ */}
      <h2 style={sectionHeading}>Meeting Recorder — Blue Pass</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "var(--space-4)",
          marginBottom: "3rem",
        }}
      >
        <ComponentShowcase sku="NEW-0087" name="MeetingNotifBar" layer="molecule">
          <MeetingNotifBarPreview />
        </ComponentShowcase>

        <ComponentShowcase sku="NEW-0088" name="RecordingPill" layer="molecule">
          <RecordingPillPreview />
        </ComponentShowcase>

        <ComponentShowcase sku="NEW-0089" name="MeetingNoteEditor" layer="organism">
          <MeetingNoteEditorPreview />
        </ComponentShowcase>
      </div>

      {/* ═══════════════════════════════════════
          Layer 0 — Atoms
          ═══════════════════════════════════════ */}
      <h2 style={sectionHeading}>Layer 0 — Atoms</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "var(--space-4)",
          marginBottom: "3rem",
        }}
      >
        {/* NEW-0001: Avatar */}
        <ComponentShowcase sku="NEW-0001" name="Avatar" layer="atom">
          <div>
            <p style={label}>circle-sm (40px)</p>
            <div style={{ display: "flex", gap: 8 }}>
              <LiAvatar variant="circle-sm" initials="SN" />
              <LiAvatar variant="circle-sm" initials="MA" />
              <LiAvatar variant="circle-sm" initials="DW" />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <p style={label}>circle-lg (64px)</p>
            <LiAvatar variant="circle-lg" initials="SN" />
          </div>
          <div style={{ marginTop: 12 }}>
            <p style={label}>circle-xs (20px)</p>
            <div style={{ display: "flex", gap: 8 }}>
              <LiAvatar variant="circle-xs" initials="B" />
              <LiAvatar variant="circle-xs" initials="K" />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <p style={label}>square-sm (40px) / square-md (48px)</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <LiAvatar variant="square-sm" initials="H" />
              <LiAvatar variant="square-md" initials="H" />
            </div>
          </div>
        </ComponentShowcase>

        {/* NEW-0002: ActionButton */}
        <ComponentShowcase sku="NEW-0002" name="ActionButton" layer="atom">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <LiActionButton label="Say congrats" />
            <LiActionButton label="View jobs" />
            <LiActionButton label="Say happy birthday" />
          </div>
        </ComponentShowcase>

        {/* NEW-0003: TabItem */}
        <ComponentShowcase sku="NEW-0003" name="TabItem" layer="atom">
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border-subtle)" }}>
            <LiTabItem label="Active" active />
            <LiTabItem label="Default" />
            <LiTabItem label="Default" />
          </div>
        </ComponentShowcase>

        {/* NEW-0004: OverflowButton */}
        <ComponentShowcase sku="NEW-0004" name="OverflowButton" layer="atom">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <LiOverflowButton />
            <span style={{ fontSize: 12, color: "var(--fg-muted)" }}>
              Hover to see state change
            </span>
          </div>
        </ComponentShowcase>

        {/* NEW-0005: NewNotificationsBanner */}
        <ComponentShowcase
          sku="NEW-0005"
          name="NewNotificationsBanner"
          layer="atom"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <LiNewNotificationsBanner count={3} />
            <LiNewNotificationsBanner count={1} />
          </div>
        </ComponentShowcase>

        {/* Type Icons */}
        <ComponentShowcase sku="NEW-0001b" name="Type Icons" layer="atom">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <LiNewsIcon />
              <p style={{ ...label, marginTop: 4 }}>News</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <LiJobIcon />
              <p style={{ ...label, marginTop: 4 }}>Job</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <LiEventIcon />
              <p style={{ ...label, marginTop: 4 }}>Event</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <LiProfileViewIcon />
              <p style={{ ...label, marginTop: 4 }}>Profile</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <LiVerifiedBadge />
              <p style={{ ...label, marginTop: 4 }}>Verified</p>
            </div>
          </div>
        </ComponentShowcase>
      </div>

      {/* ═══════════════════════════════════════
          Layer 1 — Molecules
          ═══════════════════════════════════════ */}
      <h2 style={sectionHeading}>Layer 1 — Molecules</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
          marginBottom: "3rem",
        }}
      >
        {/* NEW-0006: NotificationItem — all variants */}
        <ComponentShowcase
          sku="NEW-0006"
          name="NotificationItem"
          layer="molecule"
        >
          <p
            style={{
              ...label,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 8,
            }}
          >
            All variants
          </p>
          <div
            style={{
              background: "var(--bg-base)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <LiNotificationItem
              type="news"
              text={
                <>
                  <span className={liStyles.notifTextBold}>
                    Figma&apos;s CEO
                  </span>{" "}
                  just announced its Q4 results. See his post.
                </>
              }
              time="49m"
              unread
            />
            <LiNotificationItem
              type="congratulations"
              avatar={{ initials: "MA" }}
              text={
                <>
                  Congratulate{" "}
                  <span className={liStyles.notifTextBold}>Medha Acharya</span>{" "}
                  on 2 years at Vascyte.
                </>
              }
              time="52m"
              action={{ label: "Say congrats" }}
              unread
            />
            <LiNotificationItem
              type="popularPost"
              avatar={{ initials: "AD" }}
              text={
                <>
                  This post by{" "}
                  <span className={liStyles.notifTextBold}>
                    Anique Drumright
                  </span>{" "}
                  is popular with your network...
                </>
              }
              time="1h"
              meta="76 reactions · 80 comments"
            />
            <LiNotificationItem
              type="jobAlert"
              text={
                <>
                  <span className={liStyles.notifTextBold}>
                    product designer
                  </span>
                  : new opportunities in NYC.
                </>
              }
              time="4h"
              action={{ label: "View jobs" }}
            />
            <LiNotificationItem
              type="birthday"
              avatar={{ initials: "DW" }}
              text={
                <>
                  Wish{" "}
                  <span className={liStyles.notifTextBold}>Dylan Wan</span> a
                  happy birthday.
                </>
              }
              time="5h"
              action={{ label: "Say happy birthday" }}
            />
            <LiNotificationItem
              type="event"
              text={
                <>
                  <span className={liStyles.notifTextBold}>14.ai</span> was
                  live for Building Category-Dominant Brands...
                </>
              }
              time="6h"
            />
            <LiNotificationItem
              type="profileView"
              text={
                <>
                  <span className={liStyles.notifTextBold}>20 people</span>{" "}
                  viewed your profile.
                </>
              }
              time="6h"
            />
          </div>
        </ComponentShowcase>

        {/* NEW-0007: TabBar */}
        <ComponentShowcase sku="NEW-0007" name="TabBar" layer="molecule">
          <LiTabBar
            tabs={["All", "Jobs", "My posts", "Mentions"]}
            activeTab={tabBarDemo}
            onTabChange={setTabBarDemo}
          />
        </ComponentShowcase>
      </div>

      {/* ═══════════════════════════════════════
          Layer 2 — Organisms
          ═══════════════════════════════════════ */}
      <h2 style={sectionHeading}>Layer 2 — Organisms</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: "var(--space-4)",
          marginBottom: "3rem",
          alignItems: "start",
        }}
      >
        {/* NEW-0008: NotificationFeed */}
        <ComponentShowcase
          sku="NEW-0008"
          name="NotificationFeed"
          layer="organism"
        >
          <div style={{ maxHeight: 480, overflow: "auto" }}>
            <LiNotificationFeed />
          </div>
        </ComponentShowcase>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {/* NEW-0009: ProfileSidebar */}
          <ComponentShowcase
            sku="NEW-0009"
            name="ProfileSidebar"
            layer="organism"
          >
            <LiProfileSidebar />
          </ComponentShowcase>

          {/* NEW-0010: PromotedCard */}
          <ComponentShowcase
            sku="NEW-0010"
            name="PromotedCard"
            layer="organism"
          >
            <LiPromotedCard />
          </ComponentShowcase>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          Layer 3 — Assembled Page
          ═══════════════════════════════════════ */}
      <h2 style={sectionHeading}>Layer 3 — Assembled Page</h2>

      {/* Light Mode */}
      <ComponentShowcase
        sku="NEW-0011"
        name="NotificationsPage"
        layer="page"
      >
        <div style={{ height: "80vh", overflow: "auto" }}>
          <LinkedInNotificationsPage />
        </div>
      </ComponentShowcase>

      {/* Dark Mode */}
      <div style={{ marginTop: "var(--space-4)" }}>
        <ComponentShowcase
          sku="NEW-0011"
          name="NotificationsPage (Dark Mode)"
          layer="page"
        >
          <div data-theme="dark" style={{ height: "80vh", overflow: "auto", borderRadius: "var(--radius-md)" }}>
            <LinkedInNotificationsPage />
          </div>
        </ComponentShowcase>
      </div>
    </div>
  );
}
