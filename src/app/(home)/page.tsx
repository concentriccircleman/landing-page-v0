import type { Metadata } from "next";
import { createMetadata } from "@/utils/metadata";
import Hero from "./_components/hero";
import Storytelling from "./_components/storytelling";
import Highlights from "./_components/Highlights";
import BentoGrid from "./_components/bento-grid";
import Adoption from "./_components/Adoption";
import Security from "./_components/Security";
import CTA from "./_components/CTA";

export const metadata: Metadata = createMetadata({});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Storytelling />
      <Highlights />
      {/* <Adoption /> */}
      <BentoGrid />
      <Security />
      <CTA />
    </>
  );
}
