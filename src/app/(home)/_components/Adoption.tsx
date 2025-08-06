"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

const ANIMATION_DURATION = 7000; // in milliseconds

const features = [
  {
    title: "Connect your workspace tools",
    shortTitle: "Connect",
    body: "Integrate all your tools — Slack, Asana, Github, Google Calendar, Zoom, Discord, Linear, and more — in one seamless connection.",
  },
  {
    title: "Sentra meets you where you are",
    shortTitle: "Meets You",
    body: "Get contextual messages directly in your preferred platform. From Slack reminders to Discord summaries, Sentra adapts to your workflow.",
  },
  {
    title: "Assign her jobs that fit YOUR needs",
    shortTitle: "Custom Jobs",
    body: "Configure Sentra with personalized tasks — weekly summaries, follow-up reminders, status updates — tailored to each team member's role.",
  },
  {
    title: "Sentra works 24/7",
    shortTitle: "Always On",
    body: "While you sleep, Sentra juggles multiple jobs across your team, processing information and preparing insights around the clock.",
  },
  {
    title: "Get 1:1 support from the founders",
    shortTitle: "Direct Support",
    body: "We're committed to supercharging your productivity. Get immediate help via chat or hop on a call with our founding team.",
  },
];

function AdoptionPlaceholder({ type }: { type: string }) {
  return (
    <div className="flex items-center justify-center w-full h-full bg-primary-100">
      <div className="text-center text-primary-600">
        <div className="w-16 h-16 bg-primary-200 mx-auto mb-2"></div>
        <p className="text-sm font-medium">{type} Placeholder</p>
      </div>
    </div>
  );
}

export default function Adoption() {
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isPaused && !clicked) {
      startTimeRef.current = Date.now() - (progress * ANIMATION_DURATION);
      
      const updateProgress = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = Math.min(elapsed / ANIMATION_DURATION, 1);
        setProgress(newProgress);
        
        if (newProgress >= 1) {
          setSelectedFeature((prev) => (prev + 1) % features.length);
          setProgress(0);
          startTimeRef.current = Date.now();
        }
      };

      intervalRef.current = setInterval(updateProgress, 16); // ~60fps
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, clicked, progress]);

  const handleFeatureClick = (index: number) => {
    setClicked(true);
    setSelectedFeature(index);
    setProgress(0);
    startTimeRef.current = Date.now();
    
    setTimeout(() => {
      setClicked(false);
    }, 100);
  };

  return (
    <div className="max-w-screen-4xl mx-auto w-full px-4 mt-32">
      <div className="hidden md:block space-y-16">
        <div>
          <h2 className="text-2xl md:text-3xl tracking-tight text-foreground mb-4">
            Frictionless adoption
          </h2>
          <p className="text-lg text-secondary max-w-3xl">
            Simple self-service onboarding. Setup takes less than 4 minutes.
          </p>
        </div>
        <div className="flex flex-row gap-16">
          <div className="w-2/5 flex flex-col justify-between shrink-0">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="space-y-8">
                  <div className="h-px bg-border relative">
                    <motion.div
                      className="absolute inset-0 bg-primary-500 h-full"
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: selectedFeature === index ? `${progress * 100}%` : "0%" 
                      }}
                      transition={{ duration: 0, ease: "linear" }}
                    />
                  </div>
                  <button
                    className={cn(
                      "text-left space-y-3 transition-opacity duration-300 cursor-pointer",
                      selectedFeature === index
                        ? "opacity-100"
                        : "opacity-40"
                    )}
                    onClick={() => handleFeatureClick(index)}
                  >
                    <h3 className="text-xl tracking-tight text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-secondary leading-relaxed">
                      {feature.body}
                    </p>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary-50 border border-border overflow-hidden h-96 relative w-full">
            {features.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 transition-opacity duration-300",
                  selectedFeature === index ? "opacity-100" : "opacity-0"
                )}
              >
                <AdoptionPlaceholder type={`Feature ${index + 1}`} />
              </div>
            ))}
            
            {/* Pause Button */}
            <button
              className="absolute bottom-4 left-4 w-10 h-10 bg-secondary hover:bg-secondary/80 transition-colors duration-200 cursor-pointer flex items-center justify-center"
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? (
                <Play size={16} className="text-background" />
              ) : (
                <Pause size={16} className="text-background" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="md:hidden space-y-8">
        <div className="text-center">
          <h2 className="text-2xl tracking-tight text-foreground mb-4">
            Frictionless adoption
          </h2>
          <p className="text-lg text-secondary">
            Simple self-service onboarding. Setup takes less than 4 minutes.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="space-y-4 py-6 border-t border-border first:border-t-0"
            >
              <h3 className="text-xl tracking-tight text-foreground">{feature.title}</h3>
              <div className="h-48 bg-primary-50 border border-border">
                <AdoptionPlaceholder type={`Feature ${index + 1}`} />
              </div>
              <p className="text-sm text-secondary leading-relaxed">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}