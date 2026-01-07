"use client";

import { fadeTransition, fadeVariants } from "@/app/_animations/fade-variants";

import HeroHeader from "./hero-header";
import Link from "next/link";
import { ResponsiveLogoCarousel } from "./by-variants";
import { motion } from "motion/react";
import { useAnimation } from "@/app/providers";
import { bookDemoUrl } from "@/utils/external-links";

export default function Hero() {
  const { isLoaded } = useAnimation();

  return (
    <section className="relative w-full h-screen flex flex-col text-background hero-gradient hero-grid-lines">
      <HeroHeader />
      <div className="flex-1 flex flex-col">
        <motion.div
          className="flex-1 flex flex-col"
          variants={fadeVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          transition={{ ...fadeTransition }}
        >
          <div className="relative z-10 flex-1 flex items-center pt-24 pb-8 sm:py-0">
            <div className="w-full max-w-screen-4xl mx-auto px-4">
              <div className="flex flex-col gap-4 xs:gap-6 max-w-2xl">
                <h1 className="leading-snug text-2xl s:text-3xl md:text-4xl lg:text-5xl font-medium">
                Empower your enterprise with organizational memory
                </h1>
                <p className="text-sm xs:text-base s:text-md md:text-lg text-background/80">
                Sentra is your organizational memory system that transforms your company&apos;s 
                collective knowledge, data and decisions into living intelligence. 
                </p>
                <Link
                  href={bookDemoUrl}
            target="_blank"
            rel="noreferrer"
                  className="w-fit mt-2 text-base bg-background text-foreground px-5 py-2 hover:brightness-80 duration-200 hover:cursor-pointer"
                >
                  Sentralize Your Company
                </Link>

                <div className="mt-8 sm:mt-12 overflow-hidden">
                  <p className="text-sm text-background/60 mb-4">
                    Shaped and backed by leaders of
                  </p>
                  <ResponsiveLogoCarousel />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
