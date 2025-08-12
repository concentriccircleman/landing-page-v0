import Contact from "./_components/Contact";
import type { Metadata } from "next";
import { createMetadata } from "@/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description:
    "Get in touch with Sentra. Have questions about Sentra? Want to learn more about how we can help your team? Need support? Send us an email and our team will get back to you as soon as possible.",
});

export default function ContactPage() {
  return <Contact />;
}
