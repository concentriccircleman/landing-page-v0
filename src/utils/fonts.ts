import { Geist, Geist_Mono } from "next/font/google";

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-geist-mono",
});

/** @deprecated Use geist instead */
export const manrope = geist;
/** @deprecated Use geistMono instead */
export const ibmPlexMono = geistMono;
