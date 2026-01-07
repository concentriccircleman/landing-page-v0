import type { Metadata } from "next";
import Terms from "./_components/terms";
import { createMetadata } from "@/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service",
  description:
    "Terms and conditions for using Sentra’s website and services, including eligibility, accounts, payments, and dispute resolution.",
  canonical: "/terms",
});

export default function TermsPage() {
  return <Terms />;
}
