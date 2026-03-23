import { createContext, useContext, useMemo, type ReactNode } from "react";

interface DemoUser {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: string[];
  status: "completed" | "upcoming" | "in-progress";
}

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  dueDate: string;
}

interface Report {
  id: string;
  title: string;
  date: string;
  type: "weekly" | "monthly";
  status: "draft" | "published";
}

interface DemoData {
  meetings: Meeting[];
  todos: Todo[];
  reports: Report[];
  memoryItems: Array<{ id: string; title: string; summary: string; date: string }>;
  apps: Array<{ id: string; name: string; description: string; status: "active" | "inactive" }>;
  teamMembers: Array<{ id: string; name: string; email: string; role: string; avatar: string }>;
}

interface DemoContextValue {
  isDemo: boolean;
  mockUser: DemoUser;
  mockData: DemoData;
}

const mockUser: DemoUser = {
  name: "Shaurya",
  email: "shaurya@sentra.ai",
  avatar: "SH",
  role: "Admin",
};

const mockData: DemoData = {
  meetings: [
    { id: "m1", title: "Q1 Planning Review", date: "2026-02-20T10:00:00", duration: "45 min", participants: ["Shaurya", "Alice", "Bob"], status: "completed" },
    { id: "m2", title: "Product Sync", date: "2026-02-21T14:00:00", duration: "30 min", participants: ["Shaurya", "Carol"], status: "upcoming" },
    { id: "m3", title: "Design System Review", date: "2026-02-21T16:00:00", duration: "60 min", participants: ["Shaurya", "Dave", "Eve"], status: "upcoming" },
    { id: "m4", title: "Sprint Retro", date: "2026-02-19T11:00:00", duration: "30 min", participants: ["Shaurya", "Alice", "Bob", "Carol"], status: "completed" },
    { id: "m5", title: "Customer Feedback Session", date: "2026-02-22T09:00:00", duration: "45 min", participants: ["Shaurya", "Frank"], status: "upcoming" },
  ],
  todos: [
    { id: "t1", title: "Review component migration PRs", completed: false, priority: "high", dueDate: "2026-02-21" },
    { id: "t2", title: "Update design tokens documentation", completed: false, priority: "medium", dueDate: "2026-02-22" },
    { id: "t3", title: "Set up Figma Code Connect", completed: true, priority: "high", dueDate: "2026-02-20" },
    { id: "t4", title: "Write accessibility audit report", completed: false, priority: "low", dueDate: "2026-02-25" },
    { id: "t5", title: "Ship dark mode to production", completed: false, priority: "high", dueDate: "2026-02-23" },
  ],
  reports: [
    { id: "r1", title: "Week of Feb 10 Summary", date: "2026-02-14", type: "weekly", status: "published" },
    { id: "r2", title: "Week of Feb 17 Summary", date: "2026-02-21", type: "weekly", status: "draft" },
    { id: "r3", title: "January 2026 Monthly", date: "2026-01-31", type: "monthly", status: "published" },
  ],
  memoryItems: [
    { id: "mem1", title: "Key decision on token naming", summary: "Agreed to use semantic names (--fg-base) instead of color names (--gray-900).", date: "2026-02-18" },
    { id: "mem2", title: "CSS Modules over Tailwind", summary: "Team decided CSS Modules provide better co-location and design token integration.", date: "2026-02-15" },
    { id: "mem3", title: "Figma workflow", summary: "Components in Figma should mirror the atomic hierarchy: atoms, molecules, organisms.", date: "2026-02-12" },
  ],
  apps: [
    { id: "a1", name: "Slack Integration", description: "Sync meeting notes to Slack channels", status: "active" },
    { id: "a2", name: "Google Calendar", description: "Auto-import meetings from Google Calendar", status: "active" },
    { id: "a3", name: "Notion Export", description: "Export reports to Notion pages", status: "inactive" },
  ],
  teamMembers: [
    { id: "u1", name: "Shaurya", email: "shaurya@sentra.ai", role: "Admin", avatar: "SH" },
    { id: "u2", name: "Alice Johnson", email: "alice@sentra.ai", role: "Engineer", avatar: "AJ" },
    { id: "u3", name: "Bob Chen", email: "bob@sentra.ai", role: "Designer", avatar: "BC" },
    { id: "u4", name: "Carol Davis", email: "carol@sentra.ai", role: "PM", avatar: "CD" },
    { id: "u5", name: "Dave Wilson", email: "dave@sentra.ai", role: "Engineer", avatar: "DW" },
  ],
};

const DemoContext = createContext<DemoContextValue>({
  isDemo: false,
  mockUser,
  mockData,
});

export function useDemo(): DemoContextValue {
  return useContext(DemoContext);
}

interface DemoProviderProps {
  children: ReactNode;
}

export function DemoProvider({ children }: DemoProviderProps) {
  const isDemo = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("demo") === "true";
  }, []);

  const value = useMemo<DemoContextValue>(() => ({
    isDemo,
    mockUser,
    mockData,
  }), [isDemo]);

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
}
