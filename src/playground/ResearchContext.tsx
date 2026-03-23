import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";

/* ── Types ── */

export interface Source {
  title: string;
  url: string;
  snippet: string;
  type: "web" | "meeting" | "document";
  platform?: "google-meet" | "zoom" | "teams" | "slack" | "notion" | "confluence";
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
        summary: `I identified **12 direct competitors** across consumer, mid-market, and enterprise segments. Here's how the landscape breaks down:

### Consumer Segment

**Otter.ai** dominates with 4M+ active users, a strong free tier, and real-time transcription. Their weakness is limited enterprise features and shallow CRM integration — they're optimized for individual note-takers, not teams.

### Enterprise Segment

**Gong** leads enterprise conversation intelligence with a $7.2B valuation. Their strength is deep revenue analytics and deal tracking. The weakness: pricing starts at $100+/user/month and they're focused exclusively on sales teams — no support for cross-functional meetings.

### Mid-Market Gap

**Fireflies.ai** serves mid-market well with strong CRM integrations for Salesforce and HubSpot. However, no competitor currently offers **cross-meeting memory** or **deep research synthesis** — this remains Sentra's core differentiator.

### Market Consolidation

ZoomInfo's **$575M acquisition of Chorus** signals active consolidation in this space. We should expect more M&A activity in the next 12-18 months. Sentra should position as the next-generation platform before the acquisition window closes.

### Recommended Actions

1. Double down on cross-meeting memory as a moat
2. Prioritize enterprise security (SOC 2) to compete with Gong
3. Build integrations for Salesforce and HubSpot to capture the mid-market`,
        sources: [
          { title: "Otter.ai — Product Overview", url: "https://otter.ai", snippet: "AI-powered meeting transcription with 4M+ active users in the consumer segment.", type: "web" },
          { title: "Gong Revenue Intelligence Platform", url: "https://gong.io", snippet: "Enterprise conversation intelligence leader, $7.2B valuation as of 2025.", type: "web" },
          { title: "Fireflies.ai Integration Docs", url: "https://fireflies.ai", snippet: "Mid-market focus with deep CRM integrations for Salesforce, HubSpot.", type: "web" },
          { title: "ZoomInfo acquires Chorus for $575M", url: "https://zoominfo.com", snippet: "Conversation intelligence acquisition indicating market consolidation trend.", type: "web" },
          { title: "Q4 Strategy Meeting — Competitive Analysis", url: "#", snippet: "Internal discussion on positioning Sentra against Gong and Otter.ai.", type: "meeting", platform: "google-meet" },
          { title: "Product Roadmap 2026 — Differentiators", url: "#", snippet: "Cross-meeting memory and deep research synthesis identified as core differentiators.", type: "document" },
        ],
        findings: [],
        progress: 100,
        duration: "2m 34s",
      },
      {
        id: "dr2",
        query: "What are the typical security requirements for enterprise SaaS deals?",
        date: "Feb 19, 2026",
        status: "completed",
        title: "Enterprise security requirements for SaaS",
        summary: `Here's a breakdown of the security requirements that come up most frequently in enterprise SaaS deals, based on our sales conversations and industry benchmarks:

### SOC 2 Type II — The Baseline

Required by **95% of enterprise buyers**. This is non-negotiable for any company selling to enterprises with 500+ employees.

- **Timeline**: 4-6 months to achieve from scratch
- **Cost**: $50-150K for the initial audit
- **Maintenance**: Annual re-certification required

Our Acme Corp deal specifically requires this before they'll proceed.

### Authentication & Access Control

SSO (SAML/OIDC) and SCIM provisioning are **table stakes** — not differentiators. Every enterprise expects:

- Single Sign-On with their identity provider
- Automated user provisioning/deprovisioning via SCIM
- Org-level MFA enforcement
- Role-based access controls with audit trails

### Data Governance

Data residency is increasingly non-optional, especially for EU and APAC customers:

- **Data residency options** (US, EU, APAC) — Acme Corp specifically requires EU residency
- **GDPR/CCPA compliance** — mandatory for any international deal
- **Right-to-delete** — must be automatable, not a manual support ticket
- **Encryption** — at-rest and in-transit, customer-managed keys for top-tier enterprises

### Priority Recommendation

Focus on SOC 2 Type II first — it unblocks the largest number of deals. SSO/SCIM should be next as they affect day-to-day usage and are often required before pilot deployment.`,
        sources: [
          { title: "SOC 2 Compliance Guide 2026", url: "https://example.com/soc2", snippet: "SOC 2 Type II remains the gold standard for enterprise SaaS security.", type: "web" },
          { title: "Enterprise Sales Call — Acme Corp", url: "#", snippet: "Acme requires SOC 2, SSO, and data residency in EU before proceeding.", type: "meeting", platform: "zoom" },
          { title: "Security Checklist Template", url: "#", snippet: "Internal security requirements checklist for enterprise onboarding.", type: "document" },
        ],
        findings: [],
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
        summary: `Meeting fatigue continues to be a significant productivity challenge in 2026. Here's what the latest research shows and what it means for Sentra:

### The Scale of the Problem

The average knowledge worker now attends **15.5 meetings per week**, up from 11.2 in 2020. According to the Microsoft Work Trend Index, remote workers spend **57% of their work time** in meetings. The result: **67% of employees** report feeling "meeting fatigue" at least 3 days per week.

### Impact on Productivity

A Harvard Business Review study of 182 companies found that implementing **meeting-free days** boosted individual productivity by **35%** and reduced stress by 26%. The key finding is that meetings themselves aren't always the problem — it's the lack of:

- Clear agendas and outcomes
- Accessible summaries for those who couldn't attend
- Follow-through on action items

### Where AI Meeting Assistants Help

Organizations using AI meeting summaries report:

- **30% fewer** unnecessary follow-up meetings
- **18% improvement** in action item completion rates
- **22% reduction** in meeting duration when participants know an AI is capturing notes

### Implications for Sentra

This data strongly supports our value proposition. The key selling point isn't just "we record your meetings" — it's "we reduce the number of meetings you need." Our Memory and Deep Research features directly address the knowledge retrieval problem that causes most unnecessary follow-up meetings.`,
        sources: [
          { title: "Microsoft Work Trend Index 2026", url: "https://example.com/mwti", snippet: "Remote workers spend 57% of their time in meetings, up from 42% in 2020.", type: "web" },
          { title: "Harvard Business Review — Meeting Culture", url: "https://example.com/hbr", snippet: "Study of 182 companies shows meeting-free days boost productivity by 35%.", type: "web" },
        ],
        findings: [],
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
        summary: `Here's an analysis of pricing models for B2B meeting intelligence tools, based on market data and our internal pricing discussions:

### Per-Seat Pricing (Most Common)

Used by **62% of B2B SaaS companies**. It provides predictable revenue and simple buyer math.

| Competitor | Model | Price Range |
|---|---|---|
| Gong | Per-seat, annual | $100-150/user/mo |
| Otter.ai | Per-seat, freemium | $0-30/user/mo |
| Fireflies.ai | Per-seat, tiered | $10-39/user/mo |

### Hybrid Models (Emerging Trend)

Usage-based add-ons on top of a base seat price are emerging as the preferred model for AI-intensive products. Examples:

- **Base seat** at $15-25/user/month
- **AI processing** charged per meeting-minute above a threshold
- **Deep research queries** as a premium add-on

This model works well because it aligns cost with value — teams that use the product more pay more, but there's a predictable baseline.

### Recommended Pricing Strategy

For Sentra's mid-market positioning, the **sweet spot is $15-25/user/month** with annual billing discounts of 15-20%. This undercuts Gong significantly while being premium enough to signal enterprise readiness.

Consider a **three-tier structure**:
1. **Starter** ($15/user/mo) — Recording, transcription, basic summaries
2. **Pro** ($25/user/mo) — Memory, deep research, integrations
3. **Enterprise** (custom) — SSO, SCIM, data residency, dedicated support`,
        sources: [
          { title: "OpenView SaaS Pricing Guide", url: "#", snippet: "Per-seat pricing used by 62% of B2B SaaS companies.", type: "web" },
        ],
        findings: [],
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

const initialNewChat: Conversation = {
  id: "conv-new",
  title: "New chat",
  date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  threads: [],
};

export function ResearchProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([initialNewChat, ...seedConversations]);
  const [activeConversationId, setActiveConversationId] = useState(initialNewChat.id);
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
                    summary: `Here's what I found across web sources and your meeting history related to "${q.slice(0, 60)}":

### Key Findings

Based on analysis of multiple sources, there are several relevant patterns worth noting. The primary insight relates to **${q.slice(0, 50)}** and how it connects to your team's recent discussions.

### From Your Meetings

Your team has discussed related topics in recent meetings. Key points raised include alignment on priorities and potential next steps. This context is important when evaluating external research against internal decisions.

### External Research

Industry sources suggest this is an active area of development. Several organizations have published findings that align with your team's direction, while highlighting a few areas that may warrant further investigation.

### Recommended Next Steps

1. Review the attached sources for detailed context
2. Schedule a follow-up discussion with the team to align on findings
3. Consider running a deeper dive on specific sub-topics that emerged`,
                    sources: [
                      { title: "Related Web Research", url: "#", snippet: "Top results from web analysis related to your query.", type: "web" as const },
                      { title: "Internal Meeting Reference", url: "#", snippet: "Relevant discussion points from recent team meetings.", type: "meeting" as const, platform: "google-meet" as const },
                      { title: "Product Documentation", url: "#", snippet: "Internal documentation with relevant context.", type: "document" as const },
                    ],
                    findings: [],
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
