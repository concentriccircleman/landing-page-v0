import type { Metadata } from "next";
import { createMetadata } from "@/utils/metadata";
import Hero from "./_components/hero";
import Highlights from "./_components/highlights";
import BentoGrid from "./_components/bento-grid";
import Security from "./_components/security";
import CTA from "./_components/cta";

export const metadata: Metadata = createMetadata({ canonical: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="bg-[#f8f8f8] py-24 md:py-32">
        <Highlights />
      </div>
      <div className="bg-[#f8f8f8] py-24 md:py-32 border-y border-[#ebebeb]">
        <BentoGrid />
      </div>
      <div className="bg-[#f8f8f8] py-24 md:py-32">
        <Security />
      </div>
      <CTA />
    </>
  );
}
