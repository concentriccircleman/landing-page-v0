import { useRef, useCallback, type KeyboardEvent } from "react";
import { Badge } from "../../components/Badge";
import {
  AiSparkle,
  XMark,
  SendCircle,
  ChevronDown,
  Link as LinkIcon,
  Loading,
  Clipboard,
  Expand,
} from "../../icons/outline";
import { useResearch, type ResearchThread, type Source, type Finding } from "./ResearchContext";
import styles from "../ResearchPanel.module.css";

/* ── Context-aware suggestions ── */

const suggestionsByPage: Record<string, string[]> = {
  "weekly-reports": [
    "Summarize this week's progress",
    "What blockers were raised?",
    "Compare this week to last week",
    "What are the key highlights?",
  ],
  "risk-radar": [
    "Summarize active risks",
    "What are the highest severity issues?",
    "Who is most affected by current risks?",
    "What risks were resolved this week?",
  ],
  reports: [
    "Summarize this week's progress",
    "What are the highest severity risks?",
    "Compare this week to last week",
    "What risks were resolved this week?",
  ],
  "meeting-notes": [
    "Summarize recent meetings",
    "What decisions were made this week?",
    "What action items are outstanding?",
    "Who was in the last standup?",
  ],
  memory: [
    "Find decisions about the timeline",
    "What did the team agree on?",
    "Latest insights about competitors",
    "What rules has the team set?",
  ],
};

const defaultSuggestions = [
  "Summarize this week's key risks",
  "What did Carol say about the timeline?",
  "Find action items from last standup",
  "Who owns the data pipeline migration?",
];

/* ── Source Item ── */

function PanelSourceItem({ source }: { source: Source }) {
  const typeLabel = source.type === "meeting" ? "Meeting" : source.type === "document" ? "Doc" : "Web";
  return (
    <a
      href={source.url}
      className={styles.sourceItem}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.preventDefault()}
    >
      <div className={styles.sourceHeader}>
        <LinkIcon width={11} height={11} />
        <span className={styles.sourceTitle}>{source.title}</span>
        <Badge variant="outline" size="sm">{typeLabel}</Badge>
      </div>
      <p className={styles.sourceSnippet}>{source.snippet}</p>
    </a>
  );
}

/* ── Finding Item ── */

function PanelFindingItem({ finding }: { finding: Finding }) {
  return (
    <div className={styles.finding}>
      <h5 className={styles.findingHeading}>{finding.heading}</h5>
      <p className={styles.findingBody}>{finding.body}</p>
    </div>
  );
}

/* ── Research Card ── */

function PanelCard({
  thread,
  expanded,
  onToggle,
}: {
  thread: ResearchThread;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isQueued = thread.status === "queued";
  const isActive = thread.status === "in-progress";
  const detailCount = thread.findings.length + thread.sources.length;

  return (
    <div className={`${styles.card} ${isQueued ? styles.cardQueued : ""}`}>
      <div className={styles.cardTop}>
        <span className={styles.cardTitle}>{thread.title}</span>
        {isActive && <Loading width={13} height={13} className={styles.loadingIcon} />}
      </div>

      {!isQueued && thread.summary && (
        <p className={styles.cardText}>{thread.summary}</p>
      )}

      {isQueued && <p className={styles.cardWaiting}>Waiting to start&hellip;</p>}

      {!isQueued && detailCount > 0 && (
        <>
          <button type="button" className={styles.expandBtn} onClick={onToggle} aria-expanded={expanded}>
            <span className={`${styles.expandBtnIcon} ${expanded ? styles.expandBtnIconOpen : ""}`}>
              <ChevronDown width={13} height={13} />
            </span>
            {expanded ? "Hide" : `${thread.findings.length} findings · ${thread.sources.length} sources`}
          </button>

          {expanded && (
            <div className={styles.cardExpanded}>
              {thread.findings.length > 0 && (
                <div className={styles.findingsSection}>
                  <h4 className={styles.sectionLabel}>Key Findings</h4>
                  <div className={styles.findingsList}>
                    {thread.findings.map((f, i) => (
                      <PanelFindingItem key={i} finding={f} />
                    ))}
                  </div>
                </div>
              )}
              {thread.sources.length > 0 && (
                <div className={styles.sourcesSection}>
                  <h4 className={styles.sectionLabel}>
                    Sources
                    <span className={styles.sectionCount}>{thread.sources.length}</span>
                  </h4>
                  <div className={styles.sourcesList}>
                    {thread.sources.map((s, i) => (
                      <PanelSourceItem key={i} source={s} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── Main Panel ── */

export interface ResearchPanelProps {
  onClose: () => void;
  onNavigate?: (page: string) => void;
  pageContext?: string;
}

export function ResearchPanel({ onClose, onNavigate, pageContext }: ResearchPanelProps) {
  const { threads, expandedCards, isResearching, query, setQuery, submitQuery, toggleCard } = useResearch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const suggestions = (pageContext && suggestionsByPage[pageContext]) || defaultSuggestions;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [setQuery]);

  const handleSubmit = useCallback(() => {
    submitQuery();
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setTimeout(() => {
      bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, [submitQuery]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleSuggestion = (text: string) => {
    setQuery(text);
    textareaRef.current?.focus();
  };

  const handleExpand = () => {
    if (onNavigate) onNavigate("deep-research");
    onClose();
  };

  const hasThreads = threads.length > 0 || isResearching;

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.headerIcon}>
          <AiSparkle width={14} height={14} />
        </span>
        <span className={styles.headerTitle}>Research</span>
        <button type="button" className={styles.headerBtn} onClick={handleExpand} aria-label="Open full page">
          <Expand width={13} height={13} />
        </button>
        <button type="button" className={styles.headerBtn} onClick={onClose} aria-label="Close panel">
          <XMark width={14} height={14} />
        </button>
      </div>

      {/* Body */}
      <div className={styles.body} ref={bodyRef}>
        {hasThreads ? (
          <>
            {threads.map((thread) => (
              <div key={thread.id} className={styles.thread}>
                <div className={styles.queryBubble}>
                  <span className={styles.queryText}>{thread.query}</span>
                  <button
                    type="button"
                    className={styles.queryCopy}
                    aria-label="Copy"
                    onClick={() => navigator.clipboard.writeText(thread.query)}
                  >
                    <Clipboard width={11} height={11} />
                  </button>
                </div>
                <PanelCard
                  thread={thread}
                  expanded={expandedCards.has(thread.id)}
                  onToggle={() => toggleCard(thread.id)}
                />
              </div>
            ))}
            {isResearching && (
              <div className={styles.typingWrap}>
                <div className={styles.typingDots}>
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                </div>
                <span className={styles.typingLabel}>Researching&hellip;</span>
              </div>
            )}
          </>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <AiSparkle width={18} height={18} />
            </span>
            <h3 className={styles.emptyTitle}>Ask anything</h3>
            <p className={styles.emptyDesc}>
              Research across your meetings, documents, and the web.
            </p>
            <div className={styles.suggestChips}>
              {suggestions.map((s) => (
                <button key={s} type="button" className={styles.chip} onClick={() => handleSuggestion(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className={styles.inputArea}>
        <div className={styles.inputBox}>
          <textarea
            ref={textareaRef}
            className={styles.inputField}
            placeholder="Ask a question..."
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isResearching}
          />
          <div className={styles.inputToolbar}>
            <span className={styles.inputHint}>Meetings &amp; web</span>
            <button
              type="button"
              className={`${styles.sendBtn} ${query.trim() ? styles.sendBtnReady : ""}`}
              aria-label="Send"
              onClick={handleSubmit}
              disabled={isResearching || !query.trim()}
            >
              <SendCircle width={20} height={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
