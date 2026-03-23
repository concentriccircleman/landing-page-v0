import type { ReactNode } from "react";
import { Avatar } from "../Avatar";
import styles from "./AiChat.module.css";

function cls(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

function TagIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.25 1.5A.75.75 0 0 0 1.5 2.25v4.19a.75.75 0 0 0 .22.53l6.31 6.31a.75.75 0 0 0 1.06 0l4.19-4.19a.75.75 0 0 0 0-1.06L6.97 1.72a.75.75 0 0 0-.53-.22H2.25ZM4.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Z" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}

export interface AiChatSuggestionProps {
  label: string;
  active?: boolean;
  muted?: boolean;
  showAvatar?: boolean;
  avatarSrc?: string;
  showImage?: boolean;
  imageSrc?: string;
  showIcon?: boolean;
  icon?: ReactNode;
  subText?: string;
  badge?: string;
  shortcuts?: string[];
  onClick?: () => void;
}

export function AiChatSuggestion({
  label,
  active = false,
  muted = false,
  showAvatar = false,
  avatarSrc,
  showImage = false,
  imageSrc,
  showIcon = false,
  icon,
  subText,
  badge,
  shortcuts,
  onClick,
}: AiChatSuggestionProps) {
  return (
    <button
      type="button"
      className={cls(
        muted ? styles.suggestionMuted : styles.suggestion,
        active && styles.suggestionActive,
      )}
      onClick={onClick}
    >
      {showAvatar && (
        <span className={styles.suggestionAvatar}>
          <Avatar size="20" content={avatarSrc ? "image" : "letters"} radius="rounded" src={avatarSrc} initials="" />
        </span>
      )}
      {showImage && imageSrc && (
        <span className={styles.suggestionImage}>
          <img src={imageSrc} alt="" />
        </span>
      )}
      {showIcon && (
        <span className={styles.suggestionIconWrap}>
          {icon ?? <TagIcon />}
        </span>
      )}
      <span className={styles.suggestionLabel}>{label}</span>
      {subText && <span className={styles.suggestionSubText}>{subText}</span>}
      {badge && <span className={styles.suggestionBadge}>{badge}</span>}
      {shortcuts && shortcuts.length > 0 && (
        <span className={styles.suggestionShortcuts}>
          {shortcuts.map((k) => (
            <span key={k} className={styles.kbd}>{k}</span>
          ))}
        </span>
      )}
    </button>
  );
}

export interface AiChatSuggestionTitleProps {
  children: string;
}

export function AiChatSuggestionTitle({ children }: AiChatSuggestionTitleProps) {
  return <p className={styles.suggestionTitle}>{children}</p>;
}
