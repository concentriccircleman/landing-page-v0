import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Badge } from "../../components/Badge";
import { Input } from "../../components/Input";
import { Avatar } from "../../components/Avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/Tabs";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "../../components/Select";
import { Separator } from "../../components/Separator";
import { Markdown } from "../../components/Markdown";
import { TopBar } from "../../components/TopBar";
import { Bolt as BoltIcon, AiSparkle } from "../../icons/outline";
import { Button } from "../../components/Button";
import { FeatureBanner } from "../FeatureBanner";
import { MEETING, ENHANCED_NOTES, TRANSCRIPT } from "../sage/sageData";
import styles from "../MeetingNotesPage.module.css";

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
  duration: string;
  participants: Array<{ initials: string; name: string }>;
  status: "completed" | "upcoming" | "in-progress";
  keyTopics: string[];
  summary: string;
  notes: string;
  transcript?: TranscriptEntry[];
  hasVideo?: boolean;
}

const meetingNotes: MeetingNote[] = [
  {
    id: "mn1",
    title: "Q1 Planning Review",
    date: "Feb 20, 2026",
    duration: "45 min",
    participants: [
      { initials: "SH", name: "Shaurya" },
      { initials: "AJ", name: "Alice Johnson" },
      { initials: "BC", name: "Bob Chen" },
    ],
    status: "completed",
    keyTopics: ["Revenue targets", "Team expansion", "Design system timeline"],
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
    duration: "30 min",
    participants: [
      { initials: "SH", name: "Shaurya" },
      { initials: "CD", name: "Carol Davis" },
    ],
    status: "upcoming",
    keyTopics: ["Feature prioritization", "Sprint planning"],
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
    duration: "60 min",
    participants: [
      { initials: "SH", name: "Shaurya" },
      { initials: "DW", name: "Dave Wilson" },
      { initials: "EV", name: "Eve" },
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
    duration: "30 min",
    participants: [
      { initials: "SH", name: "Shaurya" },
      { initials: "AJ", name: "Alice Johnson" },
      { initials: "BC", name: "Bob Chen" },
      { initials: "CD", name: "Carol Davis" },
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
    duration: "45 min",
    participants: [
      { initials: "SH", name: "Shaurya" },
      { initials: "FK", name: "Frank" },
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

function MeetingDetailView({ meeting, onBack }: { meeting: MeetingNote; onBack: () => void }) {
  const participantNames = meeting.participants.map((p) => p.name).join(", ");

  return (
    <div className={styles.page}>
      <TopBar
        breadcrumbs={[
          { label: "Meeting Notes", onClick: onBack },
          { label: meeting.title.length > 50 ? meeting.title.slice(0, 47) + "..." : meeting.title },
        ]}
      />

      <div className={styles.detailContent}>
        <div className={styles.detailInner}>

          <div className={styles.detailHeader}>
            <h1 className={styles.detailTitle}>{meeting.title}</h1>
            <div className={styles.detailMeta}>
              <Badge variant={statusVariant[meeting.status]} size="sm">{meeting.status}</Badge>
              <span className={styles.detailMetaText}>{meeting.date}</span>
              <span className={styles.detailMetaSep}>&middot;</span>
              <span className={styles.detailMetaText}>{meeting.duration}</span>
              <span className={styles.detailMetaSep}>&middot;</span>
              <span className={styles.detailMetaText}>{participantNames}</span>
            </div>
          </div>

          <div className={styles.detailStats}>
            <div className={styles.detailStatItem}>
              <span className={styles.detailStatValue}>{meeting.participants.length}</span>
              <span className={styles.detailStatLabel}>participants</span>
            </div>
            <span className={styles.detailStatSep} />
            <div className={styles.detailStatItem}>
              <span className={styles.detailStatValue}>{meeting.keyTopics.length}</span>
              <span className={styles.detailStatLabel}>topics</span>
            </div>
            <span className={styles.detailStatSep} />
            <div className={styles.detailStatItem}>
              <span className={styles.detailStatValue}>{meeting.duration}</span>
              <span className={styles.detailStatLabel}>duration</span>
            </div>
            <span className={styles.detailStatSep} />
            <div className={styles.detailStatItem}>
              <span className={styles.detailStatValue}>{meeting.transcript?.length ?? 0}</span>
              <span className={styles.detailStatLabel}>transcript entries</span>
            </div>
          </div>

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
                <div className={styles.transcriptList}>
                  {meeting.transcript.map((entry, i) => (
                    <div key={i} className={styles.transcriptEntry}>
                      <div className={styles.transcriptMeta}>
                        <Avatar content="letters" initials={entry.initials} size="24" />
                        <span className={styles.transcriptSpeaker}>{entry.speaker}</span>
                        <span className={styles.transcriptTime}>{entry.time}</span>
                      </div>
                      <p className={styles.transcriptText}>{entry.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.transcriptEmpty}>
                  <p className={styles.transcriptEmptyText}>Transcript will be available after the meeting is recorded.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="video">
              {meeting.hasVideo ? (
                <div className={styles.videoContainer}>
                  <div className={styles.videoPlaceholder}>
                    <div className={styles.videoPlayIcon}>&#9654;</div>
                    <span className={styles.videoLabel}>Meeting Recording</span>
                    <span className={styles.videoDuration}>{meeting.duration}</span>
                  </div>
                </div>
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
      initials: t.speaker[0].toUpperCase(),
      time: t.time,
      text: t.text,
    })),
    hasVideo: true,
  };
}

export function MeetingNotesPage({ sageMeetingCompleted, onOpenChat }: { sageMeetingCompleted?: boolean; onOpenChat?: () => void } = {}) {
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
