import styles from "./AiChat.module.css";

export interface AiChatBubbleProps {
  children: string;
}

export function AiChatBubble({ children }: AiChatBubbleProps) {
  return (
    <div className={styles.bubbleWrap}>
      <div className={styles.bubble}>{children}</div>
    </div>
  );
}
