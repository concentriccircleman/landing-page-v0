import type { Metadata } from "next";
import { createMetadata } from "@/utils/metadata";
import Hero from "./_components/hero";
import Storytelling from "./_components/storytelling";
import Highlights from "./_components/highlights";
import BentoGrid from "./_components/bento-grid";
import Security from "./_components/security";
import CTA from "./_components/cta";

export const metadata: Metadata = createMetadata({ canonical: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <Storytelling />
      <Highlights />
      <BentoGrid />
      <Security />
      <CTA />
    </>
  );
}
