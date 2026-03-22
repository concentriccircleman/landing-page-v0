"use client";

import React, { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { AnimatePresence, motion } from "motion/react";
import unifiedKnowledgeImage from "@/assets/illustrations/unified-knowledge.svg";
import alignmentImage from "@/assets/illustrations/alignment.svg";
import misalignmentRadarImage from "@/assets/illustrations/misalignment-radar.svg";

interface Feature {
  id: string;
  tab: string;
  title: string;
  description: string;
  imageSrc: ImageProps["src"];
  icon: React.ReactNode;
}

const FEATURES: Feature[] = [
  {
    id: "memory",
    tab: "Unified Memory",
    title: "A \"git log\" of your company's decisions",
    description:
      "Sentra understands how the company changes by creating a unified timeline of decisions and commitments. Every meeting, document, and conversation becomes part of a living record that your entire organization can draw from.",
    imageSrc: unifiedKnowledgeImage,
    icon: <svg className="w-4 h-4 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3zm0 5h16" /></svg>,
  },
  {
    id: "alignment",
    tab: "Strategic Alignment",
    title: "A ground-zero understanding of your company",
    description:
      "By being present with your team, Sentra learns your company's priorities and strategic context. It connects the dots across departments, ensuring everyone shares the same understanding of what matters most.",
    imageSrc: alignmentImage,
    icon: <svg className="w-4 h-4 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
  },
  {
    id: "risk",
    tab: "Risk Detection",
    title: "Identify risks and conflicts in real time",
    description:
      "With real-time awareness across your organization, Sentra identifies conflicting priorities, missed commitments, and communication breakdowns before they become costly problems.",
    imageSrc: misalignmentRadarImage,
    icon: <svg className="w-4 h-4 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  },
];

export default function Highlights() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = FEATURES[activeIndex];

  return (
    <div className="max-w-screen-2xl mx-auto w-full px-4">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-brand flex items-center justify-center">
            <svg className="w-4 h-4 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter text-[#1a1a1f]">
            The memory system that truly understands your company
          </h2>
        </div>
        <p className="text-[15px] md:text-base text-[#52525b] max-w-3xl leading-relaxed">
          Sentra keeps everyone on the same page using first-of-its-kind memory
          technology
        </p>
      </div>

      <div className="flex gap-2 mb-8 border-b border-[#d4d4d8]">
        {FEATURES.map((feature, i) => (
          <button
            key={feature.id}
            onClick={() => setActiveIndex(i)}
            className={`
              relative px-5 py-3 text-[13px] font-medium transition-colors duration-200
              ${i === activeIndex
                ? "text-[#1a1a1f]"
                : "text-[#71717a] hover:text-[#52525b]"
              }
            `}
          >
            {feature.tab}
            {i === activeIndex && (
              <motion.div
                layoutId="highlight-tab-underline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden border border-[#d4d4d8] bg-[#f8f8f8]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-10"
          >
            <div className="flex-1 order-2 md:order-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-brand flex items-center justify-center flex-shrink-0">
                  {active.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#1a1a1f] tracking-tighter">
                  {active.title}
                </h3>
              </div>
              <p className="text-[14px] md:text-[15px] text-[#52525b] leading-relaxed">
                {active.description}
              </p>
            </div>
            <div className="flex-1 order-1 md:order-2 flex items-center justify-center">
              <Image
                src={active.imageSrc}
                alt={active.title}
                width={480}
                height={360}
                className="w-full max-w-md h-auto object-contain"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
