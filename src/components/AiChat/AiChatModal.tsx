import { useState, useCallback, type ReactNode } from "react";
import { AiChatHeader } from "./AiChatHeader";
import { AiChatSuggestion, AiChatSuggestionTitle } from "./AiChatSuggestion";
import { AiChatBubble } from "./AiChatBubble";
import { AiChatResponse } from "./AiChatResponse";
import { AiChatLoading } from "./AiChatLoading";
import { AiChatInput } from "./AiChatInput";
import { AiChatFooter } from "./AiChatFooter";
import styles from "./AiChat.module.css";

export type AiChatModalState = "default" | "input" | "processing" | "filled";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  badges?: string[];
}

export interface AiChatModalProps {
  state?: AiChatModalState;
  title?: string;
  suggestions?: string[];
  messages?: ChatMessage[];
  inputValue?: string;
  scrollbarHeight?: number;
  scrollbarTop?: number;
  onClose?: () => void;
  onExpand?: () => void;
  onSend?: (text: string) => void;
  children?: ReactNode;
  className?: string;
}

const defaultSuggestions = [
  "What is Sentra?",
  "How can I create an ecommerce store with Sentra?",
  "How can I build a marketplace with Sentra?",
  "How can I build subscription-based purchases with Sentra?",
  "How can I build digital products with Sentra?",
  "What can I build with Sentra?",
  "What is Sentra Admin?",
];

export function AiChatModal({
  state = "default",
  title,
  suggestions = defaultSuggestions,
  messages = [],
  inputValue: controlledValue,
  scrollbarHeight = 96,
  scrollbarTop = 12,
  onClose,
  onExpand,
  onSend,
  className,
}: AiChatModalProps) {
  const [internalValue, setInternalValue] = useState("");
  const inputValue = controlledValue ?? internalValue;

  const handleChange = useCallback((val: string) => {
    setInternalValue(val);
  }, []);

  const handleSend = useCallback(() => {
    if (inputValue.trim()) {
      onSend?.(inputValue.trim());
      setInternalValue("");
    }
  }, [inputValue, onSend]);

  const showSuggestions = state === "default" || state === "input";
  const showMessages = state === "processing" || state === "filled";

  return (
    <div className={`${styles.modal}${className ? ` ${className}` : ""}`}>
      {/* Search area: header + divider */}
      <div className={styles.modalSearch}>
        <AiChatHeader title={title} onClose={onClose} onExpand={onExpand} />
      </div>

      {/* Body: suggestions or messages */}
      <div className={styles.modalBody}>
        {showSuggestions && (
          <div className={styles.suggestionList}>
            {/* Custom scrollbar indicator */}
            <div
              className={styles.scrollbar}
              style={{ height: scrollbarHeight, top: scrollbarTop }}
            />
            <AiChatSuggestionTitle>FAQ</AiChatSuggestionTitle>
            {suggestions.map((s, i) => (
              <AiChatSuggestion
                key={s}
                label={s}
                active={i === 0 && state === "input"}
                muted={state === "input" && i >= suggestions.length - 2}
                onClick={() => {
                  setInternalValue(s);
                  onSend?.(s);
                }}
              />
            ))}
          </div>
        )}

        {showMessages && (
          <div className={styles.messages}>
            {messages.map((m, i) =>
              m.role === "user" ? (
                <AiChatBubble key={i}>{m.content}</AiChatBubble>
              ) : (
                <AiChatResponse
                  key={i}
                  text={m.content}
                  badges={m.badges}
                />
              ),
            )}
            {state === "processing" && <AiChatLoading />}
          </div>
        )}
      </div>

      {/* Bottom: gradient + input + footer */}
      <div className={styles.modalBottom}>
        {showSuggestions && <div className={styles.fadeGradient} />}
        <AiChatInput
          value={inputValue}
          onChange={handleChange}
          onSend={handleSend}
        />
        <AiChatFooter />
      </div>
    </div>
  );
}
