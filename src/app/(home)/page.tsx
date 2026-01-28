import type { Metadata } from "next";
import { createMetadata } from "@/utils/metadata";
import Hero from "./_components/hero";
import Highlights from "./_components/highlights";
import BentoGrid from "./_components/bento-grid";
import Security from "./_components/security";
import CTA from "./_components/cta";
// import Testimonial from "./_components/testimonial";

export const metadata: Metadata = createMetadata({ canonical: "/" });

export default function HomePage() {
  return (
    <>
      <Hero />
      <Highlights />
      <BentoGrid />
      <Security />
      {/* <Testimonial /> */}
      <CTA />
    </>
  );
}
