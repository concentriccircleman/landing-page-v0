import { useState, useMemo } from "react";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { Checkbox } from "../../components/Checkbox";
import { Progress } from "../../components/Progress";
import { TopBar } from "../../components/TopBar";
import { ToggleButtonGroup } from "../../components/ToggleButtonGroup";
import {
  Plus as PlusIcon,
  ChevronRight,
  XMark,
  Calendar as CalendarIcon,
  Flag as FlagIcon,
  Trash,
  AiSparkle,
} from "../../icons/outline";
import { FeatureBanner } from "../FeatureBanner";
import styles from "../TodosPage.module.css";

interface TodoItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  dueDate: string;
  source?: string;
  assignee: { name: string; initials: string };
  tags: string[];
  createdDate: string;
}

const initialTodos: TodoItem[] = [
  {
    id: "t1", title: "Review component migration PRs", description: "Go through the 6 open PRs from the design system migration. Check token usage, visual regressions, and accessibility compliance before merging.", completed: false, priority: "high", dueDate: "Feb 21", source: "Q1 Planning",
    assignee: { name: "Sarah Chen", initials: "SC" }, tags: ["Engineering", "Migration"], createdDate: "Feb 14",
  },
  {
    id: "t2", title: "Update design tokens documentation", description: "Add the new semantic color tokens and spacing scale to the design system docs site. Include migration examples.", completed: false, priority: "medium", dueDate: "Feb 22", source: "Sprint Retro",
    assignee: { name: "Alex Kim", initials: "AK" }, tags: ["Documentation"], createdDate: "Feb 15",
  },
  {
    id: "t3", title: "Set up Figma Code Connect", description: "Configure Code Connect for Button, Badge, and Input components. Verify the prop mapping works correctly in Figma Dev Mode.", completed: true, priority: "high", dueDate: "Feb 20", source: "Design Review",
    assignee: { name: "Jordan Liu", initials: "JL" }, tags: ["Design", "Tooling"], createdDate: "Feb 12",
  },
  {
    id: "t4", title: "Write accessibility audit report", description: "Document WCAG AA compliance status for all migrated components. Note any contrast or keyboard-nav issues.", completed: false, priority: "low", dueDate: "Feb 25",
    assignee: { name: "Priya Patel", initials: "PP" }, tags: ["Accessibility"], createdDate: "Feb 16",
  },
  {
    id: "t5", title: "Ship dark mode to production", description: "Final QA pass on dark mode theme, then coordinate with DevOps for production deploy. Monitor for visual regressions post-launch.", completed: false, priority: "high", dueDate: "Feb 23", source: "Product Sync",
    assignee: { name: "Sarah Chen", initials: "SC" }, tags: ["Engineering", "Launch"], createdDate: "Feb 10",
  },
  {
    id: "t6", title: "Create onboarding flow wireframes", description: "Design the 4-step onboarding wizard. Include workspace setup, team invite, integration connect, and first-meeting flow.", completed: true, priority: "medium", dueDate: "Feb 19",
    assignee: { name: "Jordan Liu", initials: "JL" }, tags: ["Design"], createdDate: "Feb 11",
  },
  {
    id: "t7", title: "Fix calendar date picker edge case", description: "The date picker crashes when selecting Feb 29 on non-leap years. Add proper validation and fallback.", completed: false, priority: "medium", dueDate: "Feb 24",
    assignee: { name: "Alex Kim", initials: "AK" }, tags: ["Bug", "Engineering"], createdDate: "Feb 17",
  },
  {
    id: "t8", title: "Schedule customer feedback sessions", description: "Reach out to 5 beta users for 30-min feedback sessions on the new meeting notes UI. Prepare interview script.", completed: true, priority: "low", dueDate: "Feb 18",
    assignee: { name: "Priya Patel", initials: "PP" }, tags: ["Research"], createdDate: "Feb 8",
  },
  {
    id: "t9", title: "Deploy weekly reports feature", description: "Push the weekly reports feature to staging, run integration tests, then promote to production with a feature flag.", completed: false, priority: "high", dueDate: "Feb 22", source: "Product Sync",
    assignee: { name: "Sarah Chen", initials: "SC" }, tags: ["Engineering", "Launch"], createdDate: "Feb 13",
  },
  {
    id: "t10", title: "Review and merge Sidebar component", description: "Review the new SidebarNav component PR. Verify responsive behavior, keyboard navigation, and design token usage.", completed: false, priority: "medium", dueDate: "Feb 21",
    assignee: { name: "Alex Kim", initials: "AK" }, tags: ["Engineering", "Review"], createdDate: "Feb 15",
  },
];

const priorityBadgeVariant: Record<string, "destructive" | "warning" | "secondary"> = {
  high: "destructive",
  medium: "warning",
  low: "secondary",
};

export function TodosPage({ onOpenChat }: { onOpenChat?: () => void } = {}) {
  const [todos, setTodos] = useState(initialTodos);
  const [tab, setTab] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["active", "completed"]));

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filtered = useMemo(() => {
    if (tab === "active") return todos.filter((t) => !t.completed);
    if (tab === "completed") return todos.filter((t) => t.completed);
    return todos;
  }, [todos, tab]);

  const activeTodos = filtered.filter((t) => !t.completed);
  const completedTodos = filtered.filter((t) => t.completed);
  const completedCount = todos.filter((t) => t.completed).length;
  const highCount = todos.filter((t) => t.priority === "high" && !t.completed).length;
  const remaining = todos.length - completedCount;
  const progress = Math.round((completedCount / todos.length) * 100);

  const selectedTodo = selectedId ? todos.find((t) => t.id === selectedId) ?? null : null;

  const tabItems = [
    { value: "all", label: "All", count: todos.length },
    { value: "active", label: "Active", count: todos.filter((t) => !t.completed).length },
    { value: "completed", label: "Completed", count: completedCount },
  ];

  const renderRow = (todo: TodoItem) => (
    <div
      key={todo.id}
      className={`${styles.todoRow} ${selectedId === todo.id ? styles.todoRowSelected : ""}`}
      onClick={() => setSelectedId(selectedId === todo.id ? null : todo.id)}
    >
      <div className={styles.todoCheckbox}>
        <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} />
      </div>

      <div className={styles.todoBody}>
        <span className={`${styles.todoTitle} ${todo.completed ? styles.todoTitleDone : ""}`}>{todo.title}</span>
        <div className={styles.todoDescription}>{todo.description}</div>
        <div className={styles.todoFooter}>
          <span className={styles.assignee}>
            <span className={styles.assigneeAvatar}>{todo.assignee.initials}</span>
            <span className={styles.assigneeName}>{todo.assignee.name}</span>
          </span>
          {todo.source && (
            <span className={styles.todoMetaItem}>
              <FlagIcon width={10} height={10} /> {todo.source}
            </span>
          )}
          {todo.tags.length > 0 && (
            <span className={styles.todoTags}>
              {todo.tags.map((tag) => (
                <span key={tag} className={styles.todoTag}>{tag}</span>
              ))}
            </span>
          )}
        </div>
      </div>

      <div className={styles.todoRight}>
        <Badge variant={priorityBadgeVariant[todo.priority]} size="sm">{todo.priority}</Badge>
        <span className={styles.todoDueDate}>{todo.dueDate}</span>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <TopBar
        breadcrumbs={[{ label: "Todos" }]}
        actions={
          <>
            <ToggleButtonGroup
              items={tabItems}
              value={tab}
              onChange={(v) => setTab(v as string)}
              size="sm"
            />
            <Button variant="primary" size="sm"><PlusIcon width={13} height={13} /> Add Todo</Button>
            {onOpenChat && (
              <Button variant="secondary" size="sm" onClick={onOpenChat}>
                <AiSparkle width={14} height={14} />
                Open Chat
              </Button>
            )}
          </>
        }
      />

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Todos</h1>
        <p className={styles.pageDesc}>Action items and tasks from your meetings and workflows.</p>
      </div>

      <div style={{ padding: `0 var(--space-8) var(--space-2)` }}>
        <FeatureBanner storageKey="todos">
          Action items extracted from your meetings and workflows, tracked to completion.
        </FeatureBanner>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{progress}%</span>
          <span className={styles.statLabel}>complete</span>
          <div className={styles.statProgress}>
            <Progress value={progress} variant="brand" />
          </div>
        </div>
        <span className={styles.statSep} />
        <div className={styles.statCard}>
          <span className={styles.statValue}>{highCount}</span>
          <span className={styles.statLabel}>high priority</span>
        </div>
        <span className={styles.statSep} />
        <div className={styles.statCard}>
          <span className={styles.statValue}>{remaining}</span>
          <span className={styles.statLabel}>remaining</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.listPane}>
          {(tab === "all" || tab === "active") && activeTodos.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader} onClick={() => toggleSection("active")}>
                <span className={`${styles.sectionChevron} ${openSections.has("active") ? styles.sectionChevronOpen : ""}`}>
                  <ChevronRight width={12} height={12} />
                </span>
                <span className={styles.sectionLabel}>Active</span>
                <span className={styles.sectionCount}>{activeTodos.length}</span>
              </div>
              {openSections.has("active") && activeTodos.map(renderRow)}
            </div>
          )}

          {(tab === "all" || tab === "completed") && completedTodos.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader} onClick={() => toggleSection("completed")}>
                <span className={`${styles.sectionChevron} ${openSections.has("completed") ? styles.sectionChevronOpen : ""}`}>
                  <ChevronRight width={12} height={12} />
                </span>
                <span className={styles.sectionLabel}>Completed</span>
                <span className={styles.sectionCount}>{completedTodos.length}</span>
              </div>
              {openSections.has("completed") && completedTodos.map(renderRow)}
            </div>
          )}

          {filtered.length === 0 && (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>✓</span>
              <span className={styles.emptyText}>No todos to show</span>
            </div>
          )}
        </div>

        {selectedTodo && (
          <div className={styles.detailPanel}>
            <div className={styles.detailHeader}>
              <span className={styles.detailHeaderTitle}>Details</span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}>
                <XMark width={14} height={14} />
              </Button>
            </div>
            <div className={styles.detailBody}>
              <div className={styles.detailTitleArea}>
                <Checkbox
                  checked={selectedTodo.completed}
                  onCheckedChange={() => toggleTodo(selectedTodo.id)}
                />
                <span className={`${styles.detailTitle} ${selectedTodo.completed ? styles.detailTitleDone : ""}`}>
                  {selectedTodo.title}
                </span>
              </div>

              <p className={styles.detailDescription}>{selectedTodo.description}</p>

              <hr className={styles.detailSeparator} />

              <div className={styles.detailFieldGrid}>
                <span className={styles.detailFieldLabel}>Priority</span>
                <span className={styles.detailFieldValue}>
                  <span className={`${styles.priorityDot} ${selectedTodo.priority === "high" ? styles.priorityHigh : selectedTodo.priority === "medium" ? styles.priorityMedium : styles.priorityLow}`} />
                  <Badge variant={priorityBadgeVariant[selectedTodo.priority]} size="sm">{selectedTodo.priority}</Badge>
                </span>

                <span className={styles.detailFieldLabel}>Due Date</span>
                <span className={styles.detailFieldValue}>
                  <CalendarIcon width={12} height={12} /> {selectedTodo.dueDate}
                </span>

                <span className={styles.detailFieldLabel}>Assignee</span>
                <span className={styles.detailFieldValue}>
                  <span className={styles.assigneeAvatar}>{selectedTodo.assignee.initials}</span>
                  {selectedTodo.assignee.name}
                </span>

                <span className={styles.detailFieldLabel}>Status</span>
                <span className={styles.detailFieldValue}>
                  <Badge variant={selectedTodo.completed ? "success" : "outline"} size="sm">
                    {selectedTodo.completed ? "Completed" : "Active"}
                  </Badge>
                </span>

                {selectedTodo.source && (
                  <>
                    <span className={styles.detailFieldLabel}>Source</span>
                    <span className={styles.detailFieldValue}>
                      <FlagIcon width={12} height={12} /> {selectedTodo.source}
                    </span>
                  </>
                )}

                <span className={styles.detailFieldLabel}>Created</span>
                <span className={styles.detailFieldValue}>{selectedTodo.createdDate}</span>

                <span className={styles.detailFieldLabel}>Tags</span>
                <span className={styles.detailFieldValue}>
                  <span className={styles.todoTags}>
                    {selectedTodo.tags.map((tag) => (
                      <span key={tag} className={styles.todoTag}>{tag}</span>
                    ))}
                  </span>
                </span>
              </div>
            </div>

            <div className={styles.detailActions}>
              <Button variant="secondary" size="sm" onClick={() => toggleTodo(selectedTodo.id)}>
                {selectedTodo.completed ? "Mark Active" : "Mark Complete"}
              </Button>
              <Button variant="ghost" size="sm">
                <Trash width={13} height={13} /> Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
