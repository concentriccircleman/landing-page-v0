import styles from "./AiChat.module.css";

export interface AiChatFooterProps {
  disclaimer?: string;
}

export function AiChatFooter({
  disclaimer = "Chat is cleared on exit",
}: AiChatFooterProps) {
  return (
    <div className={styles.footer}>
      <div className={styles.footerDivider} />
      <div className={styles.footerContent}>
        <span className={styles.footerNote}>{disclaimer}</span>
        <span className={styles.footerSep} />
        <div className={styles.footerShortcut}>
          <span className={styles.footerShortcutLabel}>Line break</span>
          <div className={styles.kbdGroup}>
            <span className={styles.kbd}>⇧</span>
            <span className={styles.kbd}>↵</span>
          </div>
        </div>
      </div>
    </div>
  );
}
