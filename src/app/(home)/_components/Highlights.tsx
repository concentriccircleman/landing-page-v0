"use client";

import Image from "next/image";
function HighlightCard({ title, subtitle, imageSrc }: { title: string; subtitle: string; imageSrc: string }) {
  return (
    <div className="text-left">
      <div className="flex items-center justify-center h-48 bg-primary-100 mb-4">
        <div className="w-fit h-fit bg-primary-200 flex items-center justify-center">
          <Image src={imageSrc} alt={title} width={500} height={300} className="object-contain" />
        </div>
      </div>
      <h3 className="text-lg text-foreground mb-3">
        {title}
      </h3>
      <p className="text-sm text-secondary leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

export default function Highlights() {
  return (
    <div className="max-w-screen-4xl mx-auto w-full px-4 mt-32">
      <div className="mb-44">
        <h2 className="text-2xl md:text-3xl tracking-tight text-foreground mb-3">
          Proactive AI, powered by memory
        </h2>
        <p className="text-lg text-secondary max-w-3xl">
          Sentra keeps everyone on the same page using first-of-its-kind memory technology
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <HighlightCard 
          title="Shared team memory"
          subtitle="Sentra sits in all your tools — writing a history book of your company."
          imageSrc="/unified-knowledge.svg"
        />
        <HighlightCard 
          title="Combat misalignment in real time"
          subtitle="Sentra detects when team efforts drift from goals and alerts leaders before problems compound."
          imageSrc="/alignment.svg"
        />
        <HighlightCard 
          title="A memory that remembers your preferences"
          subtitle="Sentra learns each person's role and preferences, tailoring how it assists and what it remembers for everyone."
          imageSrc="/preferences.svg"
        />
      </div>
    </div>
  );
}