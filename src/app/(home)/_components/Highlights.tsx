"use client";

import Image from "next/image";
function HighlightCard({
  title,
  subtitle,
  imageSrc,
}: {
  title: string;
  subtitle: string;
  imageSrc: string;
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
          Proactive AI, powered by memory
        </h2>
        <p className="text-lg text-secondary max-w-3xl">
          Sentra keeps everyone on the same page using first-of-its-kind memory
          technology
        </p>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        <HighlightCard
          title="Builds a memory of your company"
          subtitle="Sentra connects to your existing tools, creating a unified timeline of decisions and commitments."
          imageSrc="/unified-knowledge.svg"
        />
        <HighlightCard
          title="Combat misalignment in real time"
          subtitle="Through conversations with your team, Sentra learns your priorities and strategic context."
          imageSrc="/alignment.svg"
        />
        <HighlightCard
          title="Spots misalignment before it spreads"
          subtitle="With real-time awareness, Sentra identifies conflicts and breakdowns before they become problems."
          imageSrc="/action-log.svg"
        />
      </div>
    </div>
  );
}
