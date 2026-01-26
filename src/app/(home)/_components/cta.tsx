"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/utils/cn";
import Section from "@/components/section";

const testimonials = [
  "I've tried 5 other status report tools, yours is the only one that works. The one thing Sentra does well that others can't is that Sentra can contextualize what's important for me to know.",
  "Of all the AI tools that I've tried, Sentra is actually useful. I make a million promises across zoom meetings, slack, and emails--faster than I can write them down, and Sentra is the only tool that allowed me to start catching onto them.",
];

const DURATION_MS = 8000;

const CTA = () => {
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  useEffect(() => {
    const rotationTimer = setInterval(() => {
      setActiveTestimonialIndex((previousIndex) => (previousIndex + 1) % testimonials.length);
    }, DURATION_MS);

    return () => clearInterval(rotationTimer);
  }, [activeTestimonialIndex]);

  const handleTestimonialChange = (testimonialIndex: number) => {
    setActiveTestimonialIndex(testimonialIndex);
  };

  return (
    <Section>
      <div className="bg-primary-50 border border-primary-200 p-12 md:p-16 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-8">
          Sentralize Your Company
        </h2>

        <div className="max-w-3xl mx-auto mb-10">
          <div className="grid grid-cols-1">
            {testimonials.map((testimonialText, testimonialIndex) => (
              <div
                key={testimonialIndex}
                className={cn(
                  "col-start-1 row-start-1 transition-opacity duration-500 ease-in-out flex items-center justify-center",
                  testimonialIndex === activeTestimonialIndex
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0 select-none pointer-events-none"
                )}
                aria-hidden={testimonialIndex !== activeTestimonialIndex}
              >
                <p className="text-lg md:text-xl text-secondary leading-relaxed">
                  &ldquo;{testimonialText}&rdquo;
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, testimonialIndex) => (
              <button
                key={testimonialIndex}
                onClick={() => handleTestimonialChange(testimonialIndex)}
                className="relative h-1.5 w-12 overflow-hidden bg-foreground/15 hover:bg-foreground/25 hover:cursor-pointer transition-colors duration-300"
                aria-label={`Go to testimonial ${testimonialIndex + 1}`}
                aria-current={testimonialIndex === activeTestimonialIndex}
              >
                {testimonialIndex === activeTestimonialIndex && (
                  <motion.div
                    key={activeTestimonialIndex}
                    className="absolute inset-0 bg-brand"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: DURATION_MS / 1000, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3 text-lg font-medium hover:brightness-80 duration-200 hover:cursor-pointer"
        >
          Sentralize Your Company
        </Link>
      </div>
    </Section>
  );
};

export default CTA;
