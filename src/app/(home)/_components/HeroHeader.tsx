"use client";

import { fadeTransition, fadeVariants } from "@/app/_animations/fadeVariants";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useAnimation } from "@/app/providers";

export default function HeroHeader() {
  const { isLoaded } = useAnimation();

  return (
    <section className="fixed top-0 left-0 w-full z-20">
      <motion.div
        className="w-full flex justify-between items-center px-8 py-4 pointer-events-auto"
        variants={fadeVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        transition={{ ...fadeTransition }}
      >
        <Link
          href="/"
          scroll={false}
          className="flex items-center gap-2 hover:opacity-80 duration-200"
        >
          <Image src="/sentra.png" alt="Sentra" width={30} height={30} />
          <span className="text-base font-medium">Sentra</span>
        </Link>

        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login">
            <button className="text-sm bg-foreground text-background px-3 py-1.5 hover:brightness-80 duration-200 w-fit">
              Sign In
            </button>
          </Link>
          <Link href="/signup">
            <button className="text-sm bg-primary-600 text-background px-3 py-1.5 hover:brightness-80 duration-200 w-fit">
              Sign Up
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
