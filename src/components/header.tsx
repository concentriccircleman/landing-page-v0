"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import sentraLogo from "@/assets/brand/sentra.png";
import MobileMenu from "@/components/mobile-menu";
import { cn } from "@/utils/cn";

const Header = () => {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const handler = () => setAtTop(window.scrollY < 60);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const outerClasses = cn(
    "fixed z-40 left-1/2 -translate-x-1/2 w-full",
    "transition-[max-width,top,border-radius,background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",

    atTop && "top-0 max-w-[100vw] rounded-none border-b backdrop-blur-xl bg-[#f8f8f8]/80 border-[#e0e0e0]/60",

    !atTop && "top-3 max-w-[calc(100vw-24px)] sm:max-w-3xl rounded-[18px] backdrop-blur-2xl bg-[#f4f4f5]/70 shadow-[0_0_0_0.5px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08),0_16px_48px_rgba(0,0,0,0.04)]",
  );

  const innerClasses = cn(
    "flex justify-between items-center pointer-events-auto text-foreground",
    "transition-[padding] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
    atTop ? "max-w-screen-2xl mx-auto p-4" : "px-4 py-2.5",
  );

  return (
    <section className={outerClasses}>
      <div className={innerClasses}>
        <Link
          href="/"
          scroll={false}
          className="flex items-center gap-2 hover:opacity-80 duration-200 sm:justify-self-start"
        >
          <Image src={sentraLogo} alt="Sentra" width={28} height={28} />
          <span className="text-[14px] font-semibold tracking-tight">Sentra</span>
        </Link>

        <div className="flex sm:hidden items-center gap-2">
          <MobileMenu />
        </div>

        <div className="hidden sm:flex items-center justify-end gap-2.5">
          <Link href="/manifesto" className="text-[13px] font-medium hover:opacity-80 duration-150 px-2">
            Manifesto
          </Link>
          <Link
            href="/login"
            className="h-8 inline-flex items-center text-[13px] font-medium px-3.5 rounded-lg duration-200 hover:cursor-pointer transition-all active:scale-[0.97] bg-white text-[#1a1a1f] hover:bg-[#f4f4f5] shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04),inset_0_0.75px_0_rgba(255,255,255,0.6)]"
          >
            Sign In
          </Link>
          <Link
            href="/contact"
            className="h-8 inline-flex items-center text-[13px] font-medium bg-brand text-[#f0f0f0] px-3.5 rounded-lg duration-200 hover:brightness-110 hover:cursor-pointer shadow-[0_0_0_1px_#1e40af,0_2px_4px_rgba(37,99,235,0.3),0_6px_16px_rgba(37,99,235,0.2),0_10px_24px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all active:scale-[0.97] focus-visible:ring-[3px] focus-visible:ring-[rgba(37,99,235,0.2)]"
          >
            Get a Demo
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Header;
