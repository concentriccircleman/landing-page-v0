"use client";

import "./globals.css";

import Layout from "@/components/Layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://cdn.delve.co/src/delve-cookie-consent-default.js" />
        <script id="delve-cookie-init">
          {`
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
          `}
        </script>
      </head>
      <body>
        <Layout>{children}</Layout>

        {/* Delve Cookie Consent */}
      </body>
    </html>
  );
}
