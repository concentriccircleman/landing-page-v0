import type { ReactNode } from "react";
import {
  InfoIcon,
  SuccessIcon,
  ErrorIcon,
  WarningIcon,
  LoadingIcon,
  KeyboardIcon,
  CloseIcon,
} from "./icons";
import styles from "./Toast.module.css";

export type ToastType =
  | "info"
  | "success"
  | "error"
  | "warning"
  | "loading"
  | "keyboard";

export interface ToastAction {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export interface KeyboardSegment {
  type: "text" | "kbd";
  value: string;
}

export interface ToastProps {
  type?: ToastType;
  title?: string;
  description?: string;
  actions?: ToastAction[];
  /** Only used when type="keyboard" — inline text + key badge segments */
  segments?: KeyboardSegment[];
  onClose?: () => void;
  className?: string;
}

const iconMap: Record<Exclude<ToastType, "keyboard">, () => ReactNode> = {
  info: InfoIcon,
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  loading: LoadingIcon,
};

function Icon({ type }: { type: ToastType }) {
  if (type === "keyboard") return <KeyboardIcon />;
  const Comp = iconMap[type];
  return <Comp />;
}

export function Toast({
  type = "info",
  title,
  description,
  actions,
  segments,
  onClose,
  className,
}: ToastProps) {
  const isKeyboard = type === "keyboard";
  const rootClass = [
    isKeyboard ? styles.toastKeyboard : styles.toast,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      {/* Icon */}
      <div className={styles.iconContainer}>
        {type === "loading" ? (
          <div className={styles.spinner}>
            <LoadingIcon />
          </div>
        ) : (
          <Icon type={type} />
        )}
      </div>

      {/* Content */}
      {isKeyboard ? (
        <div className={styles.contentKeyboard}>
          {segments?.map((seg, i) =>
            seg.type === "text" ? (
              <span key={i} className={styles.kbdText}>
                {seg.value}
              </span>
            ) : (
              <span key={i} className={styles.kbd}>
                {seg.value}
              </span>
            ),
          )}
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.textBlock}>
            {title && <p className={styles.title}>{title}</p>}
            {description && <p className={styles.description}>{description}</p>}
          </div>

          {actions && actions.length > 0 && (
            <div className={styles.actions}>
              {actions.map((action) => (
                <button
                  key={action.label}
                  className={
                    action.variant === "secondary"
                      ? styles.actionSecondary
                      : styles.actionPrimary
                  }
                  onClick={action.onClick}
                  type="button"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Close button */}
      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close"
      >
        <CloseIcon />
      </button>
    </div>
  );
}
