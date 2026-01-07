import type { Metadata } from "next";
import Privacy from "./_components/privacy";
import { createMetadata } from "@/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "How Dynamis Labs, Inc. (Sentra) collects, uses, and discloses information when you use our website and services.",
  canonical: "/privacy",
});

export default function PrivacyPage() {
  return <Privacy />;
}
