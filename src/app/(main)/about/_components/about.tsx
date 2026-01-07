const About = () => {
  return (
    <section className="flex flex-col justify-center items-center text-foreground pointer-events-none h-full">
      <div className="px-4 max-w-3xl z-10 flex flex-col h-full w-full justify-center items-center pointer-events-auto overflow-y-auto">
        <div className="flex flex-col">
          <h1 className="text-3xl/snug font-medium tracking-tight text-foreground">
            So What is Sentra?
          </h1>

          <p className="text-lg text-foreground/60 mb-8 md:mb-12 font-light italic">
            Your team&apos;s superintelligence
          </p>

          <p className="text-base text-foreground/80 mb-6 md:mb-8">
            Sentra is the central node in your team. By joining every meeting,
            talking with everybody regularly, and reading the same tools you use,
            she creates a unified company memory. Using this memory, Sentra makes
            sure everyone stays on the same page. Sentra can also be assigned
            jobs.
          </p>

          <div className="bg-sh-background border border-border p-6 mb-8">
            <h3 className="text-lg font-medium text-foreground mb-3">
              Example Job Assignments
            </h3>
            <div className="space-y-4 text-foreground/80">
              <div>
                <p className="font-medium">VP of Product:</p>
                <p className="text-sm italic">
                  &quot;10min before every meeting, send me a brief with context on
                  who/what/why.&quot;
                </p>
              </div>
              <div>
                <p className="font-medium">Account Executive:</p>
                <p className="text-sm italic">
                  &quot;...and also include a quick overview of this customer&apos;s
                  journey. If it&apos;s a new prospect, research relevant facts
                  online.&quot;
                </p>
              </div>
              <div>
                <p className="font-medium">Employee going on vacation:</p>
                <p className="text-sm italic">
                  &quot;I&apos;m on vacation for 2 weeks. Keep track of all stuff that
                  moves, take my meetings for me, and debrief me once I&apos;m
                  back.&quot;
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-medium text-foreground mb-6 mt-12">
            Why Unified Company Memory Matters
          </h2>

          <p className="text-base text-foreground/80 mb-6 md:mb-8">
            Powered by unified company memory, Sentra has a deep understanding of
            the nuances and context behind how any job needs to be done for you.
            Individual workflows are often nuanced, dynamic, and complex - and
            without organizational context, even the smartest AI fails.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border border-border bg-sh-background p-6">
              <h3 className="text-lg font-medium text-foreground mb-3">
                ❌ Without Company Memory
              </h3>
              <div className="space-y-3 text-foreground/80 text-sm">
                <div>
                  <p className="font-medium">Meeting brief request:</p>
                  <p className="italic">
                    &quot;Meeting with Sarah at 2pm about Q1 planning&quot;
                  </p>
                  <p className="text-foreground/60 text-xs mt-1">
                    Generic, unhelpful - doesn&apos;t know Sarah is the head of
                    product, that Q1 planning was delayed due to budget
                    constraints, or that there&apos;s tension between engineering
                    and product teams.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-border bg-sh-background p-6">
              <h3 className="text-lg font-medium text-foreground mb-3">
                ✓ With Company Memory
              </h3>
              <div className="space-y-3 text-foreground/80 text-sm">
                <div>
                  <p className="font-medium">Meeting brief request:</p>
                  <p className="italic">
                    &quot;Meeting with Sarah (Head of Product) about Q1 planning.
                    Context: Planning delayed 3 weeks due to budget freeze.
                    Engineering bandwidth concerns raised in last 1:1. Sarah
                    mentioned prioritizing mobile features. Key decision needed
                    on feature scope.&quot;
                  </p>
                  <p className="text-foreground/60 text-xs mt-1">
                    Actionable, contextualized, and addresses the real dynamics
                    at play.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-sh-background border border-border p-6 mb-8">
            <h3 className="text-lg font-medium text-foreground mb-3">
              Real Example: Personalized Meeting Summaries
            </h3>
            <p className="text-foreground/80 mb-3">
              After team leader meetings, Sentra sends personalized summaries to
              each participant. For example, she might highlight:
            </p>
            <ul className="text-sm text-secondary space-y-2">
              <li>
                • <strong>Your commitments:</strong> &quot;Complete V2 Model
                validation by Friday&quot; (promises you made)
              </li>
              <li>
                • <strong>Asks of you:</strong> &quot;Chris requested you connect
                with MIT team&quot; (requests from others)
              </li>
              <li>
                • <strong>Your interests:</strong> Updates on interpretability
                research (based on your conversation history)
              </li>
              <li>
                • <strong>Missed captures:</strong> OpenAI partnership
                discussion (mentioned 7 times, requiring your input)
              </li>
            </ul>
            <p className="text-xs text-muted mt-3 italic">
              Without company memory, everyone would get the same generic
              summary. With it, each person gets exactly what they need to know.
            </p>
          </div>

          <div className="border-t border-border/20 my-12 pt-12">
            <h2 className="text-2xl font-medium text-foreground mb-8">
              What Sentra Doesn&apos;t Do
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <span className="text-foreground mt-1 text-lg">❌</span>
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Sentra does not live on your computer
                  </h3>
                  <p className="text-sm text-foreground/80">
                    She does not have access to your device&apos;s data and
                    activity.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-foreground mt-1 text-lg">❌</span>
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Sentra does not make judgements on her own
                  </h3>
                  <p className="text-sm text-foreground/80">
                    Acting on missing information or incorrect assumptions only
                    amplifies problems. Sentra will always ask for clarification
                    if there&apos;s any uncertainty.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-foreground mt-1 text-lg">❌</span>
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Sentra is not a replacement for humans
                  </h3>
                  <p className="text-sm text-foreground/80">
                    Rather, she is augmenting every person&apos;s workflow so they
                    can do better work.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="text-foreground mt-1 text-lg">❌</span>
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Sentra does not spy on you
                  </h3>
                  <p className="text-sm text-foreground/80">
                    She takes{" "}
                    <a
                      href="/data-privacy"
                      className="text-brand hover:underline"
                    >
                      data privacy very seriously
                    </a>
                    , and ensures you remain in control of your data, keeping
                    you protected.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-sh-background border border-border p-6 mb-8">
            <h3 className="text-lg font-medium text-foreground mb-2">
              Questions About How Sentra Works?
            </h3>
            <p className="text-foreground/80">
              Feel free to explore the rest of the website or reach out directly
              to <span className="font-medium">contact@sentra.app</span>
            </p>
          </div>

          <p className="text-base text-foreground/80 mb-6 md:mb-8 text-right">
            — Jae, Co-founder and CEO
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
