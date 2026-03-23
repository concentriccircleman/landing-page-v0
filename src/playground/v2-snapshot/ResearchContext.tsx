import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";

/* ── Types ── */

export interface Source {
  title: string;
  url: string;
  snippet: string;
  type: "web" | "meeting" | "document";
}

export interface Finding {
  heading: string;
  body: string;
}

export interface ResearchThread {
  id: string;
  query: string;
  date: string;
  status: "completed" | "in-progress" | "queued";
  title: string;
  summary: string;
  sources: Source[];
  findings: Finding[];
  progress: number;
  duration?: string;
}

export interface Conversation {
  id: string;
  title: string;
  date: string;
  threads: ResearchThread[];
}

/* ── Seed data ── */

const seedConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Competitive landscape research",
    date: "Feb 20, 2026",
    threads: [
      {
        id: "dr1",
        query: "Who are the main competitors in the AI meeting assistant space?",
        date: "Feb 20, 2026",
        status: "completed",
        title: "Competitive landscape for AI meeting assistants",
        summary: "Identified 12 direct competitors across consumer, mid-market, and enterprise segments. Key differentiators include real-time transcription accuracy, CRM integration depth, and pricing models.",
        sources: [
          { title: "Otter.ai — Product Overview", url: "https://otter.ai", snippet: "AI-powered meeting transcription with 4M+ active users in the consumer segment.", type: "web" },
          { title: "Gong Revenue Intelligence Platform", url: "https://gong.io", snippet: "Enterprise conversation intelligence leader, $7.2B valuation as of 2025.", type: "web" },
          { title: "Fireflies.ai Integration Docs", url: "https://fireflies.ai", snippet: "Mid-market focus with deep CRM integrations for Salesforce, HubSpot.", type: "web" },
          { title: "ZoomInfo acquires Chorus for $575M", url: "https://zoominfo.com", snippet: "Conversation intelligence acquisition indicating market consolidation trend.", type: "web" },
          { title: "Q4 Strategy Meeting — Competitive Analysis", url: "#", snippet: "Internal discussion on positioning Sentra against Gong and Otter.ai.", type: "meeting" },
          { title: "Product Roadmap 2026 — Differentiators", url: "#", snippet: "Cross-meeting memory and deep research synthesis identified as core differentiators.", type: "document" },
        ],
        findings: [
          { heading: "Consumer Leader", body: "Otter.ai dominates the consumer segment with 4M+ users, strong free tier, and real-time transcription. Weakness: limited enterprise features and CRM integration." },
          { heading: "Enterprise Leader", body: "Gong leads enterprise with revenue intelligence. $7.2B valuation. Strength: deep analytics. Weakness: expensive ($100+/user/mo), focused on sales only." },
          { heading: "Mid-Market Gap", body: "Fireflies.ai serves mid-market well with CRM integrations. However, no competitor offers cross-meeting memory or deep research synthesis — Sentra's core differentiator." },
          { heading: "Market Consolidation", body: "ZoomInfo's $575M Chorus acquisition signals consolidation. Expect more M&A activity. Sentra should position as the next-gen platform before the window closes." },
        ],
        progress: 100,
        duration: "2m 34s",
      },
      {
        id: "dr2",
        query: "What are the typical security requirements for enterprise SaaS deals?",
        date: "Feb 19, 2026",
        status: "completed",
        title: "Enterprise security requirements for SaaS",
        summary: "SOC 2 Type II is the baseline for enterprise deals. Additional requirements include HIPAA compliance for healthcare, SSO/SCIM provisioning, comprehensive audit logs, data residency options, and penetration testing reports.",
        sources: [
          { title: "SOC 2 Compliance Guide 2026", url: "https://example.com/soc2", snippet: "SOC 2 Type II remains the gold standard for enterprise SaaS security.", type: "web" },
          { title: "Enterprise Sales Call — Acme Corp", url: "#", snippet: "Acme requires SOC 2, SSO, and data residency in EU before proceeding.", type: "meeting" },
          { title: "Security Checklist Template", url: "#", snippet: "Internal security requirements checklist for enterprise onboarding.", type: "document" },
        ],
        findings: [
          { heading: "Baseline: SOC 2 Type II", body: "Required by 95% of enterprise buyers. Average compliance timeline: 4-6 months. Cost: $50-150K for initial audit." },
          { heading: "Authentication & Access", body: "SSO (SAML/OIDC) and SCIM provisioning are table stakes. MFA must be enforceable at the org level." },
          { heading: "Data Governance", body: "Data residency options (US, EU, APAC) increasingly required. GDPR/CCPA compliance is mandatory. Right-to-delete must be automatable." },
        ],
        progress: 100,
        duration: "1m 52s",
      },
    ],
  },
  {
    id: "conv-2",
    title: "Meeting fatigue & productivity",
    date: "Feb 21, 2026",
    threads: [
      {
        id: "dr3",
        query: "Latest research on meeting fatigue and impact on productivity",
        date: "Feb 21, 2026",
        status: "completed",
        title: "Meeting fatigue and productivity trends 2026",
        summary: "Organizations using AI meeting summaries report 30% fewer unnecessary follow-up meetings and 18% improvement in action item completion rates.",
        sources: [
          { title: "Microsoft Work Trend Index 2026", url: "https://example.com/mwti", snippet: "Remote workers spend 57% of their time in meetings, up from 42% in 2020.", type: "web" },
          { title: "Harvard Business Review — Meeting Culture", url: "https://example.com/hbr", snippet: "Study of 182 companies shows meeting-free days boost productivity by 35%.", type: "web" },
        ],
        findings: [
          { heading: "Meeting Overload Statistics", body: "Average knowledge worker attends 15.5 meetings per week (up from 11.2 in 2020). 67% report feeling \"meeting fatigue\" at least 3 days per week." },
        ],
        progress: 100,
        duration: "1m 48s",
      },
    ],
  },
  {
    id: "conv-3",
    title: "B2B pricing models",
    date: "Feb 21, 2026",
    threads: [
      {
        id: "dr4",
        query: "What pricing models work best for B2B meeting intelligence tools?",
        date: "Feb 21, 2026",
        status: "completed",
        title: "Pricing models for B2B SaaS tools",
        summary: "Per-seat pricing remains dominant but usage-based models are gaining traction. The sweet spot for mid-market meeting intelligence tools is $15-25/user/month with annual billing discounts.",
        sources: [
          { title: "OpenView SaaS Pricing Guide", url: "#", snippet: "Per-seat pricing used by 62% of B2B SaaS companies.", type: "web" },
        ],
        findings: [
          { heading: "Per-Seat Dominance", body: "62% of B2B SaaS companies use per-seat pricing. It provides predictable revenue and simple buyer math." },
          { heading: "Hybrid Models Rising", body: "Usage-based add-ons (e.g., per-meeting-minute charges) on top of a base seat price are emerging as the preferred model for AI-intensive products." },
        ],
        progress: 100,
        duration: "1m 22s",
      },
    ],
  },
];

/* ── Context shape ── */

interface ResearchContextValue {
  conversations: Conversation[];
  activeConversationId: string;
  threads: ResearchThread[];
  expandedCards: Set<string>;
  isResearching: boolean;
  query: string;
  setQuery: (q: string) => void;
  submitQuery: (q?: string) => void;
  toggleCard: (id: string) => void;
  newChat: () => void;
  selectConversation: (id: string) => void;
}

const ResearchContext = createContext<ResearchContextValue | null>(null);

/* ── Provider ── */

export function ResearchProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(seedConversations);
  const [activeConversationId, setActiveConversationId] = useState(seedConversations[0].id);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [isResearching, setIsResearching] = useState(false);
  const [query, setQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeConvo = conversations.find((c) => c.id === activeConversationId);
  const threads = activeConvo?.threads ?? [];

  const toggleCard = useCallback((id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const newChat = useCallback(() => {
    const id = `conv-${Date.now()}`;
    const convo: Conversation = {
      id,
      title: "New chat",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      threads: [],
    };
    setConversations((prev) => [convo, ...prev]);
    setActiveConversationId(id);
    setExpandedCards(new Set());
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setExpandedCards(new Set());
  }, []);

  const submitQuery = useCallback((override?: string) => {
    const q = (override ?? query).trim();
    if (!q || isResearching) return;

    const newThread: ResearchThread = {
      id: `dr-${Date.now()}`,
      query: q,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "in-progress",
      title: q.length > 60 ? q.slice(0, 57) + "..." : q,
      summary: "",
      sources: [],
      findings: [],
      progress: 0,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeConversationId) return c;
        const isFirst = c.threads.length === 0;
        return {
          ...c,
          title: isFirst ? (q.length > 40 ? q.slice(0, 37) + "..." : q) : c.title,
          threads: [...c.threads, newThread],
        };
      }),
    );
    setQuery("");
    setIsResearching(true);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeConversationId) return c;
          return {
            ...c,
            threads: c.threads.map((t) =>
              t.id === newThread.id
                ? {
                    ...t,
                    status: "completed" as const,
                    progress: 100,
                    title: `Research: ${q.slice(0, 50)}`,
                    summary: `Analysis complete. Found relevant insights across web sources and your meeting history related to "${q.slice(0, 80)}". Key patterns identified with actionable recommendations.`,
                    sources: [
                      { title: "Related Web Research", url: "#", snippet: "Top results from web analysis related to your query.", type: "web" as const },
                      { title: "Internal Meeting Reference", url: "#", snippet: "Relevant discussion points from recent team meetings.", type: "meeting" as const },
                      { title: "Product Documentation", url: "#", snippet: "Internal documentation with relevant context.", type: "document" as const },
                    ],
                    findings: [
                      { heading: "Primary Insight", body: `Based on analysis of multiple sources, the key finding relates to ${q.slice(0, 40)}. Further investigation is recommended.` },
                      { heading: "Recommendation", body: "Consider reviewing the attached sources for more detailed context. Scheduling a follow-up discussion with the team is advised." },
                    ],
                  }
                : t,
            ),
          };
        }),
      );
      setIsResearching(false);
      timerRef.current = null;
    }, 3000);
  }, [query, isResearching, activeConversationId]);

  return (
    <ResearchContext.Provider value={{
      conversations,
      activeConversationId,
      threads,
      expandedCards,
      isResearching,
      query,
      setQuery,
      submitQuery,
      toggleCard,
      newChat,
      selectConversation,
    }}>
      {children}
    </ResearchContext.Provider>
  );
}

/* ── Hook ── */

export function useResearch(): ResearchContextValue {
  const ctx = useContext(ResearchContext);
  if (!ctx) throw new Error("useResearch must be used within a ResearchProvider");
  return ctx;
}
