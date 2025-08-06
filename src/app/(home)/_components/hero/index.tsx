"use client";

import { fadeTransition, fadeVariants } from "@/app/_animations/fadeVariants";

import HeroHeader from "./HeroHeader";
import Link from "next/link";
import { ResponsiveLogoCarousel } from "./ByVariants";
import { motion } from "motion/react";
import { useAnimation } from "@/app/providers";

export default function Hero() {
  const { isLoaded } = useAnimation();

  return (
    <section className="relative w-full min-h-screen flex flex-col text-background hero-gradient">
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
                <h1 className="leading-snug text-3xl s:text-4xl md:text-5xl lg:text-6xl font-medium">
                  Stay Aligned as You Scale
                </h1>
                <p className="text-sm xs:text-base s:text-lg md:text-xl text-background/80">
                  Sentra is your AI alignment officer who creates a{" "}
                  <b>unified company memory</b>, remembering details everyone
                  forgot and alerting you when your teams are misaligned.
                </p>

                <Link
                  href="/signup"
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
