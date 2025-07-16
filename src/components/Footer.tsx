import Link from "next/link";
import { ibmPlexMono } from "@/app/fonts";
declare const DelveCookieConsent: any;
const navLinks = [
  { path: "/", label: "Home" },
  // { path: "/about", label: "About" },
  { path: "/manifesto", label: "Manifesto" },
  { path: "/privacy", label: "Privacy" },
  { path: "/terms", label: "Terms" },
  {
    path: "https://trust.delve.co/sentra",
    target: "_blank",
    label: "Security",
  },
];

export default function Footer() {
  return (
    <section className="fixed bottom-0 left-0 w-full z-20">
      {/* <div className="absolute bottom-full w-full h-10 bg-gradient-to-t from-primary-600 to-transparent" /> */}
      <div className="w-full flex justify-between items-center px-8 py-4 pointer-events-auto bg-gray-100 text-black relative">
        <div className="hidden sm:flex justify-center items-center gap-8 relative z-10">
          {navLinks.map(({ path, label, target = undefined }) => (
            <Link
              key={path}
              href={path}
              target={target}
              scroll={false}
              className={`text-xs xs:text-sm text-black/80 underline hover:no-underline ${ibmPlexMono.className}`}
            >
              {label}
            </Link>
          ))}
          <button
            className={`text-xs xs:text-sm text-black/80 underline hover:no-underline hover:cursor-pointer ${ibmPlexMono.className}`}
            onClick={() => DelveCookieConsent.show()}
          >
            Cookie Settings
          </button>
        </div>
        <div
          className={`text-xs xs:text-sm text-black/80 relative z-10 ${ibmPlexMono.className}`}
        >
          2025 © Dynamis Labs.
        </div>
      </div>
    </section>
  );
}
