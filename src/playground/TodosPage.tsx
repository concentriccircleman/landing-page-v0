import { useState, useMemo } from "react";
import styles from "./TodosPage.module.css";

interface CommitmentItem {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  source?: { label: string; date: string };
}

const initialItems: CommitmentItem[] = [
  {
    id: "c1",
    title: "Send Maja Jagielska the link to the Avengers Infinity War scene that describes how you want the product to fit into someone's life.",
    completed: false,
    date: "Mar 13",
    source: { label: "Sentra x tonik: alignment on a new brand direction", date: "Mar 13" },
  },
  {
    id: "c2",
    title: "Send Maja Jagielska additional documentation with more information gathered along the lines of the brand discussion.",
    completed: false,
    date: "Mar 13",
    source: { label: "Sentra x tonik: alignment on a new brand direction", date: "Mar 13" },
  },
  {
    id: "c3",
    title: "Review the updated brand identity concepts and provide feedback on the direction before the next sync.",
    completed: false,
    date: "Mar 12",
    source: { label: "Weekly design review", date: "Mar 12" },
  },
  {
    id: "c4",
    title: "Schedule a follow-up meeting with the engineering team to discuss the new component API changes.",
    completed: true,
    date: "Mar 11",
    source: { label: "Sprint planning", date: "Mar 11" },
  },
  {
    id: "c5",
    title: "Draft the product requirements document for the Q2 launch features.",
    completed: true,
    date: "Mar 10",
  },
  {
    id: "c6",
    title: "Share the competitive analysis deck with the leadership team ahead of the board meeting.",
    completed: false,
    date: "Mar 10",
    source: { label: "Product strategy sync", date: "Mar 10" },
  },
];

type FilterTab = "all" | "open" | "completed";

export function TodosPage({ onOpenChat }: { onOpenChat?: () => void } = {}) {
  const [items, setItems] = useState(initialItems);
  const [tab, setTab] = useState<FilterTab>("all");

  const toggleItem = (id: string) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const filtered = useMemo(() => {
    if (tab === "open") return items.filter((i) => !i.completed);
    if (tab === "completed") return items.filter((i) => i.completed);
    return items;
  }, [items, tab]);

  const tabs: { value: FilterTab; label: string }[] = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Commitments</h1>
        <div className={styles.headerActions}>
          <button type="button" className={styles.addBtn}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Add
          </button>
          <div className={styles.filterTabs}>
            {tabs.map((t) => (
              <button
                key={t.value}
                type="button"
                className={`${styles.filterTab} ${tab === t.value ? styles.filterTabActive : ""}`}
                onClick={() => setTab(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button type="button" className={styles.settingsBtn} aria-label="Settings">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6.5 2.5h3l.4 1.6.5.2 1.5-.7 2.1 2.1-.7 1.5.2.5 1.6.4v3l-1.6.4-.2.5.7 1.5-2.1 2.1-1.5-.7-.5.2-.4 1.6h-3l-.4-1.6-.5-.2-1.5.7-2.1-2.1.7-1.5-.2-.5L1 9.5v-3l1.6-.4.2-.5-.7-1.5 2.1-2.1 1.5.7.5-.2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.list}>
        {filtered.map((item) => (
          <div key={item.id} className={styles.row}>
            <button
              type="button"
              className={`${styles.checkbox} ${item.completed ? styles.checkboxChecked : ""}`}
              onClick={() => toggleItem(item.id)}
              aria-label={item.completed ? "Mark incomplete" : "Mark complete"}
            >
              {item.completed && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <div className={styles.rowContent}>
              <span className={`${styles.rowTitle} ${item.completed ? styles.rowTitleDone : ""}`}>
                {item.title}
              </span>
              {item.source && (
                <a href="#" className={styles.rowSource} onClick={(e) => e.preventDefault()}>
                  {item.source.label} · {item.source.date} ↗
                </a>
              )}
            </div>
            <span className={styles.rowDate}>{item.date}</span>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className={styles.empty}>No commitments to show.</div>
        )}
      </div>
    </div>
  );
}
