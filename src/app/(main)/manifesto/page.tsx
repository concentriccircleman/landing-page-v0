import Manifesto from "./_components/manifesto";
import type { Metadata } from "next";
import { createMetadata } from "@/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "Manifesto",
  description:
    "Why misalignment quietly derails growing teams, and what Sentra believes about alignment, trust, and humane AI.",
  canonical: "/manifesto",
});

export default function ManifestoPage() {
  return <Manifesto />;
}
