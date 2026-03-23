import styles from "./AiChat.module.css";

function AiSparkleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.5" cy="7.5" r="7.11" fill="url(#sparkle-load-body)" fillOpacity="0.85" />
      <ellipse cx="7.5" cy="1.5" rx="3" ry="3" fill="url(#sparkle-load-top)" opacity="0.7" />
      <ellipse cx="13" cy="7.5" rx="3" ry="3" fill="url(#sparkle-load-right)" opacity="0.7" />
      <ellipse cx="2" cy="7.5" rx="3" ry="3" fill="url(#sparkle-load-left)" opacity="0.7" />
      <ellipse cx="7.5" cy="13.5" rx="3" ry="3" fill="url(#sparkle-load-bottom)" opacity="0.7" />
      <ellipse cx="7.5" cy="7.5" rx="3" ry="3" fill="url(#sparkle-load-center)" opacity="0.7" />
      <defs>
        <radialGradient id="sparkle-load-body" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#f9a8d4" />
          <stop offset="0.5" stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#818cf8" />
        </radialGradient>
        <radialGradient id="sparkle-load-top" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#f9a8d4" />
        </radialGradient>
        <radialGradient id="sparkle-load-right" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#818cf8" />
        </radialGradient>
        <radialGradient id="sparkle-load-left" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#f9a8d4" />
          <stop offset="1" stopColor="#c084fc" />
        </radialGradient>
        <radialGradient id="sparkle-load-bottom" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#a78bfa" />
        </radialGradient>
        <radialGradient id="sparkle-load-center" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#f9a8d4" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function AiChatLoading() {
  return (
    <div className={styles.loading}>
      <span className={styles.responseIcon}><AiSparkleIcon /></span>
      <span className={styles.loadingDots}>…</span>
    </div>
  );
}
