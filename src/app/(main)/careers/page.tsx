import Careers from "./_components/careers";
import type { Metadata } from "next";
import { createMetadata } from "@/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "Careers",
  description:
    "Join Sentra and help build an AI teammate that listens, learns, and alerts teams before they drift.",
  canonical: "/careers",
});

export default function CareersPage() {
  return <Careers />;
}

