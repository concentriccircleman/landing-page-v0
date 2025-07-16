"use client";

import { fadeTransition, fadeVariants } from "@/app/_animations/fadeVariants";

import Link from "next/link";
import { ibmPlexMono } from "@/app/fonts";
import { motion } from "motion/react";
import { useAnimation } from "@/app/providers";
declare const DelveCookieConsent: any;

export default function HeroFooter() {
  const { isLoaded } = useAnimation();

  return (
    <motion.div
      className="absolute bottom-0 left-0 w-full flex justify-between items-center px-8 py-4 pointer-events-auto z-10"
      variants={fadeVariants}
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      transition={{ ...fadeTransition }}
    >
      <div
        className={`hidden sm:flex justify-center items-center gap-8 ${ibmPlexMono.className}`}
      >
        <Link
          href="/"
          className="text-xs xs:text-sm text-foreground/80 underline hover:no-underline"
        >
          Home
        </Link>

        <Link
          href="/manifesto"
          className="text-xs xs:text-sm text-foreground/80 underline hover:no-underline"
        >
          Manifesto
        </Link>
        <Link
          href="/privacy"
          className="text-xs xs:text-sm text-foreground/80 underline hover:no-underline"
        >
          Privacy
        </Link>
        <Link
          href="/terms"
          className="text-xs xs:text-sm text-foreground/80 underline hover:no-underline"
        >
          Terms
        </Link>
        <Link
          href="https://trust.delve.co/sentra"
          target="_blank"
          className="text-xs xs:text-sm text-foreground/80 underline hover:no-underline"
        >
          Security
        </Link>
        <button
          className="text-xs xs:text-sm text-foreground/80 underline hover:no-underline hover:cursor-pointer"
          onClick={() => DelveCookieConsent.show()}
        >
          Cookie Settings
        </button>
      </div>
      <p
        className={`hidden sm:block text-xs xs:text-sm text-foreground/80 ${ibmPlexMono.className}`}
      >
        2025 © Dynamis Labs.
      </p>
      <div className="flex sm:hidden flex-col 2xs:items-end 2xs:w-full s:flex-row s:justify-between s:items-center gap-2 s:gap-4">
        <div className={`flex items-center gap-4 ${ibmPlexMono.className}`}>
          <Link
            href="/privacy"
            className="text-xs xs:text-sm text-foreground/80 underline hover:no-underline"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-xs xs:text-sm text-foreground/80 underline hover:no-underline"
          >
            Terms
          </Link>
        </div>
        <p
          className={`text-xs xs:text-sm text-foreground/80 ${ibmPlexMono.className}`}
        >
          2025 © Dynamis Labs.
        </p>
      </div>
    </motion.div>
  );
}
