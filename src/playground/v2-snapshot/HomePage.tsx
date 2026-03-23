import { useDemo } from "../../product/DemoProvider";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { TopBar } from "../../components/TopBar";
import { ChevronRight, AiSparkle } from "../../icons/outline";
import styles from "../HomePage.module.css";

const todaysMeetings = [
  { id: "m1", name: "Product Sync", time: "10:00 AM", duration: "30 min", participants: 4, isNext: true },
  { id: "m2", name: "Design System Review", time: "2:00 PM", duration: "60 min", participants: 3, isNext: false },
  { id: "m3", name: "Customer Feedback Session", time: "4:00 PM", duration: "45 min", participants: 2, isNext: false },
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

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function HomePage({ onOpenChat }: { onOpenChat?: () => void } = {}) {
  const { mockUser } = useDemo();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

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

      <div className={styles.scroll}>
        <div className={styles.inner}>
          <header className={styles.hero}>
            <h1 className={styles.greeting}>{getGreeting()}, {mockUser.name.split(" ")[0]}</h1>
            <p className={styles.subtitle}>{today}</p>
          </header>

          {/* ── Meetings ── */}
          <section className={styles.section} style={{ "--stagger-base": 0 } as React.CSSProperties}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Meetings today</h2>
              <span className={styles.sectionCount}>{todaysMeetings.length}</span>
            </div>
            <div className={styles.cardList}>
              {todaysMeetings.map((m, i) => (
                <button
                  key={m.id}
                  type="button"
                  className={`${styles.card} ${m.isNext ? styles.cardNext : ""}`}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <div className={styles.meetingTime}>
                    <span className={styles.timeText}>{m.time}</span>
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{m.name}</h3>
                    <p className={styles.cardDesc}>{m.duration} · {m.participants} participants</p>
                  </div>
                  <div className={styles.cardRight}>
                    {m.isNext && <Badge variant="info" size="sm">Next</Badge>}
                    <ChevronRight className={styles.chevron} />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ── Actions ── */}
          <section className={styles.section} style={{ "--stagger-base": todaysMeetings.length } as React.CSSProperties}>
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

          {/* ── Risks ── */}
          <section className={styles.section} style={{ "--stagger-base": todaysMeetings.length + actions.length } as React.CSSProperties}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Risks to review</h2>
              <span className={styles.sectionCount}>{risks.length}</span>
            </div>
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
          </section>
        </div>
      </div>
    </div>
  );
}
