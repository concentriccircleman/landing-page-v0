"use client";

import { fadeTransition, fadeVariants } from "@/app/_animations/fadeVariants";

import HeroFooter from "./HeroFooter";
import HeroHeader from "./HeroHeader";
import { ResponsiveLogoCarousel } from "./ByVariants";
import { motion } from "motion/react";
import { useAnimation } from "@/app/providers";

export default function Hero() {
  const { isLoaded } = useAnimation();

  return (
    <section className="relative w-full h-full text-foreground hero-gradient">
      <HeroHeader />

      <div className="relative z-10 flex flex-col w-full h-full text-foreground bg-transparent justify-center items-start pointer-events-auto">
        <div className="mt-24 mb-16 xs:my-16 px-8 max-w-2xl h-full flex items-center">
          <div className="flex flex-col gap-6">
            <motion.h1
              className="text-3xl/tight s:text-4xl/tight md:text-5xl/tight lg:text-6xl/tight font-medium"
              variants={fadeVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              transition={{ ...fadeTransition }}
            >
              Your Company&apos;s Superintelligence
            </motion.h1>
            <motion.p
              className="text-sm xs:text-base s:text-lg md:text-xl text-foreground/80"
              variants={fadeVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              transition={{ ...fadeTransition }}
            >
              Sentra is your AI teammate who creates a{" "}
              <b>unified company memory</b>, remembering details everyone forgot
              and alerting you when your teams are misaligned.
            </motion.p>

            <motion.a
              variants={fadeVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              transition={{ ...fadeTransition }}
              href="/signup"
              className="w-fit"
            >
              <motion.button className="text-base bg-foreground text-background px-5 py-2 hover:brightness-80 duration-200 w-fit">
                Hire Sentra
              </motion.button>
            </motion.a>

            <motion.div
              className="mt-12 overflow-hidden"
              variants={fadeVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              transition={{ ...fadeTransition }}
            >
              <p className="text-sm text-foreground/60 mb-4">
                Shaped and backed by former leaders of
              </p>
              <ResponsiveLogoCarousel />
            </motion.div>
          </div>
        </div>
      </div>

      <HeroFooter />
    </section>
  );
}
