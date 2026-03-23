import styles from "./Progress.module.css";

interface ProgressProps {
  value: number;
  variant?: "default" | "brand";
  className?: string;
}

export function Progress({ value, variant = "default", className }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`${styles.track} ${className ?? ""}`} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={`${styles.indicator} ${variant === "brand" ? styles.brand : styles.default}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
