const Manifesto = () => {
  return (
    <section className="flex flex-col items-center text-foreground pointer-events-none min-h-screen bg-background">
      <div className="px-4 max-w-3xl z-10 flex flex-col w-full pointer-events-auto">
        <div className="flex flex-col py-12 md:py-24">
          <h1 className="text-3xl/snug font-medium tracking-tight text-foreground mb-8 md:mb-12">
            Sentra: The Operational Nervous System
          </h1>

          <p className="text-base text-muted-foreground mb-6 md:mb-8">
            Scaling breaks organizations in predictable ways. At 20 people, you
            lose the ability to sync over lunch. At 50, product-engineering
            alignment fractures. At 150, cross-functional context evaporates. At
            500, executives are governing a company they no longer understand.
            Companies scaled by adding processes to compensate. More standups.
            More status docs. More dashboards. Each layer added friction while
            reducing actual understanding. Notion pages went stale within weeks.
            Confluence became a graveyard. The result: organizations tracked
            everything about what happened and understood nothing about why.
          </p>

          <p className="text-base text-muted-foreground mb-6 md:mb-8">
            The future belongs to companies where AI deeply understands the
            business, not as a search engine over stale documents, but as a
            living participant in how work actually happens. Memory is not an
            archive. Archives store dead artifacts waiting to be searched. A
            company with 10TB of Google Drive isn&apos;t knowledgeable. It&apos;s
            hoarding. Memory understands. It connects. It learns continuously. A
            library holds books. A scholar reads them, connects ideas across
            volumes, and develops judgment over time. What we call
            &quot;institutional memory&quot; today is actually institutional
            amnesia with good filing.
          </p>

          <p className="text-base text-muted-foreground mb-6 md:mb-8">
            Today we rely on fragmented SaaS tools that require constant manual
            feeding. We serve these tools. We update tickets. We log calls. The
            tools don&apos;t serve us; they demand tribute. Sentra builds memory
            that eliminates the need for tribute entirely. This was impossible
            until very recently.
          </p>

          <p className="text-base text-muted-foreground mb-6 md:mb-8">
            Why wasn&apos;t this built before? Because until now, AI was
            retrieval, not reasoning. It could find a file. It couldn&apos;t
            understand a company. Three thresholds changed that. First, the
            digitization of dark matter: spoken decisions, hallway negotiations,
            ad-hoc brainstorms used to evaporate the moment they happened, that
            friction has collapsed. Second, context windows exploded from 4K to
            over 1M tokens, so we can reason over organizational history, not
            just search it. Third, continuous memory revision: Sentra maintains
            a living state of your organization that updates as decisions occur,
            without model retraining.
          </p>

          <p className="text-base text-muted-foreground mb-6 md:mb-8">
            Borrowing from Kahneman: organizational thinking happens in two
            modes. System-2 is structured output, Jira tickets, PRDs, quarterly
            reports. System-1 is raw cognition, the negotiation of reality in
            meetings and conversations where decisions actually get made. Most
            tools only capture System-2. But System-2 is derivative. By the time
            something becomes a ticket, the actual thinking has already happened
            elsewhere. Sentra captures System-1 directly, building genuine
            understanding of how decisions are made, how projects evolve, and
            how context flows through your company.
          </p>

          <p className="text-base text-muted-foreground mb-6 md:mb-8">
            When AI weaves System-1 and System-2 together across an entire
            company, something new emerges. Call it System 3: collective
            intelligence at the organizational level. The organization
            doesn&apos;t just store its thinking. It actually thinks, as a
            coherent entity, not just individuals trying to stay aligned.
            Single-player AI optimizes one person&apos;s workflow. System 3 is
            multiplayer cognition.
          </p>

          <p className="text-base text-muted-foreground mb-6 md:mb-8">
            What does this look like? An engineer asks why the architecture
            looks this way and gets the full decision history immediately, no
            coffee chats, no archaeology through old PRDs. A VP joins; within a
            week, they ask Sentra why the Q3 pricing decision was made, who
            disagreed, and what changed since, context that used to take six
            months of hallway conversations. A founder wakes up Monday and gets
            a single synthesis across engineering, sales, and ops, not status
            docs to reconcile, but a coherent narrative with risks surfaced. A
            COO notices drift; instead of four meetings to triangulate, they get
            the full decision history, blockers, and who needs to be in the
            room. The coordination tax flattens. Process becomes optional.
          </p>

          <p className="text-base text-muted-foreground mb-6 md:mb-8">
            Today&apos;s AI agents are impressive but fundamentally
            single-player. Claude Code, Copilot, Operator, they excel at tasks
            one person can describe to one computer. They don&apos;t understand
            organizations. The problem we&apos;re solving isn&apos;t &quot;how
            do I automate my individual work.&quot; It&apos;s &quot;how do I
            keep fifty people aligned when context fragments across hundreds of
            conversations daily.&quot; Glean searches documents. Copilot
            summarizes what&apos;s in front of you. Neither builds memory.
            Neither connects a March conversation to a June decision to a
            September consequence. Why can&apos;t they? Because this is a
            research problem.
          </p>

          <p className="text-base text-muted-foreground mb-6 md:mb-8">
            Making coherent sense of millions of tokens of organizational
            context requires new science. We built Reflexion at MIT (NeurIPS
            2023). Now we&apos;re extending it into Operational Reinforcement:
            by maintaining short-term memory of errors as they form, we enable
            real-time correction that dramatically improves performance.
            We&apos;ve shown that 4-billion parameter models fine-tuned with
            this approach match GPT-3.5 and GPT-4o on coding benchmarks.
            We&apos;re extending these capabilities to increase context length,
            improve temporal reasoning, and model how decisions propagate
            through organizations.
          </p>

          <p className="text-base text-muted-foreground mb-6 md:mb-8">
            Our moat deepens with time. Every month Sentra operates inside a
            company, it becomes harder to replace. The learned context of how
            this specific organization communicates isn&apos;t exportable.
            OpenAI starting fresh in 2027 has zero historical context for your
            company.
          </p>

          <p className="text-base text-muted-foreground mb-6 md:mb-8">
            If Sentra is ingesting every meeting and every chat, you&apos;re
            right to ask: who else can see this? Your memory stays yours alone.
            Your organizational memory is entirely isolated, your strategy
            meeting can&apos;t leak into another customer&apos;s context. Your
            data never trains a shared model. You control retention. Access
            mirrors your org structure: an IC can&apos;t query executive
            discussions. We earn trust through architecture, not promises.
          </p>

          <p className="text-base text-muted-foreground mb-6 md:mb-8">
            There&apos;s a missing layer that actually runs enterprises: the
            decision traces. The exceptions, overrides, precedents, and
            reasoning that currently live in Slack threads and people&apos;s
            heads. A VP approves a discount over Zoom. A support lead escalates
            based on synthesis across three systems. The reasoning connecting
            data to action was never treated as data. When Sentra captures this,
            precedent becomes searchable. One-off exceptions turn into
            institutional knowledge. OKRs reflect what&apos;s actually
            happening. Project status updates itself. The engineer who quietly
            unblocks three teams is finally seen. CRM entries populate from
            conversations. When someone asks &quot;why did we do it this
            way?&quot;, there&apos;s an answer, not a guess, but the actual
            decision trace.
          </p>

          <p className="text-base text-muted-foreground mb-6 md:mb-8">
            Over time, patterns will emerge across companies. Not shared data,
            but shared learnings. A founder could understand how similar
            decisions played out at companies like theirs, while every
            company&apos;s memory stays isolated. No more tribute. The tools
            finally serve you. Where founders stay in founder mode at two
            hundred people, not because they sit in every meeting, but because
            they have an agent that does, and actually understands what it
            hears.
          </p>

          <p className="text-lg text-foreground font-medium">
            Sentra. Memory that learns.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
