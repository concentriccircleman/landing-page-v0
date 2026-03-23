import { useState } from "react";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Input } from "../components/Input";
import { Avatar } from "../components/Avatar";
import { Checkbox } from "../components/Checkbox";
import {
  Home,
  MagnifyingGlass,
  ChatBubble,
  Folder,
  People,
  DocumentText,
  Calendar,
  Microphone,
  Play,
  Pause,
  XMark,
  ChevronRight,
  Plus,
  AiSparkle,
  Check,
} from "../icons/outline";
import styles from "./MeetingRecorderPage.module.css";

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--fg-muted)",
  marginBottom: "1rem",
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/* ═══════════════════════════════════════════
   Component: Notification Bar
   ═══════════════════════════════════════════ */

function NotificationBarComponent({
  title,
  subtitle,
  emoji,
}: {
  title: string;
  subtitle: string;
  emoji: string;
}) {
  return (
    <div className={styles.notifBar}>
      <div className={styles.notifAccent} />
      <div className={styles.notifInfo}>
        <div className={styles.notifTitle}>{emoji} {title}</div>
        <div className={styles.notifTime}>{subtitle}</div>
      </div>
      <div className={styles.notifActions}>
        <Button variant="primary" size="sm">Join &amp; Record</Button>
        <button type="button" className={styles.notifDismiss}>
          <XMark width={14} height={14} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Component: Recording Pill
   ═══════════════════════════════════════════ */

function RecordingPillCollapsed() {
  return (
    <div className={styles.pillStatic}>
      <span className={styles.pillIcon}>
        <Microphone width={22} height={22} />
      </span>
      <div className={styles.pillDots}>
        <span className={styles.pillDot} />
        <span className={styles.pillDot} />
        <span className={styles.pillDot} />
      </div>
    </div>
  );
}

function RecordingPillExpanded({ time }: { time: string }) {
  return (
    <div className={styles.pillStaticExpanded}>
      <span className={styles.pillIcon}>
        <Microphone width={18} height={18} />
      </span>
      <div className={styles.pillDots}>
        <span className={styles.pillDot} />
        <span className={styles.pillDot} />
        <span className={styles.pillDot} />
      </div>
      <span className={styles.pillTimer}>{time}</span>
      <div className={styles.pillControls}>
        <button type="button" className={styles.pillBtn}>
          <Pause width={14} height={14} />
        </button>
        <button type="button" className={`${styles.pillBtn} ${styles.pillBtnStop}`}>
          <XMark width={14} height={14} />
        </button>
      </div>
    </div>
  );
}

function RecordingPillPaused({ time }: { time: string }) {
  return (
    <div className={styles.pillStaticExpanded}>
      <span className={styles.pillIcon}>
        <Microphone width={18} height={18} />
      </span>
      <div className={styles.pillDotsPaused}>
        <span className={styles.pillDotPaused} />
        <span className={styles.pillDotPaused} />
        <span className={styles.pillDotPaused} />
      </div>
      <span className={styles.pillTimer}>{time}</span>
      <div className={styles.pillControls}>
        <button type="button" className={styles.pillBtn}>
          <Play width={14} height={14} />
        </button>
        <button type="button" className={`${styles.pillBtn} ${styles.pillBtnStopUpload}`}>
          Stop &amp; Upload
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Component: Sidebar
   ═══════════════════════════════════════════ */

function SidebarComponent() {
  const [active, setActive] = useState("home");
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "shared", label: "Shared with me", icon: People },
    { id: "chat", label: "Chat", icon: ChatBubble },
  ];
  const folders = [
    { id: "my-notes", label: "My notes", emoji: "📝" },
    { id: "sentra-team", label: "Sentra team", emoji: "🟣" },
    { id: "customer-calls", label: "Customer calls", emoji: "📞" },
    { id: "team-sentra", label: "team Sentra", emoji: "🔴" },
  ];

  return (
    <div className={styles.sidebarPreview}>
      <div className={styles.sidebarSearch}>
        <Input placeholder="Search..." size="sm" />
      </div>
      <nav className={styles.sidebarNav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.sidebarItem} ${active === item.id ? styles.sidebarItemActive : ""}`}
              onClick={() => setActive(item.id)}
            >
              <span className={styles.sidebarItemIcon}><Icon width={15} height={15} /></span>
              {item.label}
            </button>
          );
        })}
        <div className={styles.sidebarSectionLabel}>Spaces</div>
        {folders.map((folder) => (
          <button
            key={folder.id}
            type="button"
            className={`${styles.sidebarItem} ${active === folder.id ? styles.sidebarItemActive : ""}`}
            onClick={() => setActive(folder.id)}
          >
            <span className={styles.sidebarItemIcon}>{folder.emoji}</span>
            {folder.label}
          </button>
        ))}
      </nav>
      <div className={styles.sidebarFooter}>
        <div className={styles.sidebarFooterCard}>
          <Avatar content="letters" initials="S" size="24" />
          <div className={styles.sidebarFooterText}>
            <div className={styles.sidebarFooterName}>Sentra</div>
            <div className={styles.sidebarFooterSub}>Free plan</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Component: Meeting Row
   ═══════════════════════════════════════════ */

function MeetingRowComponent({
  emoji,
  title,
  subtitle,
  time,
  active,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  time: string;
  active?: boolean;
}) {
  return (
    <div className={`${styles.meetingRow} ${active ? styles.meetingRowActive : ""}`}>
      <div className={styles.meetingDot}>{emoji}</div>
      <div className={styles.meetingRowBody}>
        <div className={styles.meetingRowTitle}>{title}</div>
        <div className={styles.meetingRowSub}>{subtitle}</div>
      </div>
      <div className={styles.meetingRowRight}>
        <span className={styles.meetingRowTime}>{time}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Component: Note Row
   ═══════════════════════════════════════════ */

function NoteRowComponent({
  title,
  author,
  wordCount,
  enhanced,
}: {
  title: string;
  author: string;
  wordCount: number;
  enhanced?: boolean;
}) {
  return (
    <div className={styles.noteRow}>
      <div className={styles.noteIcon}>
        <DocumentText width={15} height={15} />
      </div>
      <div className={styles.noteRowBody}>
        <div className={styles.noteRowTitle}>{title}</div>
        <div className={styles.noteRowAuthor}>{author}</div>
      </div>
      <div className={styles.noteRowRight}>
        {enhanced && <Badge variant="success" size="sm">Enhanced</Badge>}
        {wordCount > 0 && (
          <span className={styles.noteRowMeta}>
            <DocumentText width={11} height={11} /> {wordCount.toLocaleString()} words
          </span>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Component: Note Editor
   ═══════════════════════════════════════════ */

function NoteEditorComponent({ state }: { state: "empty" | "writing" | "with-content" }) {
  const today = "Sat, Feb 22";
  return (
    <div className={styles.editorPreview}>
      <input
        type="text"
        className={styles.editorTitle}
        defaultValue={state === "empty" ? "" : state === "writing" ? "Q1 Planning Review" : "Sprint Retrospective"}
        placeholder="New note"
      />
      <div className={styles.editorTagRow}>
        <span className={styles.editorTag}>
          <span className={styles.editorTagIcon}><Calendar width={12} height={12} /></span>
          {today}
        </span>
        <span className={styles.editorTag}>
          <span className={styles.editorTagIcon}><People width={12} height={12} /></span>
          Me
        </span>
        <span className={styles.editorTag}>
          <span className={styles.editorTagIcon}><Plus width={11} height={11} /></span>
          Add to folder
        </span>
      </div>
      <textarea
        className={styles.editorBody}
        defaultValue={
          state === "empty"
            ? ""
            : state === "writing"
              ? "- Migration target: 70 components by end of February\n- Need to finalize spacing passes\n- Dark mode from day one"
              : "## Key Decisions\n1. CSS Modules confirmed as styling approach\n2. Design tokens are the source of truth\n3. Component review tool is the quality gate\n\n## Action Items\n- Complete migration pipeline — Shaurya\n- Draft Q2 hiring plan — Alice"
        }
        placeholder="Write notes..."
      />
      <div className={styles.editorFooterInline}>
        <span className={styles.editorFooterText}>
          Always get consent when transcribing others <ChevronRight width={10} height={10} />
        </span>
      </div>
      <div className={styles.editorBottomBar}>
        <input className={styles.editorInput} placeholder="Ask anything" readOnly />
        <Button variant="secondary" size="sm">
          <AiSparkle width={13} height={13} /> What did I miss
        </Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Component: Enhance Notes Callout
   ═══════════════════════════════════════════ */

function EnhanceCalloutComponent() {
  return (
    <div className={styles.enhanceCallout}>
      <div className={styles.enhanceIcon}>
        <AiSparkle width={16} height={16} />
      </div>
      <div className={styles.enhanceText}>
        <div className={styles.enhanceTitle}>Your notes are ready to enhance</div>
        <div className={styles.enhanceSub}>AI will merge your notes with the full transcript</div>
      </div>
      <Button variant="primary" size="sm">Enhance Notes</Button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Component: AI Section Card
   ═══════════════════════════════════════════ */

function AiSectionCardComponent({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className={styles.aiSection}>
      <div className={styles.aiSectionHeader} onClick={() => setOpen(!open)}>
        <span className={`${styles.aiSectionChevron} ${open ? styles.aiSectionChevronOpen : ""}`}>
          <ChevronRight width={12} height={12} />
        </span>
        <span className={styles.aiSectionTitle}>{title}</span>
      </div>
      {open && <div className={styles.aiSectionBody}>{children}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Component: Chat Message Bubbles
   ═══════════════════════════════════════════ */

function UserBubble({ text }: { text: string }) {
  return (
    <div className={styles.chatMsgUser}>
      <div className={styles.chatMsgBubble}>{text}</div>
    </div>
  );
}

function AiBubble({ text, citations }: { text: string; citations?: string[] }) {
  return (
    <div className={styles.chatMsgAi}>
      <div className={styles.chatAiAvatar}>
        <AiSparkle width={15} height={15} />
      </div>
      <div className={styles.chatAiBody}>
        <p className={styles.chatAiText}>
          {text}
          {citations?.map((c) => (
            <span key={c} className={styles.chatCitation}>
              <DocumentText width={9} height={9} /> {c}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Component: Chat Suggestions
   ═══════════════════════════════════════════ */

function ChatSuggestionsComponent() {
  return (
    <div className={styles.chatSuggestions}>
      <button type="button" className={styles.chatSuggestion}>What did I miss this week?</button>
      <button type="button" className={styles.chatSuggestion}>List all action items</button>
      <button type="button" className={styles.chatSuggestion}>Summarize yesterday</button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Component: Chat Input Bar
   ═══════════════════════════════════════════ */

function ChatInputComponent({ value }: { value?: string }) {
  return (
    <div className={styles.chatInputWrap}>
      <input
        className={styles.chatInputField}
        placeholder="Ask anything about your meetings..."
        defaultValue={value}
        readOnly
      />
      <button type="button" className={styles.chatSendBtn}>
        <ChevronRight width={14} height={14} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Component: Chat Welcome
   ═══════════════════════════════════════════ */

function ChatWelcomeComponent() {
  return (
    <div className={styles.chatWelcome}>
      <div className={styles.chatWelcomeIcon}>
        <ChatBubble width={22} height={22} />
      </div>
      <h2 className={styles.chatWelcomeTitle}>Chat with your meetings</h2>
      <p className={styles.chatWelcomeSub}>
        Ask questions about past meetings, find decisions, surface action items, or generate summaries across all your notes.
      </p>
      <ChatSuggestionsComponent />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   V2 — Sentra Design Language Edition components
   ═══════════════════════════════════════════════════════ */

export function V2NotifBar({
  title,
  subtitle,
  dotColor,
}: {
  title: string;
  subtitle: string;
  dotColor?: string;
}) {
  return (
    <div className={styles.v2Notif}>
      <span className={styles.v2NotifDot} style={dotColor ? { background: dotColor } : undefined} />
      <div className={styles.v2NotifInfo}>
        <div className={styles.v2NotifTitle}>{title}</div>
        <div className={styles.v2NotifSub}>{subtitle}</div>
      </div>
      <div className={styles.v2NotifActions}>
        <Button variant="primary" size="sm">Join &amp; Record</Button>
        <Button variant="ghost" size="sm"><XMark width={14} height={14} /></Button>
      </div>
    </div>
  );
}

export function V2PillCollapsed() {
  return (
    <div className={styles.v2Pill}>
      <span className={styles.v2PillIcon}><Microphone width={22} height={22} /></span>
      <div className={styles.v2PillDots}>
        <span className={styles.v2PillDot} />
        <span className={styles.v2PillDot} />
        <span className={styles.v2PillDot} />
      </div>
    </div>
  );
}

export function V2PillExpanded({ time }: { time: string }) {
  return (
    <div className={styles.v2PillExpanded}>
      <span className={styles.v2PillIcon}><Microphone width={18} height={18} /></span>
      <div className={styles.v2PillDots}>
        <span className={styles.v2PillDot} />
        <span className={styles.v2PillDot} />
        <span className={styles.v2PillDot} />
      </div>
      <span className={styles.v2PillTimer}>{time}</span>
      <div className={styles.v2PillControls}>
        <button type="button" className={styles.v2PillBtn}><Pause width={14} height={14} /></button>
        <button type="button" className={`${styles.v2PillBtn} ${styles.v2PillBtnStop}`}><XMark width={14} height={14} /></button>
      </div>
    </div>
  );
}

export function V2PillPaused({ time }: { time: string }) {
  return (
    <div className={styles.v2PillExpanded}>
      <span className={styles.v2PillIcon}><Microphone width={18} height={18} /></span>
      <div className={styles.v2PillDots}>
        <span className={styles.v2PillDotPaused} />
        <span className={styles.v2PillDotPaused} />
        <span className={styles.v2PillDotPaused} />
      </div>
      <span className={styles.v2PillTimer}>{time}</span>
      <div className={styles.v2PillControls}>
        <button type="button" className={styles.v2PillBtn}><Play width={14} height={14} /></button>
        <button type="button" className={`${styles.v2PillBtn} ${styles.v2PillBtnStopUpload}`}>Stop &amp; Upload</button>
      </div>
    </div>
  );
}

function V2Sidebar() {
  const [active, setActive] = useState("home");
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "shared", label: "Shared with me", icon: People },
    { id: "chat", label: "Chat", icon: ChatBubble },
  ];
  const folders = [
    { id: "my-notes", label: "My notes", color: "var(--tag-green-bg)", iconColor: "var(--status-green)" },
    { id: "sentra-team", label: "Sentra team", color: "var(--tag-purple-bg)", iconColor: "var(--tag-purple-700)" },
    { id: "customer-calls", label: "Customer calls", color: "var(--tag-blue-bg)", iconColor: "var(--status-blue)" },
    { id: "team-sentra", label: "team Sentra", color: "var(--tag-orange-bg)", iconColor: "var(--status-red)" },
  ];

  return (
    <div className={styles.v2Sidebar}>
      <div className={styles.v2SidebarHeader}>
        <button type="button" className={styles.v2WorkspaceBtn}>
          <span className={styles.v2WorkspaceAvatar}>
            <span className={styles.v2WorkspaceAvatarInner}>S</span>
          </span>
          <span className={styles.v2WorkspaceName}>Sentra</span>
          <svg width={12} height={12} viewBox="0 0 12 12" fill="none" style={{ color: "var(--fg-muted)" }}>
            <path d="M4 5l2-2 2 2M4 7l2 2 2-2" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <nav className={styles.v2SidebarNav}>
        <div className={styles.v2SidebarNavContent}>
          <div className={styles.v2SidebarMenuGroup}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.v2SidebarItem} ${active === item.id ? styles.v2SidebarItemActive : ""}`}
                  onClick={() => setActive(item.id)}
                >
                  <span className={styles.v2SidebarItemIcon}><Icon width={16} height={16} /></span>
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className={styles.v2SidebarMenuGroup}>
            <div className={styles.v2SidebarSectionLabel}>
              <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                <path d="M5 3l3 3-3 3" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Spaces
            </div>
            {folders.map((folder) => (
              <button
                key={folder.id}
                type="button"
                className={`${styles.v2SidebarItem} ${active === folder.id ? styles.v2SidebarItemActive : ""}`}
                onClick={() => setActive(folder.id)}
              >
                <span className={styles.v2ResourceAvatar}>
                  <span className={styles.v2ResourceAvatarInner} style={{ background: folder.color }}>
                    <svg width={5} height={5} viewBox="0 0 5 5" fill="none">
                      <rect width={5} height={5} rx={1} fill={folder.iconColor} />
                    </svg>
                  </span>
                </span>
                {folder.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <div className={styles.v2SidebarFooter}>
        <button type="button" className={styles.v2SidebarFooterItem}>
          <span className={styles.v2SidebarItemIcon}><MagnifyingGlass width={16} height={16} /></span>
          Search
          <span className={styles.v2SidebarBadge}>⌘K</span>
        </button>
        <button type="button" className={styles.v2SidebarFooterItem}>
          <span className={styles.v2SidebarItemIcon}>
            <svg width={16} height={16} viewBox="0 0 16 16" fill="none"><path d="M8 3v10M5 6l3-3 3 3" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          Settings
        </button>
      </div>
    </div>
  );
}

function V2MeetingRow({
  emoji,
  title,
  subtitle,
  time,
  typeBadge,
  typeDotColor,
  participants,
  active,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  time: string;
  typeBadge?: string;
  typeDotColor?: string;
  participants?: string[];
  active?: boolean;
}) {
  return (
    <div className={`${styles.v2MeetingRow} ${active ? styles.v2MeetingRowActive : ""}`}>
      <div className={styles.v2MeetingIcon}>{emoji}</div>
      <div className={styles.v2MeetingBody}>
        <div className={styles.v2MeetingTitle}>{title}</div>
        <div className={styles.v2MeetingSub}>{subtitle}</div>
      </div>
      <div className={styles.v2MeetingRight}>
        {participants && participants.length > 0 && (
          <div className={styles.v2AvatarStack}>
            {participants.slice(0, 3).map((p) => (
              <span key={p} className={styles.v2AvatarItem}>
                <Avatar content="letters" initials={p} size="24" />
              </span>
            ))}
            {participants.length > 3 && (
              <span className={styles.v2AvatarOverflow}>+{participants.length - 3}</span>
            )}
          </div>
        )}
        {typeBadge && (
          <span className={styles.v2TypeBadge}>
            <span className={styles.v2TypeDot} style={{ background: typeDotColor ?? "var(--status-blue)" }} />
            {typeBadge}
          </span>
        )}
        <span className={styles.v2MeetingTime}>{time}</span>
      </div>
    </div>
  );
}

function V2NoteRow({
  title,
  author,
  wordCount,
  enhanced,
  typeBadge,
  typeDotColor,
}: {
  title: string;
  author: string;
  wordCount: number;
  enhanced?: boolean;
  typeBadge?: string;
  typeDotColor?: string;
}) {
  return (
    <div className={styles.v2NoteRow}>
      <div className={styles.v2NoteIcon}>
        <DocumentText width={15} height={15} />
      </div>
      <div className={styles.v2NoteBody}>
        <div className={styles.v2NoteTitle}>{title}</div>
        <div className={styles.v2NoteAuthor}>{author}</div>
      </div>
      <div className={styles.v2NoteSide}>
        {typeBadge && (
          <span className={styles.v2TypeBadge}>
            <span className={styles.v2TypeDot} style={{ background: typeDotColor ?? "var(--status-green)" }} />
            {typeBadge}
          </span>
        )}
        {enhanced && <Badge variant="success" size="sm">Enhanced</Badge>}
        {wordCount > 0 && (
          <span className={styles.v2NoteMeta}>
            <DocumentText width={11} height={11} /> {wordCount.toLocaleString()} words
          </span>
        )}
      </div>
    </div>
  );
}

export function V2NoteEditor({ state }: { state: "empty" | "writing" | "with-content" }) {
  const today = "Sat, Feb 22";
  return (
    <div className={styles.v2Editor}>
      <div className={styles.v2EditorBody}>
        <input
          type="text"
          className={styles.v2EditorTitle}
          defaultValue={state === "empty" ? "" : state === "writing" ? "Q1 Planning Review" : "Sprint Retrospective"}
          placeholder="New note"
        />
        <div className={styles.v2EditorTags}>
          <Badge variant="secondary" size="sm"><Calendar width={11} height={11} /> {today}</Badge>
          <Badge variant="secondary" size="sm"><People width={11} height={11} /> Me</Badge>
          <Badge variant="secondary" size="sm"><Plus width={10} height={10} /> Add to folder</Badge>
        </div>
        <textarea
          className={styles.v2EditorTextarea}
          defaultValue={
            state === "empty"
              ? ""
              : state === "writing"
                ? "- Migration target: 70 components by end of February\n- Need to finalize spacing passes\n- Dark mode from day one"
                : "## Key Decisions\n1. CSS Modules confirmed as styling approach\n2. Design tokens are the source of truth\n3. Component review tool is the quality gate\n\n## Action Items\n- Complete migration pipeline — Shaurya\n- Draft Q2 hiring plan — Alice"
          }
          placeholder="Write notes..."
        />
      </div>
      <div className={styles.v2EditorChin}>
        <span className={styles.v2EditorChinText}>
          Always get consent when transcribing others <span style={{ color: "var(--fg-info)" }}><ChevronRight width={10} height={10} /></span>
        </span>
      </div>
      <div className={styles.v2EditorBottom}>
        <Input placeholder="Ask anything" size="sm" style={{ flex: 1 }} />
        <button type="button" className={styles.v2EditorAiBtn}>
          <span style={{ color: "var(--fg-info)" }}><AiSparkle width={13} height={13} /></span> What did I miss
        </button>
      </div>
    </div>
  );
}

function V2EnhanceCallout() {
  return (
    <div className={styles.v2Enhance}>
      <div className={styles.v2EnhanceIcon}>
        <AiSparkle width={16} height={16} />
      </div>
      <div className={styles.v2EnhanceText}>
        <div className={styles.v2EnhanceTitle}>Your notes are ready to enhance</div>
        <div className={styles.v2EnhanceSub}>AI will merge your notes with the full transcript</div>
      </div>
      <Button variant="primary" size="sm">Enhance Notes</Button>
    </div>
  );
}

function V2AiCard({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className={styles.v2AiCard}>
      <div className={styles.v2AiCardHeader} onClick={() => setOpen(!open)}>
        <span className={`${styles.v2AiCardChevron} ${open ? styles.v2AiCardChevronOpen : ""}`}>
          <ChevronRight width={12} height={12} />
        </span>
        <span className={styles.v2AiCardTitle}>{title}</span>
      </div>
      {open && <div className={styles.v2AiCardBody}>{children}</div>}
    </div>
  );
}

function V2UserBubble({ text }: { text: string }) {
  return (
    <div className={styles.v2UserBubbleWrap}>
      <div className={styles.v2UserBubble}>{text}</div>
    </div>
  );
}

function V2AiBubble({ text, citations }: { text: string; citations?: string[] }) {
  return (
    <div className={styles.v2AiBubbleWrap}>
      <div className={styles.v2AiBubbleAvatar}>
        <AiSparkle width={16} height={16} />
      </div>
      <div className={styles.v2AiBubbleBody}>
        <p className={styles.v2AiBubbleText}>
          {text}
          {citations?.map((c) => (
            <span key={c} className={styles.v2Citation}>
              <DocumentText width={9} height={9} /> {c}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

function V2ChatWelcome() {
  return (
    <div className={styles.v2ChatWelcome}>
      <div className={styles.v2ChatWelcomeIcon}>
        <ChatBubble width={22} height={22} />
      </div>
      <h2 className={styles.v2ChatWelcomeTitle}>Chat with your meetings</h2>
      <p className={styles.v2ChatWelcomeSub}>
        Ask questions about past meetings, find decisions, surface action items, or generate summaries across all your notes.
      </p>
      <div className={styles.v2Suggestions}>
        <button type="button" className={styles.v2Chip}>What did I miss this week?</button>
        <button type="button" className={styles.v2Chip}>List all action items</button>
        <button type="button" className={styles.v2Chip}>Summarize yesterday</button>
      </div>
    </div>
  );
}

function V2ChatInput({ value, ready }: { value?: string; ready?: boolean }) {
  return (
    <div className={styles.v2ChatInputBox}>
      <textarea
        className={styles.v2ChatInputField}
        placeholder="Ask anything about your meetings..."
        defaultValue={value}
        rows={1}
        readOnly
      />
      <div className={styles.v2ChatInputToolbar}>
        <span className={styles.v2ChatInputHint}>
          <span className={styles.v2Kbd}>⌘</span>
          <span className={styles.v2Kbd}>↵</span>
          to send
        </span>
        <button type="button" className={`${styles.v2SendBtn} ${ready ? styles.v2SendBtnReady : ""}`}>
          <ChevronRight width={14} height={14} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Composed Page Views — Sentra Edition
   ═══════════════════════════════════════════ */

function ComposedDashboard() {
  const [sidebarActive, setSidebarActive] = useState("home");
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "shared", label: "Shared with me", icon: People },
    { id: "chat", label: "Chat", icon: ChatBubble },
  ];
  const folders = [
    { id: "my-notes", label: "My notes", color: "var(--tag-purple-bg)", iconColor: "var(--tag-purple-text)" },
    { id: "sentra-team", label: "Sentra team", color: "var(--bg-error-subtle)", iconColor: "var(--fg-error)" },
    { id: "customer-calls", label: "Customer calls", color: "var(--bg-info-subtle)", iconColor: "var(--fg-info)" },
  ];

  return (
    <div className={styles.composedShell}>
      {/* Sidebar */}
      <div className={styles.v2Sidebar} style={{ height: "100%", borderRight: "1px solid var(--border-subtle)" }}>
        <div className={styles.v2SidebarHeader}>
          <button type="button" className={styles.v2WorkspaceBtn}>
            <span className={styles.v2WorkspaceAvatar}>
              <span className={styles.v2WorkspaceAvatarInner} style={{ background: "var(--button-brand)" }}>
                <span style={{ color: "var(--fg-on-color)", fontSize: 9, fontWeight: 700 }}>S</span>
              </span>
            </span>
            <span className={styles.v2WorkspaceName}>Sentra</span>
            <svg width={12} height={12} viewBox="0 0 12 12" fill="none" style={{ color: "var(--fg-muted)" }}>
              <path d="M4 5l2-2 2 2M4 7l2 2 2-2" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <nav className={styles.v2SidebarNav}>
          <div className={styles.v2SidebarNavContent}>
            <div className={styles.v2SidebarMenuGroup}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} type="button" className={`${styles.v2SidebarItem} ${sidebarActive === item.id ? styles.v2SidebarItemActive : ""}`} onClick={() => setSidebarActive(item.id)}>
                    <span className={styles.v2SidebarItemIcon}><Icon width={16} height={16} /></span>
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className={styles.v2SidebarMenuGroup}>
              <div className={styles.v2SidebarSectionLabel}>
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none"><path d="M5 3l3 3-3 3" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                Spaces
              </div>
              {folders.map((folder) => (
                <button key={folder.id} type="button" className={`${styles.v2SidebarItem} ${sidebarActive === folder.id ? styles.v2SidebarItemActive : ""}`} onClick={() => setSidebarActive(folder.id)}>
                  <span className={styles.v2ResourceAvatar}>
                    <span className={styles.v2ResourceAvatarInner} style={{ background: folder.color }}>
                      <svg width={5} height={5} viewBox="0 0 5 5" fill="none"><rect width={5} height={5} rx={1} fill={folder.iconColor} /></svg>
                    </span>
                  </span>
                  {folder.label}
                </button>
              ))}
            </div>
          </div>
        </nav>
        <div className={styles.v2SidebarFooter}>
          <button type="button" className={styles.v2SidebarFooterItem}>
            <span className={styles.v2SidebarItemIcon}><MagnifyingGlass width={16} height={16} /></span>
            Search
            <span className={styles.v2SidebarBadge}>⌘K</span>
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className={styles.composedContent}>
        <div className={styles.composedContentInner}>
          {/* Notification overlay */}
          <div className={styles.composedNotifOverlay}>
            <V2NotifBar title="Critique of current UI/UX" subtitle="Starting now" />
          </div>

          {/* Top bar */}
          <div className={styles.composedTopBar}>
            <span className={styles.composedTopBarTitle}>Home</span>
            <div className={styles.composedTopBarActions}>
              <Button variant="secondary" size="sm"><Plus width={13} height={13} /> New meeting</Button>
            </div>
          </div>

          {/* Meeting list */}
          <div className={styles.composedBody}>
            <div className={styles.composedMeetingGroup}>
              <div className={styles.composedGroupLabel}>Today</div>
              <div className={styles.composedMeetingList}>
                <V2MeetingRow emoji="🎯" title="Get started with Sentra" subtitle="Try a demo meeting (3 min)" time="Now" typeBadge="Live" typeDotColor="var(--status-green)" participants={["S", "A"]} />
                <V2MeetingRow emoji="🎨" title="Critique of current UI/UX" subtitle="Tuesday 3:00 PM" time="3:00 PM" typeBadge="Meeting" typeDotColor="var(--status-blue)" participants={["S", "A", "B", "C"]} active />
                <V2MeetingRow emoji="⚡" title="Sentra x Ionic" subtitle="Wednesday 10:00 AM" time="10:00 AM" typeBadge="Sync" typeDotColor="var(--status-purple)" participants={["S", "J"]} />
              </div>
            </div>
            <div className={styles.composedMeetingGroup}>
              <div className={styles.composedGroupLabel}>This Week</div>
              <div className={styles.composedMeetingList}>
                <V2MeetingRow emoji="👥" title="All Hands" subtitle="Friday 10:00 PM" time="10:00 PM" typeBadge="Recurring" typeDotColor="var(--status-orange)" participants={["S", "A", "B", "C", "D"]} />
                <V2MeetingRow emoji="📊" title="Revenue Review" subtitle="Thursday 2:00 PM" time="2:00 PM" typeBadge="Meeting" typeDotColor="var(--status-blue)" participants={["S", "B"]} />
                <V2MeetingRow emoji="🔧" title="Engineering Standup" subtitle="Daily 9:30 AM" time="9:30 AM" typeBadge="Recurring" typeDotColor="var(--status-orange)" participants={["S", "A", "B"]} />
              </div>
            </div>
          </div>

          {/* Recording pill overlay */}
          <div className={styles.composedPillOverlay}>
            <V2PillExpanded time="03:42" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ComposedNotes() {
  return (
    <div className={styles.composedShell}>
      {/* Note list sidebar */}
      <div style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", borderRight: "1px solid var(--border-subtle)", background: "var(--bg-subtle)" }}>
        <div style={{ padding: "var(--space-3)", borderBottom: "1px solid var(--border-subtle)" }}>
          <Input placeholder="Search notes..." size="sm" />
        </div>
        <div className={styles.composedNotesList}>
          <V2NoteRow title="Q1 Planning Review" author="You · 1,285 words" wordCount={1285} enhanced typeBadge="Milestone" typeDotColor="var(--status-green)" />
          <V2NoteRow title="Sprint Retrospective — Week 7" author="You · 843 words" wordCount={843} typeBadge="Decision" typeDotColor="var(--status-blue)" />
          <V2NoteRow title="Customer Discovery Call" author="You · 620 words" wordCount={620} enhanced typeBadge="Meeting" typeDotColor="var(--status-purple)" />
          <V2NoteRow title="New note" author="You" wordCount={0} />
        </div>
      </div>

      {/* Content area */}
      <div className={styles.composedContent}>
        <div className={styles.composedContentInner}>
          {/* Enhance callout */}
          <div className={styles.composedEnhanceBanner} style={{ paddingTop: "var(--space-3)" }}>
            <V2EnhanceCallout />
          </div>

          {/* Notes + AI pane */}
          <div className={styles.composedNotesLayout}>
            {/* Editor */}
            <div className={styles.composedEditorPane}>
              <div className={styles.composedEditorFull}>
                <input type="text" className={styles.composedEditorFullTitle} defaultValue="Q1 Planning Review" placeholder="New note" />
                <div className={styles.composedEditorFullTags}>
                  <Badge variant="secondary" size="sm"><Calendar width={11} height={11} /> Sat, Feb 22</Badge>
                  <Badge variant="secondary" size="sm"><People width={11} height={11} /> 4 participants</Badge>
                  <Badge variant="secondary" size="sm"><Plus width={10} height={10} /> Add to folder</Badge>
                </div>
                <textarea
                  className={styles.composedEditorFullTextarea}
                  defaultValue={"## Key Decisions\n1. CSS Modules confirmed as styling approach\n2. Design tokens are the source of truth\n3. Component review tool is the quality gate\n\n## Action Items\n- Complete migration pipeline — Shaurya\n- Draft Q2 hiring plan — Alice\n- Update revenue projections — Bob\n\n## Notes\n- Migration target: 70 components by end of February\n- Need to finalize spacing passes across all components\n- Dark mode should be supported from day one"}
                  placeholder="Write notes..."
                />
              </div>
            </div>

            {/* AI pane */}
            <div className={styles.composedAiPane}>
              <div className={styles.composedAiPaneTitle}>AI Summary</div>
              <V2AiCard title="Summary" defaultOpen>
                <p className={styles.v2AiText}>
                  Discussed Q1 product strategy and roadmap priorities. The team aligned on three key workstreams:
                  design system migration, meeting intelligence features, and enterprise onboarding.
                </p>
              </V2AiCard>
              <V2AiCard title="Key Decisions" defaultOpen>
                <ul className={styles.v2AiList}>
                  {["CSS Modules confirmed as styling approach", "Design tokens are the source of truth", "Dark mode from day one"].map((item) => (
                    <li key={item} className={styles.v2AiListItem}>
                      <span className={styles.v2AiBullet} />
                      {item}
                    </li>
                  ))}
                </ul>
              </V2AiCard>
              <V2AiCard title="Action Items" defaultOpen>
                <ul className={styles.v2AiList}>
                  {[
                    { task: "Complete migration pipeline", assignee: "Shaurya" },
                    { task: "Draft Q2 hiring plan", assignee: "Alice" },
                    { task: "Update revenue projections", assignee: "Bob" },
                  ].map((item) => (
                    <li key={item.task} className={styles.v2AiActionItem}>
                      <span className={styles.v2AiActionCheck}>
                        <Checkbox checked={false} onCheckedChange={() => {}} />
                      </span>
                      {item.task}
                      <span className={styles.v2AiActionAssignee}>— {item.assignee}</span>
                    </li>
                  ))}
                </ul>
              </V2AiCard>
              <V2AiCard title="Full Transcript">
                <pre className={styles.v2Transcript}>{"[00:00] Shaurya: Let's kick off Q1 planning.\n[00:15] Alice: I've prepared the hiring pipeline.\n[01:02] Bob: Revenue projections are on track..."}</pre>
              </V2AiCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComposedChat() {
  return (
    <div className={styles.composedShell}>
      {/* Content area — full width, no sidebar */}
      <div className={styles.composedContent}>
        <div className={styles.composedContentInner}>
          {/* Top bar */}
          <div className={styles.composedTopBar}>
            <span className={styles.composedTopBarTitle}>Chat with your meetings</span>
          </div>

          {/* Chat layout */}
          <div className={styles.composedChatLayout}>
            <div className={styles.composedChatMessages}>
              <V2ChatWelcome />
              <V2UserBubble text="What did I miss this week?" />
              <V2AiBubble
                text="This week you had 4 meetings. Key highlights: the Q1 Planning Review aligned on 70 components by end of Feb, and the Sprint Retro showed 20% velocity improvement."
                citations={["Q1 Planning Review", "Sprint Retro"]}
              />
              <V2UserBubble text="List all the action items from Q1 planning" />
              <V2AiBubble
                text="Here are the open action items: 1) Complete migration pipeline (Shaurya), 2) Draft Q2 hiring plan (Alice), 3) Update revenue dashboard (Bob)."
                citations={["Q1 Planning Review"]}
              />
            </div>
            <div className={styles.composedChatInputArea}>
              <V2ChatInput />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   macOS Status Menu Concept
   ═══════════════════════════════════════════ */

function MacStatusMenu({ state }: { state: "idle" | "recording" | "uploading" }) {
  const isRecording = state === "recording";
  const isUploading = state === "uploading";
  return (
    <div>
      <p style={{ fontSize: 11, color: "var(--fg-muted)", marginBottom: 4 }}>
        {state === "idle" ? "Idle" : state === "recording" ? "Recording" : "Uploading"}
      </p>
      <div className={styles.macMenu}>
        <div className={styles.macMenuBar}>
          <span className={styles.macMenuIcon}>
            <Microphone width={14} height={14} />
          </span>
          {isRecording && <span className={styles.macMenuDot} />}
        </div>
        <div className={styles.macMenuDropdown}>
          {isRecording && (
            <div className={styles.macMenuItem} style={{ color: "var(--status-red)" }}>
              <span className={styles.macMenuDotLive} />
              Recording — 03:42
            </div>
          )}
          {isUploading && (
            <div className={styles.macMenuItem} style={{ color: "var(--status-blue)" }}>
              Uploading "Sprint Retro"…
            </div>
          )}
          <div className={styles.macMenuItem}>
            {isRecording ? "Stop & Upload" : "Start Recording"}
          </div>
          <div className={styles.macMenuSep} />
          <div className={styles.macMenuItem}>Open Sentra</div>
          <div className={styles.macMenuItem}>Preferences…</div>
          <div className={styles.macMenuSep} />
          <div className={styles.macMenuItem} style={{ color: "var(--fg-muted)" }}>Quit Sentra</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Main Export — Component Showcase
   ═══════════════════════════════════════════ */

export function MeetingRecorderPage() {
  return (
    <div style={{ padding: "2rem", fontFamily: "var(--font-family)" }}>
      <h1>Meeting Recorder</h1>
      <p style={{ color: "var(--fg-muted)", marginBottom: "2rem", fontSize: "0.875rem", lineHeight: 1.5 }}>
        Sentra Edition — built with exact design tokens and product-quality polish.
      </p>

      {/* ── v2 Notification Bar ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeadingStyle}>Notification Bar</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 480 }}>
          <div>
            <p style={{ fontSize: 11, color: "var(--fg-muted)", marginBottom: 4 }}>Meeting (blue dot)</p>
            <V2NotifBar title="Critique of current UI/UX" subtitle="Starting now" />
          </div>
          <div>
            <p style={{ fontSize: 11, color: "var(--fg-muted)", marginBottom: 4 }}>Scheduled (green dot)</p>
            <V2NotifBar title="All Hands" subtitle="Friday 10:00 PM" dotColor="var(--status-green)" />
          </div>
          <div>
            <p style={{ fontSize: 11, color: "var(--fg-muted)", marginBottom: 4 }}>Alert (red dot)</p>
            <V2NotifBar title="Urgent: Security Review" subtitle="Requires immediate attention" dotColor="var(--status-red)" />
          </div>
        </div>
      </section>

      {/* ── v2 Recording Pill ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeadingStyle}>Recording Pill</h2>
        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 11, color: "var(--fg-muted)", marginBottom: 8 }}>Collapsed</p>
            <V2PillCollapsed />
          </div>
          <div>
            <p style={{ fontSize: 11, color: "var(--fg-muted)", marginBottom: 8 }}>Expanded (recording)</p>
            <V2PillExpanded time="03:42" />
          </div>
          <div>
            <p style={{ fontSize: 11, color: "var(--fg-muted)", marginBottom: 8 }}>Expanded (paused)</p>
            <V2PillPaused time="12:07" />
          </div>
        </div>
      </section>

      {/* ── v2 Note Editor ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeadingStyle}>Note Editor</h2>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 11, color: "var(--fg-muted)", marginBottom: 4 }}>Empty</p>
            <V2NoteEditor state="empty" />
          </div>
          <div>
            <p style={{ fontSize: 11, color: "var(--fg-muted)", marginBottom: 4 }}>In-meeting notes</p>
            <V2NoteEditor state="writing" />
          </div>
          <div>
            <p style={{ fontSize: 11, color: "var(--fg-muted)", marginBottom: 4 }}>With content</p>
            <V2NoteEditor state="with-content" />
          </div>
        </div>
      </section>

      {/* ── macOS Status Menu Concept ── */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={sectionHeadingStyle}>macOS Status Menu (Concept)</h2>
        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
          <MacStatusMenu state="idle" />
          <MacStatusMenu state="recording" />
          <MacStatusMenu state="uploading" />
        </div>
      </section>
    </div>
  );
}
