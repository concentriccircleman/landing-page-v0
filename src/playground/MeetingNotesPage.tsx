import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Badge } from "../components/Badge";
import { Input } from "../components/Input";
import { Avatar } from "../components/Avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/Tabs";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "../components/Select";
import { Separator } from "../components/Separator";
import { Markdown } from "../components/Markdown";
import { TopBar } from "../components/TopBar";
import {
  Bolt as BoltIcon,
  AiSparkle,
  Cog as SettingsIcon,
  Link as LinkIcon,
  People as PeopleIcon,
  Clipboard,
  ChevronDown,
} from "../icons/outline";
import { Button } from "../components/Button";
import { FeatureBanner } from "./FeatureBanner";
import { MEETING, ENHANCED_NOTES, TRANSCRIPT } from "./sage/sageData";
import styles from "./MeetingNotesPage.module.css";

interface TranscriptEntry {
  speaker: string;
  initials: string;
  time: string;
  text: string;
}

interface MeetingNote {
  id: string;
  title: string;
  date: string;
  time?: string;
  duration: string;
  participants: Array<{ initials: string; name: string; email?: string }>;
  status: "completed" | "upcoming" | "in-progress";
  keyTopics: string[];
  summary: string;
  notes: string;
  transcript?: TranscriptEntry[];
  hasVideo?: boolean;
  brief?: { agenda: string[]; context: string };
}

const meetingNotes: MeetingNote[] = [
  {
    id: "mn1",
    title: "Q1 Planning Review",
    date: "Feb 20, 2026",
    time: "10:00 AM",
    duration: "45 min",
    participants: [
      { initials: "SH", name: "Shaurya", email: "shaurya@sentra.ai" },
      { initials: "AJ", name: "Alice Johnson", email: "alice@sentra.ai" },
      { initials: "BC", name: "Bob Chen", email: "bob@sentra.ai" },
    ],
    status: "completed",
    keyTopics: ["Revenue targets", "Team expansion", "Design system timeline"],
    brief: {
      agenda: ["Review Q1 revenue targets", "Discuss team expansion plan", "Align on design system migration timeline"],
      context: "Previous sprint showed 20% velocity improvement. Token system finalized.",
    },
    summary: "Aligned on Q1 goals. Design system migration target: 70 components by end of Feb.",
    notes: `## Q1 Planning Review — Feb 20

### Attendees
Shaurya, Alice Johnson, Bob Chen

### Key Decisions
1. **Migration target**: 70 components migrated by end of February
2. **Hiring**: Open 2 engineering roles for Q2
3. **Revenue**: $150K MRR target by March

### Action Items
- [ ] Shaurya: Complete component migration pipeline
- [ ] Alice: Draft Q2 hiring plan
- [ ] Bob: Update revenue projections dashboard

### Notes
- Team agreed CSS Modules is the right styling approach
- Design system tokens are the single source of truth for all visual decisions
- Dark mode support required from day one`,
    transcript: [
      { speaker: "Shaurya", initials: "SH", time: "0:00", text: "Alright, let's kick off the Q1 planning review. We've got three main topics today — revenue targets, team expansion, and the design system timeline." },
      { speaker: "Alice Johnson", initials: "AJ", time: "0:32", text: "Sounds good. On hiring, I've drafted a plan for two engineering roles in Q2. We need frontend specialists who understand design systems." },
      { speaker: "Bob Chen", initials: "BC", time: "1:15", text: "From a revenue perspective, I think $150K MRR by March is achievable if we close the Acme Corp deal. My projections show we're at $120K run rate currently." },
      { speaker: "Shaurya", initials: "SH", time: "2:04", text: "Good. On the design system — we're targeting 70 components migrated by end of February. That's aggressive but I think we can hit it with the new pipeline." },
      { speaker: "Alice Johnson", initials: "AJ", time: "2:45", text: "What's the current count? And are we tracking migration quality or just quantity?" },
      { speaker: "Shaurya", initials: "SH", time: "3:10", text: "We're at 25 right now. Each goes through a multi-pass review — token compliance, accessibility check, dark mode verification, and visual regression." },
      { speaker: "Bob Chen", initials: "BC", time: "4:02", text: "I want to flag that the SoftBank PoC depends on the Japanese language support. That's a separate track but it's on the same timeline." },
      { speaker: "Shaurya", initials: "SH", time: "4:30", text: "Noted. Let's make sure Carol is looped in on that dependency. I'll add it to the risk radar." },
    ],
    hasVideo: true,
  },
  {
    id: "mn2",
    title: "Product Sync",
    date: "Feb 21, 2026",
    time: "2:00 PM",
    duration: "30 min",
    participants: [
      { initials: "SH", name: "Shaurya", email: "shaurya@sentra.ai" },
      { initials: "CD", name: "Carol Davis", email: "carol@sentra.ai" },
    ],
    status: "upcoming",
    keyTopics: ["Feature prioritization", "Sprint planning"],
    brief: {
      agenda: ["Sprint review", "Feature prioritization", "Design system integration status"],
      context: "Carol raised concerns about the timeline last week. Need to revisit.",
    },
    summary: "Weekly product sync to align on sprint priorities and feature roadmap.",
    notes: `## Product Sync — Feb 21

### Agenda
1. Sprint review
2. Feature prioritization
3. Design system integration status`,
  },
  {
    id: "mn3",
    title: "Design System Review",
    date: "Feb 21, 2026",
    time: "3:00 PM",
    duration: "60 min",
    participants: [
      { initials: "SH", name: "Shaurya", email: "shaurya@sentra.ai" },
      { initials: "DW", name: "Dave Wilson", email: "dave@sentra.ai" },
      { initials: "EV", name: "Eve", email: "eve@sentra.ai" },
    ],
    status: "upcoming",
    keyTopics: ["Component approval", "Token extensions", "Figma sync"],
    summary: "Review all organism-level components and approve for production use.",
    notes: `## Design System Review — Feb 21

### Agenda
1. Review organism components (Table, Calendar, CodeBlock, Chat)
2. Discuss token extensions needed
3. Plan Figma Code Connect setup`,
  },
  {
    id: "mn4",
    title: "Sprint Retro",
    date: "Feb 19, 2026",
    time: "4:00 PM",
    duration: "30 min",
    participants: [
      { initials: "SH", name: "Shaurya", email: "shaurya@sentra.ai" },
      { initials: "AJ", name: "Alice Johnson", email: "alice@sentra.ai" },
      { initials: "BC", name: "Bob Chen", email: "bob@sentra.ai" },
      { initials: "CD", name: "Carol Davis", email: "carol@sentra.ai" },
    ],
    status: "completed",
    keyTopics: ["Sprint velocity", "Blockers", "Process improvements"],
    summary: "Retrospective on sprint 4. Velocity improved 20%. Main blocker was token gap analysis.",
    notes: `## Sprint Retro — Feb 19

### What went well
- Component migration velocity increased 20%
- Review tool deployed and functional
- Dark mode support added across all tokens

### What could improve
- Token gap analysis took longer than expected
- Need better documentation for complex components
- Side-by-side previews need more space

### Action Items
- Automate token gap analysis for future sprints
- Add documentation generation to the component pipeline`,
    transcript: [
      { speaker: "Shaurya", initials: "SH", time: "0:00", text: "Let's start with what went well this sprint. I'll go first — component migration velocity is up 20% compared to last sprint." },
      { speaker: "Carol Davis", initials: "CD", time: "0:25", text: "The review tool deployment was smooth. We've already approved 15 components through it." },
      { speaker: "Alice Johnson", initials: "AJ", time: "0:48", text: "Dark mode token support across the board is a big win. That was blocking a lot of downstream work." },
      { speaker: "Bob Chen", initials: "BC", time: "1:12", text: "On what could improve — the token gap analysis took three days longer than we estimated. We need better tooling there." },
      { speaker: "Shaurya", initials: "SH", time: "1:40", text: "Agreed. I'll look into automating that for next sprint. Also, the side-by-side preview layout needs more horizontal space — it's cramped on smaller screens." },
      { speaker: "Carol Davis", initials: "CD", time: "2:15", text: "Documentation for complex components is falling behind. Can we add doc generation to the pipeline?" },
      { speaker: "Shaurya", initials: "SH", time: "2:35", text: "Good idea. Let's add both — automated token gap analysis and doc generation — as action items for next sprint." },
    ],
    hasVideo: true,
  },
  {
    id: "mn5",
    title: "Customer Feedback Session",
    date: "Feb 22, 2026",
    time: "11:00 AM",
    duration: "45 min",
    participants: [
      { initials: "SH", name: "Shaurya", email: "shaurya@sentra.ai" },
      { initials: "FK", name: "Frank", email: "frank@sentra.ai" },
    ],
    status: "upcoming",
    keyTopics: ["User feedback", "Feature requests", "Bug reports"],
    summary: "Monthly session to review customer feedback and prioritize fixes.",
    notes: `## Customer Feedback Session — Feb 22

### Agenda
1. Review top 10 support tickets
2. Discuss most-requested features
3. Plan bug fix sprint`,
  },
];

const statusVariant: Record<string, "success" | "warning" | "secondary" | "info"> = {
  completed: "success",
  "in-progress": "info",
  upcoming: "secondary",
};

/* ── Coming Up: upcoming calendar events ── */

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  isProposed?: boolean;
  brief?: {
    agenda: string[];
    attendees: string[];
    context: string;
  };
}

const upcomingEvents: UpcomingEvent[] = [
  {
    id: "ue1",
    title: "No more events today",
    date: "2026-03-09",
    startTime: "",
    endTime: "",
  },
  {
    id: "ue2",
    title: "Ashwin <> Shaurya",
    date: "2026-03-10",
    startTime: "2:00 PM",
    endTime: "2:30 PM",
    brief: {
      agenda: ["Review Sentra prototype feedback", "Discuss interface polish items", "Align on next user testing session"],
      attendees: ["Ashwin", "Shaurya"],
      context: "Follow-up from last week's user feedback session. Ashwin flagged font and color preferences.",
    },
  },
  {
    id: "ue3",
    title: "Sentra x tonik: alignment on a new brand direction and visual identity refresh",
    date: "2026-03-12",
    startTime: "9:00 AM",
    endTime: "9:45 AM",
    isProposed: true,
    brief: {
      agenda: ["Brand direction presentation", "Visual identity review", "Timeline alignment"],
      attendees: ["Shaurya", "Jae", "Tonik Design Team"],
      context: "First meeting with Tonik on the rebrand. They'll present initial mood boards.",
    },
  },
  {
    id: "ue4",
    title: "Jae <> Shaurya",
    date: "2026-03-12",
    startTime: "10:30 AM",
    endTime: "11:00 AM",
    brief: {
      agenda: ["Sprint sync", "Design system migration progress", "Open blockers"],
      attendees: ["Jae", "Shaurya"],
      context: "Weekly 1:1. Last week discussed token gap report and component pipeline.",
    },
  },
  {
    id: "ue5",
    title: "Weekly Product Meeting",
    date: "2026-03-12",
    startTime: "3:30 PM",
    endTime: "4:30 PM",
    brief: {
      agenda: ["Sprint review", "Feature prioritization", "Risk radar updates", "Q2 planning kickoff"],
      attendees: ["Shaurya", "Alice Johnson", "Bob Chen", "Carol Davis"],
      context: "Standard weekly sync. Last week aligned on Q1 revenue targets and design system timeline.",
    },
  },
  {
    id: "ue6",
    title: "All Hands",
    date: "2026-03-13",
    startTime: "12:00 PM",
    endTime: "12:30 PM",
    brief: {
      agenda: ["Company updates", "Q1 progress review", "Team announcements"],
      attendees: ["All team"],
      context: "Monthly all-hands. CEO will present Q1 metrics.",
    },
  },
];

function ComingUpSection({ onStartRecording }: { onStartRecording?: () => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const dayGroups = useMemo(() => {
    const groups: { date: string; dayNum: number; month: string; weekday: string; isToday: boolean; events: UpcomingEvent[] }[] = [];
    const map = new Map<string, UpcomingEvent[]>();
    for (const ev of upcomingEvents) {
      const existing = map.get(ev.date);
      if (existing) existing.push(ev);
      else {
        const arr = [ev];
        map.set(ev.date, arr);
        const d = new Date(ev.date + "T12:00:00");
        groups.push({
          date: ev.date,
          dayNum: d.getDate(),
          month: d.toLocaleDateString("en-US", { month: "short" }),
          weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
          isToday: ev.date === today,
          events: arr,
        });
      }
    }
    return groups;
  }, [today]);

  return (
    <section className={styles.comingUp}>
      <h2 className={styles.comingUpTitle}>Coming up</h2>
      <div className={styles.comingUpCard}>
        {dayGroups.map((group, gi) => (
          <div key={group.date} className={`${styles.comingUpDayRow} ${gi > 0 ? styles.comingUpDayRowBorder : ""}`}>
            <div className={styles.comingUpDateCol}>
              <span className={styles.comingUpDayNum}>{group.dayNum}</span>
              <div className={styles.comingUpDateMeta}>
                <span className={styles.comingUpMonth}>
                  {group.month}
                  {group.isToday && <span className={styles.comingUpTodayDot} />}
                </span>
                <span className={styles.comingUpWeekday}>{group.weekday}</span>
              </div>
            </div>
            <div className={styles.comingUpEvents}>
              {group.events.map((ev) => {
                const isEmpty = !ev.startTime;
                const isExpanded = expandedId === ev.id;
                return (
                  <div key={ev.id} className={styles.comingUpEventWrap}>
                    <button
                      type="button"
                      className={`${styles.comingUpEvent} ${isEmpty ? styles.comingUpEventEmpty : ""} ${isExpanded ? styles.comingUpEventActive : ""}`}
                      onClick={() => !isEmpty && setExpandedId(isExpanded ? null : ev.id)}
                      disabled={isEmpty}
                    >
                      {!isEmpty && <span className={styles.comingUpAccent} />}
                      <div className={styles.comingUpEventBody}>
                        <span className={styles.comingUpEventTitle}>
                          {ev.isProposed && <span className={styles.comingUpProposed}>[proposed time]</span>}{" "}
                          {ev.title}
                        </span>
                        {!isEmpty && (
                          <span className={styles.comingUpEventTime}>
                            {ev.startTime} – {ev.endTime}
                          </span>
                        )}
                      </div>
                    </button>
                    {isExpanded && ev.brief && (
                      <div className={styles.comingUpBrief}>
                        <div className={styles.comingUpBriefSection}>
                          <span className={styles.comingUpBriefLabel}>Agenda</span>
                          <ul className={styles.comingUpBriefList}>
                            {ev.brief.agenda.map((a, i) => <li key={i}>{a}</li>)}
                          </ul>
                        </div>
                        <div className={styles.comingUpBriefSection}>
                          <span className={styles.comingUpBriefLabel}>Attendees</span>
                          <p className={styles.comingUpBriefText}>{ev.brief.attendees.join(", ")}</p>
                        </div>
                        <div className={styles.comingUpBriefSection}>
                          <span className={styles.comingUpBriefLabel}>Context</span>
                          <p className={styles.comingUpBriefText}>{ev.brief.context}</p>
                        </div>
                        {onStartRecording && (
                          <div className={styles.comingUpBriefActions}>
                            <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); onStartRecording(); }}>
                              <BoltIcon width={14} height={14} />
                              Start Recording
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MeetingDetailView({ meeting, onBack, onOpenChat }: { meeting: MeetingNote; onBack: () => void; onOpenChat?: () => void }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (label: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const transcriptText = meeting.transcript?.map((e) => `${e.speaker}: ${e.text}`).join("\n\n") ?? "";

  return (
    <div className={styles.page}>
      <TopBar
        breadcrumbs={[
          { label: "Meeting Notes", onClick: onBack },
          { label: meeting.title.length > 50 ? meeting.title.slice(0, 47) + "..." : meeting.title },
        ]}
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => handleCopy("link", `https://app.sentra.ai/meetings/${meeting.id}`)}>
              <LinkIcon width={14} height={14} />
              {copied === "link" ? "Copied!" : "Copy link"}
            </Button>
            <div style={{ position: "relative" }}>
              <Button variant="ghost" size="sm" onClick={() => setShareOpen(!shareOpen)}>
                <PeopleIcon width={14} height={14} />
                Share
              </Button>
              {shareOpen && (
                <>
                  <div className={styles.dropdownBackdrop} onClick={() => setShareOpen(false)} />
                  <div className={styles.shareDropdown}>
                    <div className={styles.shareTitle}>Share meeting</div>
                    <Input placeholder="Add people by email..." size="sm" />
                    <Separator />
                    <div className={styles.shareList}>
                      {meeting.participants.map((p) => (
                        <div key={p.initials} className={styles.shareRow}>
                          <Avatar content="letters" initials={p.initials} size="24" />
                          <div className={styles.shareInfo}>
                            <span className={styles.shareName}>{p.name}</span>
                            {p.email && <span className={styles.shareEmail}>{p.email}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            {onOpenChat && (
              <Button variant="secondary" size="sm" onClick={onOpenChat}>
                <AiSparkle width={14} height={14} />
                Ask Sentra
              </Button>
            )}
            <div style={{ position: "relative" }}>
              <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(!settingsOpen)}>
                <SettingsIcon width={14} height={14} />
              </Button>
              {settingsOpen && (
                <>
                  <div className={styles.dropdownBackdrop} onClick={() => setSettingsOpen(false)} />
                  <div className={styles.settingsDropdown}>
                    <div className={styles.settingsTitle}>Meeting Settings</div>
                    <Separator />
                    <label className={styles.settingsRow}>
                      <span>Auto-transcribe</span>
                      <input type="checkbox" defaultChecked />
                    </label>
                    <label className={styles.settingsRow}>
                      <span>Generate AI summary</span>
                      <input type="checkbox" defaultChecked />
                    </label>
                    <label className={styles.settingsRow}>
                      <span>Email notes to attendees</span>
                      <input type="checkbox" />
                    </label>
                  </div>
                </>
              )}
            </div>
          </>
        }
      />

      <div className={styles.detailContent}>
        <div className={styles.detailInner}>

          <div className={styles.detailHeader}>
            <h1 className={styles.detailTitle}>{meeting.title}</h1>
            <div className={styles.detailMeta}>
              <Badge variant={statusVariant[meeting.status]} size="sm">{meeting.status}</Badge>
              <span className={styles.detailMetaText}>{meeting.date}</span>
              {meeting.time && (
                <>
                  <span className={styles.detailMetaSep}>&middot;</span>
                  <span className={styles.detailMetaText}>{meeting.time}</span>
                </>
              )}
              <span className={styles.detailMetaSep}>&middot;</span>
              <span className={styles.detailMetaText}>{meeting.duration}</span>
            </div>
          </div>

          {/* ── Attendees with emails ── */}
          <div className={styles.attendeesSection}>
            <span className={styles.attendeesLabel}>Attendees</span>
            <div className={styles.attendeesList}>
              {meeting.participants.map((p) => (
                <div key={p.initials} className={styles.attendeeChip}>
                  <Avatar content="letters" initials={p.initials} size="20" />
                  <span className={styles.attendeeName}>{p.name}</span>
                  {p.email && <span className={styles.attendeeEmail}>{p.email}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* ── Pre-meeting brief (for upcoming meetings) ── */}
          {meeting.brief && (
            <div className={styles.briefSection}>
              <span className={styles.briefLabel}>Pre-meeting Brief</span>
              <div className={styles.briefContent}>
                <div className={styles.briefBlock}>
                  <span className={styles.briefSubLabel}>Agenda</span>
                  <ul className={styles.briefList}>
                    {meeting.brief.agenda.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
                <div className={styles.briefBlock}>
                  <span className={styles.briefSubLabel}>Context</span>
                  <p className={styles.briefText}>{meeting.brief.context}</p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          <Tabs defaultValue="summary">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <div className={styles.detailMarkdown}>
                <Markdown content={meeting.notes} />
              </div>
            </TabsContent>

            <TabsContent value="transcript">
              {meeting.transcript && meeting.transcript.length > 0 ? (
                <>
                  <div className={styles.transcriptActions}>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy("transcript", transcriptText)}>
                      <Clipboard width={14} height={14} />
                      {copied === "transcript" ? "Copied!" : "Copy transcript"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => {
                      const blob = new Blob([transcriptText], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${meeting.title.replace(/\s+/g, "-")}-transcript.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}>
                      <ChevronDown width={14} height={14} />
                      Download transcript
                    </Button>
                  </div>
                  <div className={styles.transcriptList}>
                    {meeting.transcript.map((entry, i) => (
                      <div key={i} className={styles.transcriptEntry}>
                        <div className={styles.transcriptMeta}>
                          <Avatar content="letters" initials={entry.initials} size="24" />
                          <span className={styles.transcriptSpeaker}>{entry.speaker}</span>
                        </div>
                        <p className={styles.transcriptText}>{entry.text}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className={styles.transcriptEmpty}>
                  <p className={styles.transcriptEmptyText}>Transcript will be available after the meeting is recorded.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="video">
              {meeting.hasVideo ? (
                <>
                  <div className={styles.videoActions}>
                    <Button variant="ghost" size="sm" onClick={() => {/* mock download */}}>
                      <ChevronDown width={14} height={14} />
                      Download video
                    </Button>
                  </div>
                  <div className={styles.videoContainer}>
                    <div className={styles.videoPlaceholder}>
                      <div className={styles.videoPlayIcon}>&#9654;</div>
                      <span className={styles.videoLabel}>Meeting Recording</span>
                      <span className={styles.videoDuration}>{meeting.duration}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.transcriptEmpty}>
                  <p className={styles.transcriptEmptyText}>Video recording will be available after the meeting.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </div>
  );
}

function buildSageMeeting(): MeetingNote {
  const notesMarkdown = ENHANCED_NOTES.map((section) => {
    const items = section.items.map((item) => {
      const children = item.children?.map((c) => `  - ${c}`).join("\n") ?? "";
      return `- ${item.text}${children ? "\n" + children : ""}`;
    }).join("\n");
    return `## ${section.heading}\n\n${items}`;
  }).join("\n\n");

  return {
    id: "sage-meeting",
    title: MEETING.title,
    date: "Just now",
    duration: MEETING.duration,
    participants: MEETING.participants.map((p) => ({ initials: p.initials, name: p.name })),
    status: "completed",
    keyTopics: ENHANCED_NOTES.slice(0, 3).map((s) => s.heading),
    summary: "AI-enhanced notes from your latest meeting, generated by Sentra.",
    notes: notesMarkdown,
    transcript: TRANSCRIPT.map((t) => ({
      speaker: t.speaker,
      initials: (t.speaker[0] ?? "?").toUpperCase(),
      time: t.time,
      text: t.text,
    })),
    hasVideo: true,
  };
}

export function MeetingNotesPage({ sageMeetingCompleted, onOpenChat, onNavigateToSage }: { sageMeetingCompleted?: boolean; onOpenChat?: () => void; onNavigateToSage?: () => void } = {}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const lastSelectedRef = useRef<string | null>(null);
  const rowRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const allNotes = useMemo(() => {
    if (!sageMeetingCompleted) return meetingNotes;
    return [buildSageMeeting(), ...meetingNotes];
  }, [sageMeetingCompleted]);

  const filtered = useMemo(() => {
    let list = allNotes;
    if (statusFilter !== "all") list = list.filter((m) => m.status === statusFilter);
    if (search) list = list.filter((m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.summary.toLowerCase().includes(search.toLowerCase()) ||
      m.keyTopics.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    );
    return list;
  }, [search, statusFilter, allNotes]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return db - da;
    });
  }, [filtered]);

  const dayGroups = useMemo(() => {
    const groups: { label: string; items: MeetingNote[] }[] = [];
    const map = new Map<string, MeetingNote[]>();
    for (const m of sorted) {
      const d = new Date(m.date);
      const label = d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const existing = map.get(label);
      if (existing) existing.push(m);
      else {
        const arr = [m];
        map.set(label, arr);
        groups.push({ label, items: arr });
      }
    }
    return groups;
  }, [sorted]);

  const selectedMeeting = selectedId ? allNotes.find((m) => m.id === selectedId) ?? null : null;

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

  useEffect(() => {
    if (!selectedMeeting) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedMeeting, handleClose]);

  if (selectedMeeting) {
    return (
      <MeetingDetailView
        meeting={selectedMeeting}
        onBack={handleClose}
        onOpenChat={onOpenChat}
      />
    );
  }

  return (
    <div className={styles.page}>
      <TopBar
        breadcrumbs={[{ label: "Meeting Notes" }]}
        actions={
          <>
            <div className={styles.topBarSearch}>
              <Input placeholder="Search meetings..." value={search} onChange={(e) => setSearch(e.target.value)} size="sm" />
            </div>
            <div style={{ width: 140 }}>
              <Select value={statusFilter} onValueChange={setStatusFilter} size="sm">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="in-progress">In progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {onOpenChat && (
              <Button variant="secondary" size="sm" onClick={onOpenChat}>
                <AiSparkle width={14} height={14} />
                Open Chat
              </Button>
            )}
          </>
        }
      />

      <div className={styles.content}>
        <div className={styles.listInner}>
          <div className={styles.pageHeader}>
            <div className={styles.pageHeaderRow}>
              <h1 className={styles.pageTitle}>Meeting Notes</h1>
              <Button variant="primary" size="sm"><BoltIcon width={14} height={14} /> Quick Meeting</Button>
            </div>
            <p className={styles.pageDesc}>Transcripts, summaries, and action items from your meetings.</p>
          </div>
          <FeatureBanner storageKey="meeting-notes">
            AI-transcribed meeting notes with summaries, action items, and full transcripts.
          </FeatureBanner>
          <ComingUpSection onStartRecording={onNavigateToSage} />
          {dayGroups.map((group) => (
            <div key={group.label} className={styles.dayGroup}>
              <div className={styles.dayHeader}>
                <span className={styles.dayLabel}>{group.label}</span>
                <span className={styles.dayCount}>{group.items.length}</span>
              </div>
              {group.items.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  ref={(el) => { rowRefs.current[m.id] = el; }}
                  className={styles.row}
                  onClick={() => handleSelect(m.id)}
                >
                  <div className={styles.rowMain}>
                    <span className={styles.rowTitle}>{m.title}</span>
                    <p className={styles.rowSummary}>{m.summary}</p>
                    <span className={styles.rowTopics}>{m.keyTopics.join(" · ")}</span>
                  </div>
                  <div className={styles.rowSide}>
                    <span className={styles.rowMeta}>
                      {m.duration} · {m.participants.length} {m.participants.length === 1 ? "person" : "people"}
                    </span>
                    <Badge variant={statusVariant[m.status]} size="sm">{m.status}</Badge>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
