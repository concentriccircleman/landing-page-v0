"use client";

import Image, { type ImageProps } from "next/image";
import unifiedKnowledgeImage from "@/assets/illustrations/unified-knowledge.svg";
import alignmentImage from "@/assets/illustrations/alignment.svg";
import misalignmentRadarImage from "@/assets/illustrations/misalignment-radar.svg";
import alwaysWorkingImage from "@/assets/illustrations/always-working.svg";
import meetingsImage from "@/assets/illustrations/meetings.svg";
import remindersImage from "@/assets/illustrations/reminders.svg";
import actionLogImage from "@/assets/illustrations/action-log.svg";
import onboardingImage from "@/assets/illustrations/onboarding.svg";
import memorizedInstitutionalKnowledgeImage from "@/assets/illustrations/memorized-institutional-knowledge.svg";

interface Feature {
  id: string;
  label: string;
  title: string;
  description: string;
  imageSrc: ImageProps["src"];
  imageAlt: string;
  icon: React.ReactNode;
}

const FEATURES: Feature[] = [
  {
    id: "unified-memory",
    label: "Unified Memory",
    title: "A \"git log\" of your company's decisions",
    description:
      "Sentra understands how the company changes by creating a unified timeline of decisions and commitments. Every meeting, document, and conversation becomes part of a living record that your entire organization can draw from.",
    imageSrc: unifiedKnowledgeImage,
    imageAlt: "Unified knowledge timeline visualization",
    icon: (
      <svg className="w-4 h-4 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3zm0 5h16" />
      </svg>
    ),
  },
  {
    id: "strategic-alignment",
    label: "Strategic Alignment",
    title: "A ground-zero understanding of your company",
    description:
      "By being present with your team, Sentra learns your company's priorities and strategic context. It connects the dots across departments, ensuring everyone shares the same understanding of what matters most.",
    imageSrc: alignmentImage,
    imageAlt: "Strategic alignment visualization",
    icon: (
      <svg className="w-4 h-4 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    id: "risk-detection",
    label: "Risk Detection",
    title: "Identify risks and conflicts in real time",
    description:
      "With real-time awareness across your organization, Sentra identifies conflicting priorities, missed commitments, and communication breakdowns before they become costly problems.",
    imageSrc: misalignmentRadarImage,
    imageAlt: "Risk detection radar visualization",
    icon: (
      <svg className="w-4 h-4 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    id: "business-reviews",
    label: "Business Reviews",
    title: "Powerful weekly business reviews",
    description:
      "Replace 5 manual status reports, bureaucratic SOPs, and hours of writing training with a one-time ask to Sentra for weekly updates.",
    imageSrc: alwaysWorkingImage,
    imageAlt: "Always working status visualization",
    icon: (
      <svg className="w-4 h-4 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: "meeting-intelligence",
    label: "Meeting Intelligence",
    title: "Stay in the loop without the meeting",
    description:
      "Keep informed of the key decisions and action items from every meeting, even if you're not there. Sentra ensures nothing falls through the cracks.",
    imageSrc: meetingsImage,
    imageAlt: "Meetings visualization",
    icon: (
      <svg className="w-4 h-4 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    id: "follow-ups",
    label: "Follow-ups",
    title: "Never miss a follow-up",
    description:
      "Sentra remembers your spoken commitments and proactively reminds you at the right time.",
    imageSrc: remindersImage,
    imageAlt: "Reminders visualization",
    icon: (
      <svg className="w-4 h-4 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    id: "job-assignments",
    label: "Job Assignments",
    title: "Personalized job assignments",
    description:
      "Get Sentra to help you in the way you need it. Whether it's meeting briefs, custom reports, or just keeping you in the loop.",
    imageSrc: actionLogImage,
    imageAlt: "Action log visualization",
    icon: (
      <svg className="w-4 h-4 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: "onboarding",
    label: "Onboarding",
    title: "A smoother onboarding",
    description:
      "Accelerate new hire ramp-up with contextual knowledge delivery. Sentra provides just-in-time answers to role-specific questions.",
    imageSrc: onboardingImage,
    imageAlt: "Onboarding visualization",
    icon: (
      <svg className="w-4 h-4 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
      </svg>
    ),
  },
  {
    id: "institutional-knowledge",
    label: "Institutional Knowledge",
    title: "Memorialize your institutional knowledge",
    description:
      "Access decisions from departed team members. Sentra links the who, what, when, and why of every important choice. Own your company's lore.",
    imageSrc: memorizedInstitutionalKnowledgeImage,
    imageAlt: "Institutional knowledge visualization",
    icon: (
      <svg className="w-4 h-4 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <div
      className="sticky top-0 w-full"
      style={{ zIndex: index + 1 }}
    >
      <div className="bg-[#f8f8f8] border-b border-[#d4d4d8]">
        <div className="max-w-screen-2xl mx-auto w-full px-4">
          <div className="flex flex-col md:flex-row items-stretch gap-8 md:gap-12 py-16 md:py-20 min-h-[70vh] md:min-h-[80vh]">
            {/* Text side */}
            <div className="flex flex-col justify-center md:w-[40%] shrink-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-brand flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#a1a1aa]">
                  {feature.label}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-[2.25rem] font-semibold tracking-tighter text-[#1a1a1f] leading-[1.15] mb-4">
                {feature.title}
              </h3>
              <p className="text-[15px] md:text-base text-[#52525b] leading-relaxed max-w-lg">
                {feature.description}
              </p>
            </div>

            {/* Image side */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full h-full min-h-[280px] md:min-h-[400px] bg-[#f0f0f2] border border-[#e4e4e7] flex items-center justify-center p-8 md:p-12">
                <Image
                  src={feature.imageSrc}
                  alt={feature.imageAlt}
                  width={600}
                  height={400}
                  className="w-full h-auto max-h-[360px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeatureCards() {
  return (
    <section className="relative bg-[#f8f8f8]">
      {FEATURES.map((feature, i) => (
        <FeatureCard key={feature.id} feature={feature} index={i} />
      ))}
    </section>
  );
}
