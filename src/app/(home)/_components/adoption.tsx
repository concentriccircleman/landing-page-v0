"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import integrationsImage from "@/assets/illustrations/integrations.svg";
import whereYouAreImage from "@/assets/illustrations/where-you-are.svg";
import assignJobsImage from "@/assets/illustrations/assign-jobs.svg";
import founderSupportImage from "@/assets/illustrations/founder-support.svg";

const ANIMATION_DURATION = 7000; // in milliseconds

const features = [
  {
    title: "Integrations",
    shortTitle: "Integrations",
    body: "Seamlessly connects with your existing tools - Slack, Google Workspace, Microsoft 365, and more.",
  },
  {
    title: "Where You Are",
    shortTitle: "Where You Are",
    body: "Works within your existing workflows and tools - no need to switch contexts or learn new interfaces.",
  },
  {
    title: "Assign Jobs",
    shortTitle: "Assign Jobs",
    body: "Delegate tasks to Sentra just as you would to a trusted team member. She handles them autonomously while keeping you informed.",
  },
  {
    title: "Founder Support",
    shortTitle: "Founder Support",
    body: "Provides the institutional knowledge and operational support that founders need to scale their teams effectively.",
  },
];

function AdoptionImage({ featureIndex }: { featureIndex: number }) {
  const imageSources = [
    integrationsImage,
    whereYouAreImage,
    assignJobsImage,
    founderSupportImage,
  ];

  const imageAlts = [
    "Integrations visualization",
    "Where you are visualization",
    "Assign jobs visualization",
    "Founder support visualization",
  ];

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-fit h-fit flex items-center justify-center md:scale-150">
        <Image
          src={imageSources[featureIndex]}
          alt={imageAlts[featureIndex]}
          width={400}
          height={300}
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default function Adoption() {
  const [selectedFeature, setSelectedFeature] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!clicked) {
      startTimeRef.current = Date.now() - progress * ANIMATION_DURATION;

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
  }, [clicked, progress]);

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
      <div className="hidden md:block">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl tracking-tight text-foreground mb-3">
            Frictionless adoption
          </h2>
          <p className="text-lg text-secondary max-w-3xl">
            Simple self-service onboarding. Setup takes less than 4 minutes.
          </p>
        </div>
        <div className="flex flex-row gap-8 items-start">
          <div className="w-2/5 flex flex-col justify-between shrink-0">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="space-y-8">
                  <div className="h-px bg-border relative">
                    <motion.div
                      className="absolute inset-0 bg-primary-500 h-full"
                      initial={{ width: "0%" }}
                      animate={{
                        width:
                          selectedFeature === index
                            ? `${progress * 100}%`
                            : "0%",
                      }}
                      transition={{ duration: 0, ease: "linear" }}
                    />
                  </div>
                  <button
                    className={cn(
                      "text-left space-y-3 transition-opacity duration-300 cursor-pointer",
                      selectedFeature === index ? "opacity-100" : "opacity-40"
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

          <div className="overflow-hidden h-96 relative w-full flex items-center justify-center self-center">
            {features.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 transition-opacity duration-300 flex items-center justify-center",
                  selectedFeature === index ? "opacity-100" : "opacity-0"
                )}
              >
                <AdoptionImage featureIndex={index} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="mb-8">
          <h2 className="text-3xl tracking-tight text-foreground mb-3">
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
              <h3 className="text-xl tracking-tight text-foreground">
                {feature.title}
              </h3>
              <div className="h-48">
                <AdoptionImage featureIndex={index} />
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
