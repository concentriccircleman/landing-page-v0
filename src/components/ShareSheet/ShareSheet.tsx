import { Avatar } from "../Avatar";
import styles from "./ShareSheet.module.css";

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4L11 11M11 4L4 11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.5 9.5L9.5 6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M9 11L7.5 12.5C6.39543 13.6046 4.60457 13.6046 3.5 12.5C2.39543 11.3954 2.39543 9.60457 3.5 8.5L5 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M7 5L8.5 3.5C9.60457 2.39543 11.3954 2.39543 12.5 3.5C13.6046 4.60457 13.6046 6.39543 12.5 7.5L11 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export type Permission = "owner" | "edit" | "view";

export interface SharePerson {
  name: string;
  email?: string;
  avatarSrc?: string;
  avatarInitials?: string;
  permission: Permission;
}

export interface ShareSheetProps {
  people?: SharePerson[];
  link?: string;
  onClose?: () => void;
  onCopyLink?: () => void;
  onPermissionChange?: (person: SharePerson) => void;
  className?: string;
}

const permissionLabel: Record<Permission, string> = {
  owner: "Owner",
  edit: "Can edit",
  view: "Can view",
};

export function ShareSheet({
  people = [],
  link,
  onClose,
  onCopyLink,
  onPermissionChange,
  className,
}: ShareSheetProps) {
  return (
    <div className={`${styles.sheet}${className ? ` ${className}` : ""}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Share</h3>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          <CloseIcon />
        </button>
      </div>

      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}><SearchIcon /></span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Add people..."
        />
      </div>

      {people.length > 0 && (
        <>
          <p className={styles.sectionLabel}>People with access</p>
          <div className={styles.people}>
            {people.map((p) => {
              const initials =
                p.avatarInitials ??
                p.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2);

              return (
                <div key={p.email ?? p.name} className={styles.person}>
                  <div className={styles.personAvatar}>
                    <Avatar
                      size="24"
                      content={p.avatarSrc ? "image" : "letters"}
                      src={p.avatarSrc}
                      initials={initials}
                      radius="full"
                    />
                  </div>
                  <div className={styles.personText}>
                    <span className={styles.personName}>{p.name}</span>
                    {p.email && (
                      <span className={styles.personEmail}>{p.email}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className={styles.permissionBtn}
                    onClick={() => onPermissionChange?.(p)}
                  >
                    {permissionLabel[p.permission]}
                    {p.permission !== "owner" && (
                      <span className={styles.permissionChevron}>
                        <ChevronDownIcon />
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {link && (
        <div className={styles.footer}>
          <span className={styles.linkIcon}><LinkIcon /></span>
          <span className={styles.linkText}>{link}</span>
          <button type="button" className={styles.copyBtn} onClick={onCopyLink}>
            Copy
          </button>
        </div>
      )}
    </div>
  );
}
