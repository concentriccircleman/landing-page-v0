"use client";

import { ibmPlexMono } from "@/utils/fonts";
import CustomLink from "./ui/custom-link";

declare const DelveCookieConsent: {
  show: () => void;
};

interface LinkItem {
  path: string;
  label: string;
  target?: string;
}

interface FooterLinks {
  legal: LinkItem[];
  compliance: LinkItem[];
  company: LinkItem[];
}

const footerLinks: FooterLinks = {
  legal: [
    { path: "/terms", label: "Terms of Service" },
    { path: "/privacy", label: "Privacy Policy" },
  ],
  compliance: [
    // { path: "/data-transfer-agreement", label: "Data Transfer Agreement" },
    {
      path: "https://trust.delve.co/sentra",
      label: "Security",
    },
  ],
  company: [
    { path: "/about", label: "About" },
    { path: "/manifesto", label: "Manifesto" },
    { path: "/blog", label: "Blog" },
    { path: "https://jobs.ashbyhq.com/sentra", label: "Careers" },
    { path: "/data-privacy", label: "How We Handle Data" },
  ],
};

export default function Footer() {
  return (
    <footer className={`w-full z-20 ${ibmPlexMono.className} bg-foreground`}>
      <div className="max-w-screen-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-medium text-background mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map(({ path, label }) => (
                <li key={path}>
                  <CustomLink
                    href={path}
                    className="text-sm text-secondary hover:text-background transition-colors inline-block"
                  >
                    {label}
                  </CustomLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-background mb-4">
              Compliance
            </h3>
            <ul className="space-y-2">
              {footerLinks.compliance.map(({ path, label }) => (
                <li key={path}>
                  <CustomLink
                    href={path}
                    className="text-sm text-secondary hover:text-background transition-colors inline-block"
                  >
                    {label}
                  </CustomLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-background mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map(({ path, label }) => (
                <li key={path}>
                  <CustomLink
                    href={path}
                    className="text-sm text-secondary hover:text-background transition-colors inline-block"
                  >
                    {label}
                  </CustomLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-background mb-4">
              Preferences
            </h3>
            <button
              onClick={() => DelveCookieConsent.show()}
              className="text-sm text-secondary hover:text-background transition-colors text-left inline-block"
            >
              Cookie Settings
            </button>
          </div>
        </div>
        <p className="text-xs text-secondary mb-4">
          Subprocessors include Amazon Web Services, Github, Slack, Google Cloud
          Platform, and OpenAI.
        </p>
        <div className="pt-6 border-t border-secondary">
          <p className="text-xs text-secondary">
            &copy; {new Date().getFullYear()} Dynamis Labs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
