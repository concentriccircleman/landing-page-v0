import { useState } from "react";
import { InfoCircle } from "../../icons/outline";
import { XMark } from "../../icons/outline";
import styles from "./FeatureBanner.module.css";

interface FeatureBannerProps {
  storageKey: string;
  children: React.ReactNode;
}

export function FeatureBanner({ storageKey, children }: FeatureBannerProps) {
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(`banner-${storageKey}`) === "1"; }
    catch { return false; }
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try { localStorage.setItem(`banner-${storageKey}`, "1"); } catch {}
  };

  return (
    <div className={styles.banner}>
      <InfoCircle className={styles.icon} />
      <p className={styles.text}>{children}</p>
      <button
        type="button"
        className={styles.close}
        onClick={handleDismiss}
        aria-label="Dismiss"
      >
        <XMark />
      </button>
    </div>
  );
}
