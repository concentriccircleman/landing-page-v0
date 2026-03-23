import type { ReactNode } from "react";
import styles from "./Avatar.module.css";

export type AvatarSize = "18" | "20" | "24" | "28" | "32" | "36" | "40";
export type AvatarRadius = "full" | "rounded";
export type AvatarContent = "letters" | "image" | "icon";
export type AvatarVariant = "light" | "dark";

export interface AvatarProps {
  content?: AvatarContent;
  radius?: AvatarRadius;
  size?: AvatarSize;
  variant?: AvatarVariant;
  /** Letters to display when content="letters" */
  initials?: string;
  /** Image URL when content="image" */
  src?: string;
  alt?: string;
  /** Icon ReactNode when content="icon" */
  icon?: ReactNode;
  className?: string;
}

function DefaultIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.75 11.375 5.25 3.5l3.5 4.375L11.375 5.25l1.75 3.5v2.625H.875v-2.625L1.75 11.375Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M.875 11.375h12.25"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

const sizeClassMap: Record<AvatarSize, string | undefined> = {
  "18": styles.size18,
  "20": styles.size20,
  "24": styles.size24,
  "28": styles.size28,
  "32": styles.size32,
  "36": styles.size36,
  "40": styles.size40,
};

const fontSizeMap: Record<AvatarSize, string | undefined> = {
  "18": styles.fontSize11,
  "20": styles.fontSize11,
  "24": styles.fontSize12,
  "28": styles.fontSize13,
  "32": styles.fontSize13,
  "36": styles.fontSize14,
  "40": styles.fontSize16,
};

const iconSizeMap: Record<AvatarSize, number> = {
  "18": 8,
  "20": 10,
  "24": 11,
  "28": 12,
  "32": 14,
  "36": 16,
  "40": 18,
};

function cls(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function Avatar({
  content = "letters",
  radius = "full",
  size = "32",
  variant = "light",
  initials = "L",
  src,
  alt = "",
  icon,
  className,
}: AvatarProps) {
  const isDark = variant === "dark";
  const isFull = radius === "full";

  const rootClass = cls(
    styles.avatar,
    isDark ? styles.dark : styles.light,
    isFull ? styles.radiusFull : styles.radiusRounded,
    sizeClassMap[size],
    className,
  );

  const innerClass = cls(
    styles.inner,
    isFull ? styles.innerFull : styles.innerRounded,
    content !== "image" ? (isDark ? styles.bgDark : styles.bgLight) : undefined,
  );

  const iconSize = iconSizeMap[size];

  return (
    <div className={rootClass}>
      <div className={innerClass}>
        {content === "letters" && (
          <span
            className={cls(
              styles.letters,
              isDark ? styles.lettersDark : styles.lettersLight,
              fontSizeMap[size],
            )}
          >
            {initials}
          </span>
        )}

        {content === "image" && src && (
          <div
            className={cls(
              styles.image,
              isFull ? styles.imageFull : styles.imageRounded,
            )}
          >
            <img src={src} alt={alt} />
          </div>
        )}

        {content === "icon" && (
          <div
            className={cls(
              styles.icon,
              isDark ? styles.iconDark : styles.iconLight,
            )}
            style={{ width: iconSize, height: iconSize }}
          >
            {icon ?? <DefaultIcon />}
          </div>
        )}
      </div>
    </div>
  );
}
