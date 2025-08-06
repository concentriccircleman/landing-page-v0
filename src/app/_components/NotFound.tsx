"use client";

import { fadeTransition, fadeVariants } from "@/app/_animations/fadeVariants";
import Link from "next/link";
import { motion } from "motion/react";
import { useAnimation } from "@/app/providers";

export default function NotFound() {
  const { isLoaded } = useAnimation();

  return (
    // negative margins counteract the py-8 and px-6/px-8 from layout to achieve full screen height
    <section className="w-full min-h-screen flex items-center justify-center -my-8 -mx-6 md:-mx-8 px-6 md:px-8">
      <div className="w-full max-w-2xl">
        <motion.div
          className="flex flex-col items-center text-center text-foreground"
          variants={fadeVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          transition={{ ...fadeTransition, delay: 0.2 }}
        >
          <h1 className="text-3xl/snug s:text-4xl/snug md:text-5xl/snug font-medium mb-4">
            Page not found
          </h1>
          <p className="text-foreground text-lg mb-8">
            The page you are looking for does not exist.
          </p>
          <Link href="/" className="text-lg underline hover:no-underline">
            Return Home
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
