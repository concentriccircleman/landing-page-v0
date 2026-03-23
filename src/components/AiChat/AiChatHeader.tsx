import styles from "./AiChat.module.css";

function ShieldCheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 1.43L2.88 3.57V6.86C2.88 10.14 4.82 12.29 7.5 13.57C10.18 12.29 12.12 10.14 12.12 6.86V3.57L7.5 1.43Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 7.5L6.8 8.8L9.5 6.1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 5V2.5H5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 2.5H12.5V5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 10V12.5H10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 12.5H2.5V10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.75 3.75L11.25 11.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M11.25 3.75L3.75 11.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export interface AiChatHeaderProps {
  title?: string;
  onExpand?: () => void;
  onClose?: () => void;
}

export function AiChatHeader({
  title = "Ask anything",
  onExpand,
  onClose,
}: AiChatHeaderProps) {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <p className={styles.headerTitleText}>{title}</p>
          <span className={styles.headerIcon}><ShieldCheckIcon /></span>
        </div>
        <button type="button" className={styles.iconBtn} onClick={onExpand}>
          <ExpandIcon />
        </button>
        <button type="button" className={styles.iconBtn} onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      <div className={styles.headerDivider} />
    </>
  );
}
