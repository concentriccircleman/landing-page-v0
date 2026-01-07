import NotFound from "./_components/not-found";
import type { Metadata } from "next";
import { createMetadata } from "@/utils/metadata";

export const metadata: Metadata = {
  ...createMetadata({ title: "Not Found" }),
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return <NotFound />;
}
