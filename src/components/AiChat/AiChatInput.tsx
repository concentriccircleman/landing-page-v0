import { useRef, useCallback, type KeyboardEvent, type ChangeEvent } from "react";
import styles from "./AiChat.module.css";

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.5" cy="7.5" r="7" fill="currentColor" />
      <path d="M7.5 10.5V5M7.5 5L5 7.5M7.5 5L10 7.5" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface AiChatInputProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSend?: () => void;
}

export function AiChatInput({
  value = "",
  placeholder = "Ask me a question about Sentra...",
  onChange,
  onSend,
}: AiChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
      const el = e.target;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend?.();
      }
    },
    [onSend],
  );

  return (
    <div className={styles.inputWrap}>
      <div className={styles.inputDivider} />
      <div className={styles.inputInner}>
        <textarea
          ref={textareaRef}
          className={styles.inputField}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <div className={styles.inputSend}>
          <button type="button" className={styles.sendBtn} onClick={onSend}>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
