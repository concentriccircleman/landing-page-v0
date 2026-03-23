import styles from "./Checkbox.module.css";

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({ checked, onCheckedChange, disabled = false, className }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      className={`${styles.checkbox} ${checked ? styles.checked : ""} ${disabled ? styles.disabled : ""} ${className ?? ""}`}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onCheckedChange(!checked);
      }}
    >
      {checked && (
        <span className={styles.checkmark}>
          <svg width={11} height={11} viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 5.5L4.5 7.5L8.5 3.5" />
          </svg>
        </span>
      )}
      <input type="checkbox" className={styles.hiddenInput} checked={checked} readOnly tabIndex={-1} />
    </button>
  );
}
