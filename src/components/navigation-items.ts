export interface NavigationItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export const resourcesNavigationItems: NavigationItem[] = [
  { label: "Security", href: "https://trust.delve.co/sentra", isExternal: true },
  { label: "Careers", href: "/careers" },
  { label: "Manifesto", href: "/manifesto" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

