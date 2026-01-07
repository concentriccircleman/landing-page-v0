import type { Metadata } from "next";
import { siteUrl } from "@/utils/site-url";

interface MetadataProps {
  title?: string;
  description?: string;
  canonical?: string;
}

const defaultMetadata = {
  title: "Sentra",
  description:
    "Sentra is your AI teammate who creates a unified company memory, remembering details everyone forgot and alerting you when your teams are misaligned.",
};

export const createMetadata = ({
  title = defaultMetadata.title,
  description,
  canonical,
}: MetadataProps): Metadata => {
  const finalTitle =
    title !== defaultMetadata.title
      ? `${title} - ${defaultMetadata.title}`
      : defaultMetadata.title;

  const canonicalUrl =
    typeof canonical === "string" && canonical.length > 0
      ? canonical.startsWith("http")
        ? canonical
        : `${siteUrl}${canonical}`
      : undefined;

  const finalDescription =
    description ??
    (title !== defaultMetadata.title
      ? `${title} - ${defaultMetadata.description}`
      : defaultMetadata.description);

  return {
    metadataBase: new URL(siteUrl),
    title: finalTitle,
    description: finalDescription,
    alternates: canonicalUrl ? { canonical } : undefined,
    keywords: [
      "sentra",
      "ai teammate",
      "institutional knowledge",
      "company memory",
      "ai assistant",
      "team productivity",
      "knowledge management",
      "company drift",
      "ai tools",
      "business intelligence",
      "team collaboration",
      "knowledge documentation",
    ],
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      siteName: "Sentra",
      type: "website",
      url: canonicalUrl,
      images: [
        {
          url: `${siteUrl}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: "Sentra",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [`${siteUrl}/twitter-image.png`],
      site: "@sentra_app",
      creator: "@sentra_app",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
};
