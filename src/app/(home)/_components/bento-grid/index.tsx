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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-brand flex items-center justify-center">
          <svg className="w-4 h-4 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter text-[#1a1a1f]">
          A new way to operate
        </h2>
      </div>
      <BentoContainer>
        <Bento
          title="Powerful weekly business reviews"
          subtitle="Replace 5 manual status reports, bureaucratic SOPs, and hours of writing training with a one-time ask to Sentra for weekly updates."
          size="compact"
          icon={<svg className="w-3.5 h-3.5 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
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
          icon={<svg className="w-3.5 h-3.5 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
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
          icon={<svg className="w-3.5 h-3.5 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
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
          icon={<svg className="w-3.5 h-3.5 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
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
          icon={<svg className="w-3.5 h-3.5 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" /></svg>}
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
            icon={<svg className="w-3.5 h-3.5 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
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
            icon={<svg className="w-3.5 h-3.5 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
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
