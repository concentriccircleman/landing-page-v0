import styles from "./Switch.module.css";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Switch({ checked, onCheckedChange, disabled = false, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={`${styles.switch} ${checked ? styles.checked : styles.unchecked} ${disabled ? styles.disabled : ""} ${className ?? ""}`}
      onClick={() => !disabled && onCheckedChange(!checked)}
    >
      <span className={`${styles.thumb} ${checked ? styles.thumbChecked : styles.thumbUnchecked}`} />
      <input type="checkbox" className={styles.hiddenInput} checked={checked} readOnly tabIndex={-1} />
    </button>
  );
}
