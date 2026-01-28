"use client";

import Link from "next/link";
import { ResponsiveInvestorLogoCarousel, ResponsiveLogoCarousel } from "./by-variants";
export default function Hero() {
  return (
    <section className="relative w-full flex flex-col text-background hero-gradient hero-grid-lines min-h-screen">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          <div className="relative z-10 flex-1 flex flex-col pt-24 2xs:pt-40 pb-16 sm:pt-24 sm:pb-12">
            <div className="w-full max-w-screen-2xl mx-auto px-4 flex-1 flex flex-col">
              <div className="flex-1 flex flex-col justify-center lg:pt-24">
                <div className="flex flex-col gap-4 xs:gap-6 max-w-2xl">
                  <h1 className="leading-snug text-2xl s:text-3xl md:text-4xl lg:text-5xl font-medium">
                    Empower your enterprise with organizational memory
                  </h1>
                  <p className="text-sm xs:text-base s:text-md md:text-lg text-background/80">
                    Sentra is your organizational memory system that transforms your
                    company&apos;s collective knowledge, data and decisions into living
                    intelligence.
                  </p>
                  <Link
                    href="/contact"
                    className="w-fit text-base bg-background text-foreground px-5 py-2 hover:opacity-80 duration-200 hover:cursor-pointer"
                  >
                    Book a demo
                  </Link>
                  <div className="mt-24 w-full flex flex-col space-y-8 items-start text-left">
                    <div className="w-full flex flex-col space-y-2">
                      <p className="text-sm text-background/60">Shaped and backed by leaders of</p>
                      <ResponsiveLogoCarousel />
                    </div>
                    <div className="w-full flex flex-col space-y-2">
                      <p className="text-sm text-background/60">Backed by</p>
                      <ResponsiveInvestorLogoCarousel />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
