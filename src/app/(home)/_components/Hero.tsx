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
            <div className="w-full max-w-4xl px-4 sm:px-12 md:px-24 lg:px-32">
              <div className="flex flex-col gap-4 xs:gap-6">
                <h1 className="text-3xl/tight s:text-4xl/tight md:text-5xl/tight lg:text-6xl/tight font-medium">
                  Catch Misalignment Before It Costs You
                </h1>
                <p className="text-sm xs:text-base s:text-lg md:text-xl text-background/80">
                  Sentra is your AI teammate who creates a{" "}
                  <b>unified company memory</b>, remembering details everyone
                  forgot and alerting you when your teams are misaligned.
                </p>

                <Link
                  href="/signup"
                  className="w-fit mt-2 text-base bg-background text-foreground px-5 py-2 hover:brightness-80 duration-200 hover:cursor-pointer"
                >
                  Hire Sentra
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
