import { useState } from "react";
import { useDemo } from "../product/DemoProvider";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { TopBar } from "../components/TopBar";
import { ChevronRight, AiSparkle, XMark } from "../icons/outline";
import styles from "./HomePage.module.css";

const LEADER_ROLES = new Set(["Admin", "PM", "Manager", "Lead", "Director", "VP", "CTO", "CEO"]);

const todaysMeetings = [
  {
    id: "m1", name: "Product Sync", time: "10:00 AM", duration: "30 min", participants: 4, isNext: true,
    brief: {
      agenda: ["Review sprint progress", "Discuss Q1 launch timeline", "Align on design system migration"],
      attendees: ["Shaurya", "Carol Davis", "Alice Johnson", "Bob Chen"],
      context: "Last meeting on Feb 21 covered the component migration plan. Carol raised concerns about the timeline.",
    },
  },
  {
    id: "m2", name: "Design System Review", time: "2:00 PM", duration: "60 min", participants: 3, isNext: false,
    brief: {
      agenda: ["Review new color token naming", "Finalize icon set for v2", "Discuss component API changes"],
      attendees: ["Shaurya", "Alice Johnson", "Dave Kim"],
      context: "Last session on Feb 20 finalized spacing tokens. Alice flagged accessibility contrast concerns on secondary buttons.",
    },
  },
  {
    id: "m3", name: "Customer Feedback Session", time: "4:00 PM", duration: "45 min", participants: 2, isNext: false,
    brief: {
      agenda: ["Review Acme Corp onboarding feedback", "Discuss top 3 feature requests"],
      attendees: ["Shaurya", "Bob Chen"],
      context: "Acme Corp completed week 2 of their pilot. Bob flagged SSO as a blocker in the last sync.",
    },
  },
];

const actions = [
  { id: "a1", title: "Review Q1 hiring plan", desc: "Alice needs your input on the headcount budget before the next board meeting.", due: "Today" },
  { id: "a2", title: "Approve design system migration", desc: "70 components ready for final sign-off. Carol is waiting on your approval.", due: "Today" },
  { id: "a3", title: "Respond to Acme Corp SSO request", desc: "Sales needs product confirmation on SSO timeline for the Acme deal.", due: "Tomorrow" },
];

const risks = [
  { id: "r1", title: "SoftBank PoC timeline conflict", desc: "Design system migration deadline conflicts with the March product launch.", severity: "critical" as const },
  { id: "r2", title: "Acme Corp deal at risk", desc: "SSO and audit logs required by March — not on the current sprint plan.", severity: "critical" as const },
  { id: "r3", title: "Q2 hiring budget gap", desc: "$180K gap between engineering hiring plan and finance projections.", severity: "high" as const },
];

const recentReports = [
  { id: "wr1", title: "Week of Feb 24 Summary", date: "Feb 28, 2026", highlights: "Shipped 12 components, closed 8 PRs. Design system migration at 85%.", status: "published" as const },
  { id: "wr2", title: "Week of Feb 17 Summary", date: "Feb 21, 2026", highlights: "Kicked off token migration. 3 critical bugs resolved in production.", status: "published" as const },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function HomePage({ onOpenChat, onNavigate }: { onOpenChat?: () => void; onNavigate?: (page: string) => void } = {}) {
  const { mockUser } = useDemo();
  const [openBriefId, setOpenBriefId] = useState<string | null>(null);
  const isLeader = LEADER_ROLES.has(mockUser.role);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  let stagger = 0;

  const activeBrief = todaysMeetings.find((m) => m.id === openBriefId);

  return (
    <div className={styles.page}>
      <TopBar
        breadcrumbs={[{ label: "Home" }]}
        actions={
          onOpenChat && (
            <Button variant="secondary" size="sm" onClick={onOpenChat}>
              <AiSparkle width={14} height={14} />
              Open Chat
            </Button>
          )
        }
      />

      <div className={styles.contentArea}>
        <div className={styles.scroll}>
          <div className={styles.inner}>
            <header className={styles.hero}>
              <h1 className={styles.greeting}>{getGreeting()}, {mockUser.name.split(" ")[0]}</h1>
              <p className={styles.subtitle}>{today}</p>
            </header>

            {/* ── Meetings ── */}
            <section className={styles.section} style={{ "--stagger-base": stagger } as React.CSSProperties}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Meetings today</h2>
                <span className={styles.sectionCount}>{todaysMeetings.length}</span>
              </div>
              {todaysMeetings.length === 0 ? (
                <div className={styles.card} style={{ justifyContent: "center", padding: "var(--space-6)", cursor: "default" }}>
                  <p className={styles.cardDesc} style={{ textAlign: "center", margin: 0 }}>No meetings scheduled for today. Enjoy the focus time.</p>
                </div>
              ) : (
                <div className={styles.cardList}>
                  {todaysMeetings.map((m, i) => (
                    <div
                      key={m.id}
                      className={`${styles.card} ${m.isNext ? styles.cardNext : ""} ${openBriefId === m.id ? styles.cardBriefActive : ""}`}
                      style={{ "--i": i } as React.CSSProperties}
                    >
                      <div className={styles.meetingTime}>
                        <span className={styles.timeText}>{m.time}</span>
                      </div>
                      <div className={styles.cardBody}>
                        <div className={styles.cardTitleRow}>
                          <h3 className={styles.cardTitle}>{m.name}</h3>
                          {m.isNext && <Badge variant="info" size="sm">Next</Badge>}
                        </div>
                        <p className={styles.cardDesc}>{m.duration} · {m.participants} participants</p>
                      </div>
                      <div className={styles.cardRight}>
                        {m.brief && (
                          <Button
                            variant={m.isNext ? "primary" : "ghost"}
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); setOpenBriefId(openBriefId === m.id ? null : m.id); }}
                          >
                            {openBriefId === m.id ? "Hide brief" : "View brief"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          {/* ── Actions ── */}
          {(() => { stagger += todaysMeetings.length; return null; })()}
          <section className={styles.section} style={{ "--stagger-base": stagger } as React.CSSProperties}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Actions</h2>
              <span className={styles.sectionCount}>{actions.length}</span>
            </div>
            <div className={styles.cardList}>
              {actions.map((a, i) => (
                <button
                  key={a.id}
                  type="button"
                  className={styles.card}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{a.title}</h3>
                    <p className={styles.cardDesc}>{a.desc}</p>
                  </div>
                  <div className={styles.cardRight}>
                    <span className={styles.cardDue}>{a.due}</span>
                    <ChevronRight className={styles.chevron} />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ── Weekly Reports (leaders only) ── */}
          {isLeader && (
            <>
              {(() => { stagger += actions.length; return null; })()}
              <section className={styles.section} style={{ "--stagger-base": stagger } as React.CSSProperties}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Weekly Reports</h2>
                  <button type="button" className={styles.viewAllLink} onClick={() => onNavigate?.("weekly-reports")}>
                    View all
                  </button>
                </div>
                <div className={styles.cardList}>
                  {recentReports.map((r, i) => (
                    <button
                      key={r.id}
                      type="button"
                      className={styles.card}
                      style={{ "--i": i } as React.CSSProperties}
                      onClick={() => onNavigate?.("weekly-reports")}
                    >
                      <div className={styles.cardBody}>
                        <h3 className={styles.cardTitle}>{r.title}</h3>
                        <p className={styles.cardDesc}>{r.highlights}</p>
                      </div>
                      <div className={styles.cardRight}>
                        <span className={styles.cardDue}>{r.date}</span>
                        <ChevronRight className={styles.chevron} />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* ── Risks (leaders see full list, ICs see empty state) ── */}
          {(() => { stagger += (isLeader ? recentReports.length : 0) + actions.length; return null; })()}
          <section className={styles.section} style={{ "--stagger-base": stagger } as React.CSSProperties}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Risks to review</h2>
              {isLeader && <span className={styles.sectionCount}>{risks.length}</span>}
            </div>
            {isLeader ? (
              <div className={styles.cardList}>
                {risks.map((r, i) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`${styles.card} ${styles.cardRisk}`}
                    style={{ "--i": i } as React.CSSProperties}
                  >
                    <div className={styles.cardBody}>
                      <div className={styles.riskTitleRow}>
                        <span className={r.severity === "critical" ? styles.dotRed : styles.dotYellow} />
                        <h3 className={styles.cardTitle}>{r.title}</h3>
                      </div>
                      <p className={styles.cardDesc}>{r.desc}</p>
                    </div>
                    <div className={styles.cardRight}>
                      <ChevronRight className={styles.chevron} />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.card} style={{ justifyContent: "center", padding: "var(--space-6)", cursor: "default" }}>
                <p className={styles.cardDesc} style={{ textAlign: "center", margin: 0 }}>No risks assigned to you. Risk Radar reports are generated for team leads and managers.</p>
              </div>
            )}
          </section>
          </div>
        </div>

        {activeBrief && activeBrief.brief && (
          <aside className={styles.briefPanel}>
            <div className={styles.briefHeader}>
              <h3 className={styles.briefTitle}>Pre-meeting brief</h3>
              <span className={styles.briefMeetingName}>{activeBrief.name}</span>
              <Button variant="ghost" size="icon-sm" onClick={() => setOpenBriefId(null)} className={styles.briefClose}>
                <XMark width={14} height={14} />
              </Button>
            </div>
            <div className={styles.briefBody}>
              <div className={styles.briefSection}>
                <span className={styles.briefLabel}>Agenda</span>
                <ul className={styles.briefList}>
                  {activeBrief.brief.agenda.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
              <div className={styles.briefSection}>
                <span className={styles.briefLabel}>Attendees</span>
                <p className={styles.briefText}>{activeBrief.brief.attendees.join(", ")}</p>
              </div>
              <div className={styles.briefSection}>
                <span className={styles.briefLabel}>Context from previous meetings</span>
                <p className={styles.briefText}>{activeBrief.brief.context}</p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
