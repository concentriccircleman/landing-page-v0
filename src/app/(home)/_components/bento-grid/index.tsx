"use client";

import { BentoContainer, Bento } from "./bento";
import Section from "@/components/section";
import alwaysWorkingImage from "@/assets/illustrations/always-working.svg";
import meetingsImage from "@/assets/illustrations/meetings.svg";
import remindersImage from "@/assets/illustrations/reminders.svg";
import actionLogImage from "@/assets/illustrations/action-log.svg";
import onboardingImage from "@/assets/illustrations/onboarding.svg";
import memorizedInstitutionalKnowledgeImage from "@/assets/illustrations/memorized-institutional-knowledge.svg";

export default function BentoGrid() {
  return (
    <Section as="div">
      <h2 className="text-3xl md:text-4xl tracking-tight text-foreground mb-4">
        A new way to operate
      </h2>
      <BentoContainer>
        <Bento
          title="Powerful weekly business reviews"
          subtitle="Replace 5 manual status reports, bureaucratic SOPs, and hours of writing training with a one-time ask to Sentra for weekly updates."
          size="compact"
          image={{
            src: alwaysWorkingImage,
            alt: "Always working status visualization",
            width: 600,
            height: 300,
          }}
        />

        <Bento
          title="Stay in the loop without the meeting"
          subtitle="Keep informed of the key decisions and action items from every meeting, even if you're not there. Sentra ensures nothing falls through the cracks."
          image={{
            src: meetingsImage,
            alt: "Meetings visualization",
            width: 600,
            height: 500,
          }}
        />

        <Bento
          title="Never miss a follow-up"
          subtitle="Sentra remembers your spoken commitments and proactively reminds you at the right time."
          image={{
            src: remindersImage,
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
            src: actionLogImage,
            alt: "Misalignment radar visualization",
            width: 500,
            height: 500,
          }}
        />

        <Bento
          title="A smoother onboarding"
          subtitle="Accelerate new hire ramp-up with contextual knowledge delivery. Sentra provides just-in-time answers to role-specific questions."
          image={{
            src: onboardingImage,
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
              src: memorizedInstitutionalKnowledgeImage,
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
              src: memorizedInstitutionalKnowledgeImage,
              alt: "Institutional knowledge visualization",
              width: 600,
              height: 200,
            }}
          />
        </div>
      </BentoContainer>
    </Section>
  );
}
