import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/utils/cn";
import Image, { type ImageProps } from "next/image";
import { CSSProperties } from "react";

import googleLogo from "@/assets/logos/google-logo.svg";
import instacartLogo from "@/assets/logos/instacart-logo.webp";
import microsoftLogo from "@/assets/logos/microsoft-logo.svg";
import motorolaLogo from "@/assets/logos/motorola-logo.webp";
import qualcommLogo from "@/assets/logos/qualcomm-logo.svg";
import salesforceLogo from "@/assets/logos/salesforce-logo.svg";
import xLogo from "@/assets/logos/x-logo.svg";
import a16zSpeedrunLogo from "@/assets/investors/a16z-speedrun.svg";
import togetherFundLogo from "@/assets/investors/together-fund.svg";
import togetherXA16zLogo from "@/assets/investors/together-x-a16z.svg";


interface MarqueeStyle extends CSSProperties {
  "--duration"?: string;
  "--gap"?: string;
}

interface LogoItem {
  id: string;
  src: ImageProps["src"];
  alt: string;
  shouldInvert?: boolean;
}

const MAIN_INVESTOR_LOGOS: LogoItem[] = [
  { id: "a16z-speedrun", src: a16zSpeedrunLogo, alt: "a16z Speedrun logo" },
  { id: "together-fund", src: togetherFundLogo, alt: "Together Fund logo" },
];

const ANGEL_LOGOS: LogoItem[] = [
  { id: "google", src: googleLogo, alt: "Google logo" },
  { id: "microsoft", src: microsoftLogo, alt: "Microsoft logo" },
  { id: "x", src: xLogo, alt: "X logo", shouldInvert: true },
  { id: "motorola", src: motorolaLogo, alt: "Motorola logo", shouldInvert: true },
  { id: "qualcomm", src: qualcommLogo, alt: "Qualcomm logo" },
  { id: "salesforce", src: salesforceLogo, alt: "Salesforce logo" },
  { id: "instacart", src: instacartLogo, alt: "Instacart logo" },
];

const heroAngelMarqueeMobileStyle: MarqueeStyle = {
  "--duration": "75s",
  "--gap": "0.5rem",
};

const heroAngelMarqueeDesktopStyle: MarqueeStyle = {
  "--duration": "75s",
  "--gap": "0.5rem",
};

export function ResponsiveLogoCarousel() {
  return (
    <div className="w-full">
      {/* Mobile: Moving marquee */}
      <div className="flex justify-start lg:hidden">
        <Marquee
          className="py-2 w-full"
          style={heroAngelMarqueeMobileStyle}
          repeat={6}
        >
          {ANGEL_LOGOS.map((angelLogo) => (
            <div
              key={angelLogo.id}
              className="mx-4 z-40 select-none h-6 w-28 flex items-center justify-center"
            >
              <Image
                src={angelLogo.src}
                alt={angelLogo.alt}
                width={180}
                height={28}
                className={cn(
                  "h-full w-full object-contain",
                  angelLogo.shouldInvert ? "invert" : "",
                )}
              />
            </div>
          ))}
        </Marquee>
      </div>

      {/* Desktop: Moving marquee */}
      <div className="hidden lg:flex justify-start">
        <Marquee
          className="py-2 w-full"
          style={heroAngelMarqueeDesktopStyle}
          repeat={6}
        >
          {ANGEL_LOGOS.map((angelLogo) => (
            <div
              key={angelLogo.id}
              className="mx-4 z-40 select-none h-8 w-36 flex items-center justify-center"
            >
              <Image
                src={angelLogo.src}
                alt={angelLogo.alt}
                width={220}
                height={28}
                className={cn(
                  "h-full w-full object-contain",
                  angelLogo.shouldInvert ? "invert" : "",
                )}
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

export function ResponsiveInvestorLogoCarousel() {
  return (
    <div className="w-full">
      <div className="py-2 w-full flex justify-start">
        <div className="flex flex-col xs:hidden items-center justify-center gap-y-4">
          {MAIN_INVESTOR_LOGOS.map((investorLogo) => (
            <Image
              key={investorLogo.id}
              src={investorLogo.src}
              alt={investorLogo.alt}
              width={220}
              height={28}
              className="h-6 w-auto z-40 select-none"
            />
          ))}
        </div>
        <div className="hidden xs:flex items-center justify-start">
          <Image
            src={togetherXA16zLogo}
            alt="Together Fund and a16z Speedrun"
            className="h-6 lg:h-8 w-auto z-40 select-none"
          />
        </div>
      </div>
    </div>
  );
}
