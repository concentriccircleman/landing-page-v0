import type { Metadata } from "next";
import DataPrivacy from "./_components/data-privacy";
import { createMetadata } from "@/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "Data Privacy & Visibility",
  description:
    "An overview of how Sentra handles data privacy and visibility across roles, including what stays private and what is shared as summaries and insights.",
  canonical: "/data-privacy",
});

export default function DataPrivacyPage() {
  return <DataPrivacy />;
}
