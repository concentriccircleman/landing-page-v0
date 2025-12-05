"use client";

import { BentoContainer, Bento } from "./Bento";

export default function BentoGrid() {
  return (
    <div className="max-w-screen-4xl mx-auto w-full px-4 mt-32">
      <h2 className="text-3xl md:text-4xl tracking-tight text-foreground mb-8">
        A new way to operate
      </h2>
      <BentoContainer>
        <Bento
          title="Powerful weekly business reviews"
          subtitle="Replace 5 manual status reports, bureaucratic SOPs, and hours of writing training with a one-time ask to Sentra for weekly updates."
          size="compact"
          image={{
            src: "/always-working.svg",
            alt: "Always working status visualization",
            width: 600,
            height: 300,
          }}
        />

        <Bento
          title="Stay in the loop without the meeting"
          subtitle="Keep informed of the key decisions and action items from every meeting, even if you're not there. Sentra ensures nothing falls through the cracks."
          image={{
            src: "/meetings.svg",
            alt: "Meetings visualization",
            width: 600,
            height: 500,
          }}
        />

        <Bento
          title="Never miss a follow-up"
          subtitle="Sentra remembers your spoken commitments and proactively reminds you at the right time."
          image={{
            src: "/reminders.svg",
            alt: "Reminders visualization",
            width: 500,
            height: 500,
          }}
        />

        <Bento
          title="Personalized job assignments"
          subtitle="Get Sentra to help you in the way you need it. Whether it's meeting briefs, custom reports, or just keeping you in the loop. "
          size="compact"
          image={{
            src: "/action-log.svg",
            alt: "Misalignment radar visualization",
            width: 500,
            height: 500,
          }}
        />

        <Bento
          title="A smoother onboarding"
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
            title="Memorialize your institutional knowledge"
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
