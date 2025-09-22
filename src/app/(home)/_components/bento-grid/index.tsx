"use client";

import { BentoContainer, Bento } from "./Bento";

export default function BentoGrid() {
  return (
    <div className="max-w-screen-4xl mx-auto w-full px-4 mt-32">
      <h2 className="text-3xl md:text-4xl tracking-tight text-foreground mb-8">
        How Companies Scale in the AI Era
      </h2>
      <BentoContainer>
        <Bento
          title="Always working"
          subtitle="Replace 5 direct reports, bureaucratic SOPs, and hours of writing training with a one-time ask to Sentra for weekly updates. P.S. Sentra can do other jobs too."
          size="compact"
          image={{
            src: "/always-working.svg",
            alt: "Always working status visualization",
            width: 600,
            height: 300,
          }}
        />

        <Bento
          title="Misalignment radar"
          subtitle="Goals shift rapidly. Messages get lost in translation. Synchronization becomes harder. Sentra senses these patterns before they become problems."
          size="compact"
          image={{
            src: "/misalignment-radar.svg",
            alt: "Misalignment radar visualization",
            width: 600,
            height: 400,
          }}
        />

        <Bento
          title="Reminders"
          subtitle="Never miss a follow-up. Sentra captures commitments from meetings and proactively reminds you at the right time."
          image={{
            src: "/reminders.svg",
            alt: "Reminders visualization",
            width: 500,
            height: 500,
          }}
        />

        <Bento
          title="Meetings"
          subtitle="Capture key decisions and action items from every meeting automatically. Sentra ensures nothing falls through the cracks."
          image={{
            src: "/meetings.svg",
            alt: "Meetings visualization",
            width: 500,
            height: 500,
          }}
        />

        <Bento
          title="Onboarding"
          subtitle="Accelerate new hire ramp-up with contextual knowledge delivery. Sentra provides just-in-time answers to role-specific questions."
          image={{
            src: "/onboarding.svg",
            alt: "Onboarding visualization",
            width: 500,
            height: 500,
          }}
        />

        <div className="md:hidden">
          <Bento
            title="Memorialized institutional knowledge"
            subtitle="Access decisions from departed team members. Sentra links the who, what, when, and why of every important choice. Own your company's lore."
            image={{
              src: "/memorized-institutional-knowledge.svg",
              alt: "Institutional knowledge visualization",
              width: 600,
              height: 200,
            }}
          />
        </div>

        <div className="hidden md:block">
          <Bento
            title="Memorialized institutional knowledge"
            subtitle="Access decisions from departed team members. Sentra links the who, what, when, and why of every important choice. Own your company's lore."
            layout="side-by-side"
            textSize="large"
            image={{
              src: "/memorized-institutional-knowledge.svg",
              alt: "Institutional knowledge visualization",
              width: 600,
              height: 200,
            }}
          />
        </div>
      </BentoContainer>
    </div>
  );
}
