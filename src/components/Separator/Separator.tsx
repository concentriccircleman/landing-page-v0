import styles from "./Separator.module.css";

interface SeparatorProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Separator({ className, style }: SeparatorProps) {
  return (
    <hr
      className={`${styles.separator} ${className ?? ""}`}
      role="separator"
      style={style}
    />
  );
}
