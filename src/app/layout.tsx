import "@/app/globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import Layout from "@/components/layout";
import { geist, geistMono } from "@/utils/fonts";
import { createMetadata } from "@/utils/metadata";
import JsonLd from "@/components/seo/json-ld";
import { siteUrl } from "@/utils/site-url";

export const metadata: Metadata = createMetadata({ canonical: "/" });

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;

  const organizationJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: "Sentra",
    url: siteUrl,
    logo: `${siteUrl}/sentra.png`,
    sameAs: ["https://x.com/sentra_app"],
  };

  const websiteJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    url: siteUrl,
    name: "Sentra",
    publisher: { "@id": organizationId },
    inLanguage: "en",
  };

  return (
    <html lang="en">
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Sentra Blog RSS"
          href={`${siteUrl}/feed.xml`}
        />
        <JsonLd id="organization-jsonld" data={organizationJsonLd} />
        <JsonLd id="website-jsonld" data={websiteJsonLd} />
        <Script
          src="https://cdn.delve.co/src/delve-cookie-consent-default.js"
          strategy="beforeInteractive"
        />
        <Script
          id="delve-cookie-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            if (typeof DelveCookieConsent !== 'undefined') {
              DelveCookieConsent.init({
                message: "We use cookies to enhance your experience, analyze our traffic and keep your data secure.",
                privacyPolicyUrl: "https://sentra.app/privacy",
                manageScriptTags: true,
                preferencesDisplayMode: "button",
                showInNonRegulatedRegions: true,
                categories: {
                  necessary: {
                    enabled: true,
                    cookieTable: {
                      cookies: [
                        {
                          name: "delve_cookie_consent",
                          purpose: "Stores your cookie preferences",
                          duration: "1 year",
                        },
                        {
                          name: "fbssls_*",
                          purpose: "Tracks session status",
                          duration: "Session",
                        },
                      ],
                    },
                  },
                  analytics: {
                    enabled: false,
                    cookieTable: {
                      cookies: [
                        {
                          name: "ph_*",
                          purpose: "PostHog analytics cookie",
                          duration: "1 year",
                        },
                      ],
                    },
                  },
                },
              });
            }
          `,
          }}
        />
      </head>
      <body className={`${geist.className} ${geistMono.variable} antialiased`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
};

export default RootLayout;
