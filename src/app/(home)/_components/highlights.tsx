"use client";

import Image, { type ImageProps } from "next/image";
import unifiedKnowledgeImage from "@/assets/illustrations/unified-knowledge.svg";
import alignmentImage from "@/assets/illustrations/alignment.svg";
import misalignmentRadarImage from "@/assets/illustrations/misalignment-radar.svg";
function HighlightCard({
  title,
  subtitle,
  imageSrc,
}: {
  title: string;
  subtitle: string;
  imageSrc: ImageProps["src"];
}) {
  return (
    <div className="flex flex-col h-full gap-3">
      <div className="relative w-full">
        <Image
          src={imageSrc}
          alt={title}
          width={400}
          height={300}
          sizes="(min-width: 768px) 33vw, 100vw"
          className="w-full h-auto object-contain"
        />
      </div>
      <h3 className="text-xl text-foreground mb-2">{title}</h3>
      <p className="text-base text-secondary leading-relaxed">{subtitle}</p>
    </div>
  );
}

export default function Highlights() {
  return (
    <div className="max-w-screen-4xl mx-auto w-full px-4 mt-32">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl tracking-tight text-foreground mb-3">
          The memory system that truly understands your company
        </h2>
        <p className="text-lg text-secondary max-w-3xl">
          Sentra keeps everyone on the same page using first-of-its-kind memory
          technology
        </p>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        <HighlightCard
          title="A &quot;git log&quot; of your company's decisions"
          subtitle="Sentra understands how the company changes by creating a unified timeline of decisions and commitments."
          imageSrc={unifiedKnowledgeImage}
        />
        <HighlightCard
          title="A ground-zero understanding"
          subtitle="By being present with your team, Sentra learns your company's priorities and strategic context."
          imageSrc={alignmentImage}
        />
        <HighlightCard
          title="Identify risks in real time"
          subtitle="With real-time awareness, Sentra identifies conflicts and breakdowns before they become problems."
          imageSrc={misalignmentRadarImage}
        />
      </div>
    </div>
  );
}
