import { useState, useRef, useCallback, useEffect, type KeyboardEvent } from "react";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Markdown } from "../components/Markdown";
import { PromptSuggestion } from "../components/PromptSuggestion";
import {
  ArrowUp, Link as LinkIcon, Loading, Clipboard,
  Plus, ChatBubble, AiSparkle, ChevronDown,
} from "../icons/outline";
import { useResearch, type ResearchThread, type Source } from "./ResearchContext";
import styles from "./DeepResearchPage.module.css";

const suggestions = [
  "What are our biggest customer pain points?",
  "Competitive analysis of AI transcription tools",
  "Enterprise onboarding best practices for SaaS",
];

/* ── Source type helpers ── */

function sourceTypeLabel(source: Source): string {
  if (source.type === "meeting") {
    if (source.platform === "google-meet") return "Google Meet";
    if (source.platform === "zoom") return "Zoom";
    if (source.platform === "teams") return "Teams";
    return "Meeting";
  }
  if (source.type === "document") {
    if (source.platform === "notion") return "Notion";
    if (source.platform === "confluence") return "Confluence";
    return "Document";
  }
  return "Web";
}

function SourceIcon({ source }: { source: Source }) {
  if (source.type === "meeting") {
    return (
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="8" height="8" rx="1" />
        <path d="M9 6l3.5-2v6L9 8" />
      </svg>
    );
  }
  if (source.type === "document") {
    return (
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 1H3.5A1.5 1.5 0 002 2.5v9A1.5 1.5 0 003.5 13h7a1.5 1.5 0 001.5-1.5V5L8 1z" />
        <path d="M8 1v4h4" />
      </svg>
    );
  }
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="5.5" />
      <path d="M1.5 7h11M7 1.5c1.5 1.5 2.3 3.4 2.5 5.5-.2 2.1-1 4-2.5 5.5-1.5-1.5-2.3-3.4-2.5-5.5.2-2.1 1-4 2.5-5.5z" />
    </svg>
  );
}

/* ── Collapsible Sources ── */

function SourcesSection({ sources }: { sources: Source[] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.sourcesSection}>
      <button
        type="button"
        className={styles.sourcesToggle}
        onClick={() => setExpanded(!expanded)}
      >
        <ChevronDown
          width={12}
          height={12}
          className={styles.sourcesChevron}
          style={{ transform: expanded ? "rotate(0deg)" : "rotate(-90deg)" }}
        />
        <span>{sources.length} {sources.length === 1 ? "source" : "sources"}</span>
      </button>
      {expanded && (
        <div className={styles.sourcesList}>
          {sources.map((s, i) => (
            <div key={i} className={styles.sourceItem}>
              <span className={styles.sourceItemIcon}><SourceIcon source={s} /></span>
              <span className={styles.sourceItemType}>{sourceTypeLabel(s)}</span>
              <span className={styles.sourceItemTitle}>{s.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Research Card ── */

function ResearchCard({ thread }: { thread: ResearchThread }) {
  const isQueued = thread.status === "queued";
  const isActive = thread.status === "in-progress";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(thread.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const time = thread.date
    ? new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : "";

  return (
    <div className={styles.responseWrap}>
      <div className={styles.responseAvatar}>
        <AiSparkle width={12} height={12} />
      </div>
      <div className={styles.responseBody}>
        <div className={styles.responseMeta}>
          <span className={styles.responseLabel}>Sentra</span>
          {thread.duration && <span className={styles.responseDuration}>{thread.duration}</span>}
        </div>
        <div className={`${styles.card} ${isQueued ? styles.cardQueued : ""}`}>
          {isActive && (
            <div className={styles.cardLoading}>
              <Loading width={14} height={14} className={styles.loadingIcon} />
              <span>Researching...</span>
            </div>
          )}

          {!isQueued && thread.summary && (
            <div className={styles.cardBody}>
              <div className={styles.markdownWrap}>
                <Markdown content={thread.summary} />
              </div>
            </div>
          )}

          {isQueued && <p className={styles.cardWaiting}>Waiting to start&hellip;</p>}
        </div>

        {!isQueued && thread.sources.length > 0 && (
          <SourcesSection sources={thread.sources} />
        )}

        {!isQueued && thread.summary && (
          <div className={styles.responseFooter}>
            <span className={styles.responseTime}>{time}</span>
            <button type="button" className={styles.copyBtn} onClick={handleCopy} aria-label="Copy response">
              <Clipboard width={13} height={13} />
              {copied ? "Copied!" : ""}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Typing Indicator ── */

function TypingIndicator() {
  return (
    <div className={styles.typingWrap}>
      <div className={styles.typingAvatar}>
        <AiSparkle width={12} height={12} />
      </div>
      <div className={styles.typingContent}>
        <div className={styles.typingDots}>
          <span className={styles.typingDot} />
          <span className={styles.typingDot} />
          <span className={styles.typingDot} />
        </div>
        <span className={styles.typingLabel}>Sentra is researching&hellip;</span>
      </div>
    </div>
  );
}

/* ── Left Sidebar: Chat History ── */

function ChatHistorySidebar() {
  const { conversations, activeConversationId, selectConversation, newChat } = useResearch();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <span className={styles.sidebarLabel}>Conversations</span>
        <button type="button" className={styles.newChatBtnSmall} onClick={newChat} aria-label="New chat">
          <Plus width={13} height={13} />
        </button>
      </div>
      <div className={styles.sidebarList}>
        {conversations.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`${styles.sidebarItem} ${c.id === activeConversationId ? styles.sidebarItemActive : ""}`}
            onClick={() => selectConversation(c.id)}
          >
            <div className={styles.sidebarItemBody}>
              <span className={styles.sidebarItemTitle}>{c.title}</span>
              <span className={styles.sidebarItemMeta}>{c.threads.length} {c.threads.length === 1 ? "message" : "messages"} · {c.date}</span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}

/* ── Chat Input ── */

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
            placeholder="Ask anything..."
            value={query}
            onChange={onChange}
            onKeyDown={onKeyDown}
            rows={1}
            disabled={disabled}
          />
          <div className={styles.inputToolbar}>
            <span className={styles.inputHint}>
              <kbd>↵</kbd> to send
            </span>
            <Button
              variant="primary"
              size="icon"
              className={styles.sendBtn}
              aria-label="Send"
              onClick={onSubmit}
              disabled={disabled || !query.trim()}
            >
              <ArrowUp width={14} height={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page Component ── */

export function DeepResearchPage() {
  const { threads, isResearching, query, setQuery, submitQuery, newChat } = useResearch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isEmpty = threads.length === 0 && !isResearching;

  useEffect(() => {
    if (query && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <span className={styles.topBarTitle}>Deep Research</span>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setSidebarCollapsed((v) => !v)}
            aria-label={sidebarCollapsed ? "Show conversations" : "Hide conversations"}
          >
            <ChatBubble width={14} height={14} />
          </Button>
        </div>
        <div className={styles.topBarRight}>
          <Button variant="primary" size="sm" onClick={newChat}>
            <Plus width={14} height={14} /> New Chat
          </Button>
        </div>
      </div>

      <div className={styles.bodyRow}>
        {!sidebarCollapsed && <ChatHistorySidebar />}

        {/* ── Main chat area ── */}
        <div className={styles.chatMain}>
          <div className={`${styles.bodyMain} ${isEmpty ? styles.bodyMainEmpty : ""}`} ref={bodyRef}>

            {isEmpty && (
              <div className={styles.welcomeWrap}>
                <div className={styles.welcomeContent}>
                  <h2 className={styles.emptyTitle}>Chat with Memory</h2>
                  <p className={styles.emptyDesc}>
                    Search across your meetings, decisions, and the web.
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
                      <ResearchCard thread={thread} />
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
      </div>
    </div>
  );
}
