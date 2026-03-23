import { useState } from "react";
import styles from "./AiChat.module.css";

function AiSparkleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.5" cy="7.5" r="7.11" fill="url(#sparkle-body)" fillOpacity="0.85" />
      <ellipse cx="7.5" cy="1.5" rx="3" ry="3" fill="url(#sparkle-top)" opacity="0.7" />
      <ellipse cx="13" cy="7.5" rx="3" ry="3" fill="url(#sparkle-right)" opacity="0.7" />
      <ellipse cx="2" cy="7.5" rx="3" ry="3" fill="url(#sparkle-left)" opacity="0.7" />
      <ellipse cx="7.5" cy="13.5" rx="3" ry="3" fill="url(#sparkle-bottom)" opacity="0.7" />
      <ellipse cx="7.5" cy="7.5" rx="3" ry="3" fill="url(#sparkle-center)" opacity="0.7" />
      <defs>
        <radialGradient id="sparkle-body" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#f9a8d4" />
          <stop offset="0.5" stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#818cf8" />
        </radialGradient>
        <radialGradient id="sparkle-top" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#f9a8d4" />
        </radialGradient>
        <radialGradient id="sparkle-right" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#818cf8" />
        </radialGradient>
        <radialGradient id="sparkle-left" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#f9a8d4" />
          <stop offset="1" stopColor="#c084fc" />
        </radialGradient>
        <radialGradient id="sparkle-bottom" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#a78bfa" />
        </radialGradient>
        <radialGradient id="sparkle-center" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#f9a8d4" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.5 5.5H6C5.72 5.5 5.5 5.72 5.5 6V10.5C5.5 10.78 5.72 11 6 11H10.5C10.78 11 11 10.78 11 10.5V6C11 5.72 10.78 5.5 10.5 5.5Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 5.5V4.5C9.5 4.22 9.28 4 9 4H4.5C4.22 4 4 4.22 4 4.5V9C4 9.28 4.22 9.5 4.5 9.5H5.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThumbDownIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 2h5.25a1.5 1.5 0 0 1 1.47 1.2L12 7.5a1 1 0 0 1-1 1.17H8.25l.5 2.5a.75.75 0 0 1-.71 1H7.5L4.5 8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 2.5H4.5V8.5H2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface AiChatResponseProps {
  text: string;
  badges?: string[];
  showActions?: boolean;
  onCopy?: () => void;
  onThumbDown?: () => void;
}

export function AiChatResponse({
  text,
  badges = [],
  showActions: forceShowActions,
  onCopy,
  onThumbDown,
}: AiChatResponseProps) {
  const [hovered, setHovered] = useState(false);
  const showActions = forceShowActions ?? hovered;

  return (
    <div
      className={styles.response}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className={styles.responseIcon}><AiSparkleIcon /></span>
      <div className={showActions ? styles.responseContentWithActions : styles.responseContent}>
        <p className={styles.responseText}>{text}</p>
        {showActions && (
          <div className={styles.responseActions}>
            <div className={styles.responseBadges}>
              {badges.map((b, i) => (
                <span key={`${b}-${i}`} className={styles.responseBadge}>{b}</span>
              ))}
            </div>
            <div className={styles.responseToolbar}>
              <button type="button" className={styles.toolbarBtn} onClick={onCopy} aria-label="Copy">
                <CopyIcon />
              </button>
              <button type="button" className={styles.toolbarBtn} onClick={onThumbDown} aria-label="Thumbs down">
                <ThumbDownIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
