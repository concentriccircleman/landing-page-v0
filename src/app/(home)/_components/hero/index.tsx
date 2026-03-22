"use client";

import Link from "next/link";
import HeroDemo from "./HeroDemo";
import { StaticInvestorRow } from "./by-variants";

export default function Hero() {
  return (
    <section className="relative w-full flex flex-col bg-[#f8f8f8] min-h-screen overflow-hidden">
      {/* Demo UI — positioned relative to viewport, bleeds off right edge */}
      <div className="hidden md:block absolute top-[18%] bottom-[18%] left-[56%] -right-[15%] z-0">
        <HeroDemo />
      </div>
      <div className="relative z-10 flex-1 flex flex-col pt-32 2xs:pt-44 pb-16 sm:pt-32 sm:pb-16">
        <div className="w-full max-w-screen-2xl mx-auto px-4 flex-1 flex flex-col">
          <div className="flex-1 flex flex-col md:flex-row items-center gap-8 relative">
            <div className="flex flex-col items-center md:items-start text-center md:text-left justify-center md:w-[50%] relative z-10">
              <div className="flex flex-col items-center md:items-start gap-6">
                <a
                  href="https://www.linkedin.com/feed/update/urn:li:activity:7422322649269350400/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2 px-4 py-1.5 rounded-lg
                    bg-[#eff6ff] border border-[#bfdbfe] overflow-hidden
                    hover:border-[#93c5fd] transition-colors duration-300"
                >
                  <div className="absolute inset-0 rounded-lg"
                    style={{
                      background: 'conic-gradient(from var(--circuit-angle, 0deg), transparent 0%, rgba(59,130,246,0.35) 10%, transparent 20%)',
                      animation: 'circuit-spin 3s linear infinite',
                    }}
                  />
                  <div className="absolute inset-[1px] rounded-[7px] bg-[#eff6ff]" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-[#3b82f6] shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
                  <span className="relative text-[12px] font-semibold tracking-wide text-[#1d4ed8]">
                    Announcing our $5M Seed Round
                  </span>
                  <svg className="relative w-3 h-3 text-[#3b82f6]/60 group-hover:text-[#1d4ed8] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                <h1 className="leading-[1.1] text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.5rem] font-semibold tracking-tighter text-[#1a1a1f]">
                  Empower your enterprise with organizational memory
                </h1>
                <p className="text-[15px] xs:text-base s:text-[17px] md:text-lg text-[#a1a1aa] leading-relaxed max-w-xl">
                  Sentra is your organizational memory system that transforms your
                  company&apos;s collective knowledge, data and decisions into living
                  intelligence.
                </p>
                <Link
                  href="/contact"
                  className="mt-4 text-[14px] font-medium bg-brand text-[#f0f0f0] px-8 py-3 rounded-lg duration-200 hover:cursor-pointer shadow-[0_0_0_1px_#1e40af,0_2px_4px_rgba(37,99,235,0.3),0_6px_16px_rgba(37,99,235,0.2),0_12px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_0_0_1px_#1e40af,0_4px_8px_rgba(37,99,235,0.35),0_10px_24px_rgba(37,99,235,0.25),0_16px_40px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.25)] hover:brightness-110 transition-all active:scale-[0.97] focus-visible:ring-[3px] focus-visible:ring-[rgba(37,99,235,0.2)]"
                >
                  Book a demo
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-20 w-full max-w-3xl mx-auto flex flex-col items-center gap-3">
            <p className="text-[10px] uppercase tracking-[0.15em] font-medium text-[#a1a1aa]">
              Backed by
            </p>
            <StaticInvestorRow />
          </div>
        </div>
      </div>
    </section>
  );
}
