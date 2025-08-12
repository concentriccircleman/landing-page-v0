"use client";

import { fadeTransition, fadeVariants } from "@/app/_animations/fadeVariants";

import { motion } from "motion/react";
import { useAnimation } from "@/app/providers";

export default function Contact() {
  const { isLoaded } = useAnimation();

  return (
    <section className="flex flex-col justify-center items-center text-foreground pointer-events-none h-full">
      <div className="px-4 max-w-3xl z-10 flex flex-col h-full w-full justify-center items-center pointer-events-auto overflow-y-auto">
        <motion.div
          className="flex flex-col"
          variants={fadeVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          transition={fadeTransition}
        >
          <h1 className="text-3xl/snug s:text-4xl/snug md:text-5xl/snug font-medium">
            Contact Us
          </h1>

          <p className="text-xl md:text-2xl text-foreground/60 mb-8 md:mb-12 font-light italic">
            Get in Touch
          </p>

          <p className="text-base text-foreground/80 mb-8">
            Have questions about Sentra? Want to learn more about how we can help your team? Need support? Send us an email and our team will get back to you as soon as possible.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-3">
              Email
            </h3>
            <a 
              href="mailto:contact@sentra.app" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              contact@sentra.app
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
