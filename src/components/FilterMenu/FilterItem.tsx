import { useState, useCallback, useRef } from "react";
import styles from "./FilterMenu.module.css";

function cls(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ── Icons ── */

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.5 4.5L6 10.5L3.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DotIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.5" cy="7.5" r="2" fill="currentColor" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 1.5V3.5M10.5 1.5V3.5M1.5 5.5H13.5M2.5 2.5H12.5C13.0523 2.5 13.5 2.94772 13.5 3.5V12.5C13.5 13.0523 13.0523 13.5 12.5 13.5H2.5C1.94772 13.5 1.5 13.0523 1.5 12.5V3.5C1.5 2.94772 1.94772 2.5 2.5 2.5Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 4.5L10.5 10.5M10.5 4.5L4.5 10.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function DragHandleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5" cy="3.5" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="10" cy="3.5" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="5" cy="7.5" r="1" fill="currentColor" opacity="0.65" />
      <circle cx="10" cy="7.5" r="1" fill="currentColor" opacity="0.4" />
      <circle cx="5" cy="11.5" r="1" fill="currentColor" opacity="0.4" />
      <circle cx="10" cy="11.5" r="1" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   FilterItem — selectable check/radio row
   ════════════════════════════════════════════ */

export type FilterItemType = "check" | "radio";

export interface FilterItemProps {
  type?: FilterItemType;
  label: string;
  subText?: string;
  badge?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function FilterItem({
  type = "check",
  label,
  subText,
  badge,
  selected = false,
  disabled = false,
  onClick,
  className,
}: FilterItemProps) {
  return (
    <button
      type="button"
      className={cls(
        styles.item,
        disabled && styles.itemDisabled,
        !selected && styles.itemUnselected,
        className,
      )}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {selected && (
        <span className={styles.itemIcon}>
          {type === "check" ? <CheckIcon /> : <DotIcon />}
        </span>
      )}
      <span className={styles.itemLabel}>{label}</span>
      {subText && <span className={styles.itemSubText}>{subText}</span>}
      {badge && (
        <span className={styles.badge}>
          <span className={styles.badgeLabel}>{badge}</span>
        </span>
      )}
    </button>
  );
}

/* ════════════════════════════════════════════
   FilterTitle — section heading
   ════════════════════════════════════════════ */

export interface FilterTitleProps {
  children: string;
  className?: string;
}

export function FilterTitle({ children, className }: FilterTitleProps) {
  return (
    <div className={cls(styles.title, className)}>
      <span className={styles.titleText}>{children}</span>
    </div>
  );
}

/* ════════════════════════════════════════════
   FilterDivider — horizontal separator
   ════════════════════════════════════════════ */

export function FilterDivider({ className }: { className?: string }) {
  return (
    <div className={cls(styles.divider, className)}>
      <div className={styles.dividerLineTop} />
      <div className={styles.dividerLineBottom} />
    </div>
  );
}

/* ════════════════════════════════════════════
   FilterSearch — inline search input
   ════════════════════════════════════════════ */

export interface FilterSearchProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  className?: string;
}

export function FilterSearch({
  placeholder = "Search filters",
  value: controlledValue,
  defaultValue = "",
  onChange,
  onClear,
  className,
}: FilterSearchProps) {
  const isControlled = controlledValue !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const val = isControlled ? controlledValue : internal;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (!isControlled) setInternal(v);
      onChange?.(v);
    },
    [isControlled, onChange],
  );

  const handleClear = useCallback(() => {
    if (!isControlled) setInternal("");
    onChange?.("");
    onClear?.();
    inputRef.current?.focus();
  }, [isControlled, onChange, onClear]);

  const hasValue = val.length > 0;

  return (
    <div className={cls(styles.search, className)}>
      <input
        ref={inputRef}
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={val}
        onChange={handleChange}
      />
      {hasValue && (
        <div className={styles.searchControls}>
          <span className={styles.dragHandle}><DragHandleIcon /></span>
          <button type="button" className={styles.clearButton} onClick={handleClear}>
            <XIcon />
          </button>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   FilterSkeleton — loading placeholder
   ════════════════════════════════════════════ */

export function FilterSkeleton({ className }: { className?: string }) {
  return (
    <div className={cls(styles.skeleton, className)}>
      <div className={styles.skeletonBar} />
      <div className={styles.skeletonBar} />
      <div className={styles.skeletonRow}>
        <div className={styles.skeletonHalf} />
        <div className={styles.skeletonEmpty} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   FilterTextInput — inline text entry
   ════════════════════════════════════════════ */

export interface FilterTextInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function FilterTextInput({
  label,
  placeholder = "Placeholder",
  value,
  onChange,
  className,
}: FilterTextInputProps) {
  const [internal, setInternal] = useState("");
  const val = value ?? internal;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (value === undefined) setInternal(v);
      onChange?.(v);
    },
    [value, onChange],
  );

  return (
    <>
      {label && <FilterTitle>{label}</FilterTitle>}
      <div className={cls(styles.inputWrapper, className)}>
        <input
          type="text"
          className={styles.textInput}
          placeholder={placeholder}
          value={val}
          onChange={handleChange}
        />
      </div>
    </>
  );
}

/* ════════════════════════════════════════════
   FilterDateInput — calendar button + date field
   ════════════════════════════════════════════ */

export interface FilterDateInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onCalendarClick?: () => void;
  className?: string;
}

export function FilterDateInput({
  label,
  placeholder = "DD/MM/YYYY",
  value,
  onChange,
  onCalendarClick,
  className,
}: FilterDateInputProps) {
  const [internal, setInternal] = useState("");
  const val = value ?? internal;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (value === undefined) setInternal(v);
      onChange?.(v);
    },
    [value, onChange],
  );

  return (
    <>
      {label && <FilterTitle>{label}</FilterTitle>}
      <div className={cls(styles.inputWrapper, className)}>
        <div className={styles.dateInput}>
          <button type="button" className={styles.dateInputButton} onClick={onCalendarClick}>
            <CalendarIcon />
          </button>
          <div className={styles.dateInputDivider} />
          <input
            type="text"
            className={styles.dateInputField}
            placeholder={placeholder}
            value={val}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════
   FilterEmptyState — no results message
   ════════════════════════════════════════════ */

export interface FilterEmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function FilterEmptyState({
  title = "No results found.",
  description = "Your search did not match any results.",
  className,
}: FilterEmptyStateProps) {
  return (
    <div className={cls(styles.emptyState, className)}>
      <p className={styles.emptyTitle}>{title}</p>
      <p className={styles.emptyDescription}>{description}</p>
    </div>
  );
}
