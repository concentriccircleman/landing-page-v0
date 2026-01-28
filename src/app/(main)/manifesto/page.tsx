import Manifesto from "./_components/manifesto";
import type { Metadata } from "next";
import { createMetadata } from "@/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "Manifesto",
  description:
    "Sentra builds organizational memory that learns. Moving beyond static archives to an operational nervous system that understands how your company actually works.",
  canonical: "/manifesto",
});

export default function ManifestoPage() {
  return <Manifesto />;
}
