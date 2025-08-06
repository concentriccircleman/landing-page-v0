"use client";

import { fadeTransition, fadeVariants } from "@/app/_animations/fadeVariants";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useAnimation } from "@/app/providers";
import { useState, useEffect } from "react";

export default function HeroHeader() {
  const { isLoaded } = useAnimation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    // Initial check
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  return (
    <section 
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-foreground' : 'bg-transparent'
      }`}
    >
      <motion.div
        className="w-full max-w-screen-4xl mx-auto flex justify-between items-center p-4 pointer-events-auto text-background"
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

        <div className="hidden sm:flex items-center gap-4">
          <Link href="/manifesto" className="text-sm text-background hover:opacity-80 duration-200">
            Manifesto
          </Link>
          <Link href="/login">
            <button className="text-sm bg-background text-foreground px-3 py-1.5 hover:brightness-80 duration-200 w-fit hover:cursor-pointer">
              Sign In
            </button>
          </Link>
          <Link href="/signup">
            <button className="text-sm bg-primary-600 text-foreground px-3 py-1.5 hover:brightness-80 duration-200 w-fit hover:cursor-pointer">
              Sign Up
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
