"use client";

import { fadeTransition, fadeVariants } from "@/app/_animations/fade-variants";
import Image from "next/image";
import Link from "next/link";
import sentraLogo from "@/assets/brand/sentra.png";
import MobileMenu from "@/components/mobile-menu";
import { motion } from "motion/react";
import { useAnimation } from "@/app/providers";
import { useEffect, useState } from "react";

const HeroHeader = () => {
  const { isLoaded } = useAnimation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const didScrollPastThreshold = window.scrollY > 10;
      if (didScrollPastThreshold !== isScrolled) {
        setIsScrolled(didScrollPastThreshold);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  return (
    <section
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${isScrolled ? "bg-foreground" : "bg-transparent"}`}
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
          <Image src={sentraLogo} alt="Sentra" width={30} height={30} />
          <span className="text-base font-medium">Sentra</span>
        </Link>

        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/login"
            className="h-8 inline-flex items-center text-xs bg-background text-foreground px-3 hover:brightness-80 duration-200 hover:cursor-pointer font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/contact"
            className="h-8 inline-flex items-center text-xs bg-primary-600 text-background px-3 hover:brightness-80 duration-200 hover:cursor-pointer font-medium"
          >
            Contact Sales
          </Link>
          <MobileMenu />
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <Link href="/manifesto" className="text-sm text-background hover:opacity-80 duration-200">
            Manifesto
          </Link>
          <Link
            href="/login"
            className="h-8 inline-flex items-center text-sm bg-background text-foreground px-3 hover:brightness-80 duration-200 w-fit hover:cursor-pointer"
          >
            Sign In
          </Link>
          <Link
            href="/contact"
            className="h-8 inline-flex items-center text-sm bg-primary-600 text-background px-3 hover:brightness-80 duration-200 w-fit hover:cursor-pointer"
          >
            Contact Sales
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroHeader;
