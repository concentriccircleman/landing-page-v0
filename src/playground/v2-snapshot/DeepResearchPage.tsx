import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { Badge } from "../../components/Badge";
import { TopBar } from "../../components/TopBar";
import { Button } from "../../components/Button";
import { PromptSuggestion } from "../../components/PromptSuggestion";
import {
  SendCircle, ChevronDown, Link as LinkIcon, Loading, Clipboard,
  Plus, ChatBubble, XMark, AiSparkle,
} from "../../icons/outline";
import { useResearch, type ResearchThread, type Source, type Finding } from "./ResearchContext";
import styles from "../DeepResearchPage.module.css";

/* ── Suggestions ── */

const suggestions = [
  "What are our biggest customer pain points?",
  "Competitive analysis of AI transcription tools",
  "Enterprise onboarding best practices for SaaS",
  "Meeting culture trends in remote-first companies",
  "How do top SaaS companies handle data privacy?",
  "What integrations do enterprise buyers expect?",
];

/* ── Source Item ── */

function SourceItem({ source }: { source: Source }) {
  const typeLabel = source.type === "meeting" ? "Meeting" : source.type === "document" ? "Doc" : "Web";
  return (
    <a href={source.url} className={styles.sourceItem} target="_blank" rel="noopener noreferrer" onClick={(e) => e.preventDefault()}>
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

function FindingItem({ finding }: { finding: Finding }) {
  return (
    <div className={styles.finding}>
      <h4 className={styles.findingHeading}>{finding.heading}</h4>
      <p className={styles.findingBody}>{finding.body}</p>
    </div>
  );
}

/* ── Research Card ── */

function ResearchCard({ thread, expanded, onToggle }: { thread: ResearchThread; expanded: boolean; onToggle: () => void }) {
  const isQueued = thread.status === "queued";
  const isActive = thread.status === "in-progress";
  const detailCount = thread.findings.length + thread.sources.length;

  return (
    <div className={`${styles.card} ${isQueued ? styles.cardQueued : ""}`}>
      <div className={styles.cardTop}>
        <span className={styles.cardTitle}>{thread.title}</span>
        {isActive && <Loading width={14} height={14} className={styles.loadingIcon} />}
      </div>

      {!isQueued && thread.summary && (
        <p className={styles.cardText}>{thread.summary}</p>
      )}

      {isQueued && (
        <p className={styles.cardWaiting}>Waiting to start&hellip;</p>
      )}

      {!isQueued && detailCount > 0 && (
        <>
          <button type="button" className={styles.expandBtn} onClick={onToggle} aria-expanded={expanded}>
            <span className={`${styles.expandBtnIcon} ${expanded ? styles.expandBtnIconOpen : ""}`}>
              <ChevronDown width={14} height={14} />
            </span>
            {expanded ? "Hide" : `${thread.findings.length} findings · ${thread.sources.length} sources`}
          </button>

          {expanded && (
            <div className={styles.cardExpanded}>
              {thread.findings.length > 0 && (
                <div className={styles.findingsSection}>
                  <h3 className={styles.sectionLabel}>Key Findings</h3>
                  <div className={styles.findingsList}>
                    {thread.findings.map((f, i) => <FindingItem key={i} finding={f} />)}
                  </div>
                </div>
              )}
              {thread.sources.length > 0 && (
                <div className={styles.sourcesSection}>
                  <h3 className={styles.sectionLabel}>
                    Sources
                    <span className={styles.sectionCount}>{thread.sources.length}</span>
                  </h3>
                  <div className={styles.sourcesList}>
                    {thread.sources.map((s, i) => <SourceItem key={i} source={s} />)}
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

/* ── Typing Indicator ── */

function TypingIndicator() {
  return (
    <div className={styles.typingWrap}>
      <div className={styles.typingDots}>
        <span className={styles.typingDot} />
        <span className={styles.typingDot} />
        <span className={styles.typingDot} />
      </div>
      <span className={styles.typingLabel}>Sentra is researching&hellip;</span>
    </div>
  );
}

/* ── Chat History Panel ── */

function ChatHistoryPanel({ onClose }: { onClose: () => void }) {
  const { conversations, activeConversationId, selectConversation, newChat } = useResearch();

  return (
    <div className={styles.historyPanel}>
      <div className={styles.historyHeader}>
        <span className={styles.historyTitle}>Chat History</span>
        <button type="button" className={styles.historyClose} onClick={onClose} aria-label="Close">
          <XMark />
        </button>
      </div>
      <div className={styles.historyActions}>
        <button type="button" className={styles.newChatBtnSmall} onClick={() => { newChat(); onClose(); }}>
          <Plus width={13} height={13} />
          New chat
        </button>
      </div>
      <div className={styles.historyList}>
        {conversations.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`${styles.historyItem} ${c.id === activeConversationId ? styles.historyItemActive : ""}`}
            onClick={() => { selectConversation(c.id); onClose(); }}
          >
            <ChatBubble width={13} height={13} className={styles.historyItemIcon} />
            <div className={styles.historyItemBody}>
              <span className={styles.historyItemTitle}>{c.title}</span>
              <span className={styles.historyItemMeta}>{c.threads.length} {c.threads.length === 1 ? "message" : "messages"} · {c.date}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Inline Input (shared between welcome and pinned) ── */

function ChatInput({
  textareaRef,
  query,
  onChange,
  onKeyDown,
  onSubmit,
  disabled,
  inline,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  query: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  disabled: boolean;
  inline?: boolean;
}) {
  return (
    <div className={inline ? styles.inputInline : styles.inputArea}>
      <div className={styles.inputContainer}>
        <div className={styles.inputBox}>
          <textarea
            ref={textareaRef}
            className={styles.inputField}
            placeholder="Ask a research question..."
            value={query}
            onChange={onChange}
            onKeyDown={onKeyDown}
            rows={1}
            disabled={disabled}
          />
          <div className={styles.inputToolbar}>
            <span className={styles.inputHint}>Sentra analyzes meetings &amp; external sources</span>
            <button
              type="button"
              className={`${styles.sendBtn} ${query.trim() ? styles.sendBtnReady : ""}`}
              aria-label="Send"
              onClick={onSubmit}
              disabled={disabled || !query.trim()}
            >
              <SendCircle width={20} height={20} />
            </button>
          </div>
        </div>
        <div className={styles.inputMeta}>
          <span className={styles.inputMetaHint}>Deep research across your meetings and the web</span>
          <span className={styles.kbdHint}>
            <kbd>Enter</kbd> to send · <kbd>Shift + Enter</kbd> for new line
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Page Component ── */

export function DeepResearchPage() {
  const { threads, expandedCards, isResearching, query, setQuery, submitQuery, toggleCard, newChat } = useResearch();
  const [historyOpen, setHistoryOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const isEmpty = threads.length === 0 && !isResearching;

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

  const handleSuggestionSubmit = useCallback((text: string) => {
    submitQuery(text);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setTimeout(() => {
      bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, [submitQuery]);

  return (
    <div className={styles.page}>
      <TopBar
        breadcrumbs={[{ label: "Deep Research" }]}
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setHistoryOpen(true)}>
              <ChatBubble width={14} height={14} /> History
            </Button>
            <Button variant="primary" size="sm" onClick={newChat}>
              <Plus width={14} height={14} /> New Chat
            </Button>
          </>
        }
      />

      <div className={styles.bodyRow}>
        <div className={`${styles.bodyMain} ${isEmpty ? styles.bodyMainEmpty : ""}`} ref={bodyRef}>

          {/* ── Welcome (empty state) ── */}
          {isEmpty && (
            <div className={styles.welcomeWrap}>
              <div className={styles.welcomeContent}>
                <div className={styles.emptyIcon}>
                  <AiSparkle width={22} height={22} />
                </div>
                <h2 className={styles.emptyTitle}>Chat with Memory</h2>
                <p className={styles.emptyDesc}>
                  Ask anything about your meetings, team decisions, or industry trends.
                  Sentra will research across your data and the web.
                </p>

                <ChatInput
                  textareaRef={textareaRef}
                  query={query}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onSubmit={handleSubmit}
                  disabled={isResearching}
                  inline
                />

                <div className={styles.suggestGrid}>
                  <p className={styles.suggestLabel}>Suggested topics</p>
                  <div className={styles.suggestItems}>
                    {suggestions.map((s) => (
                      <PromptSuggestion key={s} size="sm" onClick={() => handleSuggestionSubmit(s)}>
                        {s}
                      </PromptSuggestion>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Thread list (active chat) ── */}
          {!isEmpty && (
            <>
              <div className={styles.threadList}>
                {threads.map((thread) => (
                  <div key={thread.id} className={styles.thread}>
                    <div className={styles.queryRow}>
                      <div className={styles.queryBubble}>
                        <span className={styles.queryText}>{thread.query}</span>
                        <button type="button" className={styles.queryCopy} aria-label="Copy" onClick={() => navigator.clipboard.writeText(thread.query)}>
                          <Clipboard width={12} height={12} />
                        </button>
                      </div>
                    </div>
                    <ResearchCard
                      thread={thread}
                      expanded={expandedCards.has(thread.id)}
                      onToggle={() => toggleCard(thread.id)}
                    />
                  </div>
                ))}

                {isResearching && <TypingIndicator />}
              </div>

              {threads.length > 0 && !isResearching && (
                <div className={styles.suggestSection}>
                  <p className={styles.suggestLabel}>Try asking</p>
                  <div className={styles.suggestChips}>
                    {suggestions.slice(0, 3).map((s) => (
                      <PromptSuggestion key={s} size="sm" onClick={() => handleSuggestionSubmit(s)}>
                        {s}
                      </PromptSuggestion>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {historyOpen && (
          <ChatHistoryPanel onClose={() => setHistoryOpen(false)} />
        )}
      </div>

      {/* Pinned input — only visible when threads exist */}
      {!isEmpty && (
        <ChatInput
          textareaRef={textareaRef}
          query={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onSubmit={handleSubmit}
          disabled={isResearching}
        />
      )}
    </div>
  );
}
