import {
  V2NotifBar,
  V2PillCollapsed,
  V2PillExpanded,
  V2PillPaused,
  V2NoteEditor,
} from "./MeetingRecorderPage";

export function MeetingNotifBarPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 480 }}>
      <V2NotifBar title="Critique of current UI/UX" subtitle="Starting now" />
      <V2NotifBar title="All Hands" subtitle="Friday 10:00 PM" dotColor="var(--status-green)" />
      <V2NotifBar title="Urgent: Security Review" subtitle="Requires immediate attention" dotColor="var(--status-red)" />
    </div>
  );
}

export function RecordingPillPreview() {
  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
      <V2PillCollapsed />
      <V2PillExpanded time="03:42" />
      <V2PillPaused time="12:07" />
    </div>
  );
}

export function MeetingNoteEditorPreview() {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
      <V2NoteEditor state="empty" />
      <V2NoteEditor state="writing" />
      <V2NoteEditor state="with-content" />
    </div>
  );
}
