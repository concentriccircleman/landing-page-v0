import { useState, useCallback, useId } from "react";
import styles from "./CheckboxLabel.module.css";

function CheckIcon() {
  return (
    <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.5 7.5 6.25 10.25 11.5 4.75"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 13.5a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm.5-8.75a.75.75 0 1 1-1 0 .75.75 0 0 1 1 0ZM6.75 7a.5.5 0 0 0 0 1h.25v1.5H6.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H8.25V7.5a.5.5 0 0 0-.5-.5h-1Z"
        fill="currentColor"
      />
    </svg>
  );
}

export interface CheckboxLabelProps {
  label?: string;
  description?: string;
  /** Show "(optional)" text after the label */
  optional?: boolean;
  /** Show the info tooltip icon */
  showTooltip?: boolean;
  /** Card wrapper variant (360px with border) vs plain inline */
  showCard?: boolean;
  /** Controlled checked state */
  checked?: boolean;
  /** Uncontrolled default checked state */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  name?: string;
}

export function CheckboxLabel({
  label = "Label",
  description,
  optional = true,
  showTooltip = true,
  showCard = false,
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  className,
  name,
}: CheckboxLabelProps) {
  const id = useId();
  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback(() => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onCheckedChange?.(next);
  }, [disabled, isChecked, isControlled, onCheckedChange]);

  const rootClasses = [
    styles.root,
    showCard ? styles.card : undefined,
    isChecked && showCard ? styles.checked : undefined,
    isFocused && showCard ? styles.focused : undefined,
    disabled ? styles.disabled : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const boxInnerClasses = [
    styles.boxInner,
    isChecked ? styles.boxChecked : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={rootClasses}>
      <input
        type="checkbox"
        className={styles.hiddenInput}
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        name={name}
        id={id}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {/* Checkbox box */}
      <div className={styles.box}>
        <div className={boxInnerClasses} />
        {isChecked && (
          <div className={styles.checkmark}>
            <CheckIcon />
          </div>
        )}
      </div>

      {/* Text */}
      <div className={showCard ? styles.cardText : styles.text}>
        <div className={styles.labelRow}>
          <span className={styles.label}>{label}</span>
          {optional && <span className={styles.optional}>(optional)</span>}
          {showTooltip && (
            <span className={styles.tooltipIcon}>
              <InfoIcon />
            </span>
          )}
        </div>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
      </div>
    </label>
  );
}
