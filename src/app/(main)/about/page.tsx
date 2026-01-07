import About from "./_components/about";
import type { Metadata } from "next";
import { createMetadata } from "@/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "About",
  description:
    "Sentra is your AI teammate that listens, learns, and alerts you when your company drifts — before you even notice. It creates a memory of your company's institutional knowledge, memorializing and documenting details everyone forgets.",
  canonical: "/about",
});

export default function AboutPage() {
  return <About />;
}
