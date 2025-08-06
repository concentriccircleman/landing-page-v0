import { Marquee } from "@/components/Marquee";
import Image from "next/image";

import google from "@/assets/logos/google-logo.webp";
import instacart from "@/assets/logos/instacart-logo.webp";
import microsoft from "@/assets/logos/microsoft-logo.webp";
import motorola from "@/assets/logos/motorola-logo.webp";
import qualcomm from "@/assets/logos/qualcomm-logo.webp";
import salesforce from "@/assets/logos/salesforce-logo.webp";
import twitter from "@/assets/logos/x-logo.webp";

// const LOGOS = [
//   "https://cdn.brandfetch.io/google.com/w/400/h/400/logo?c=1id_elLz2Bd5Ej-dWo7",
//   "https://cdn.brandfetch.io/microsoft.com/w/400/h/400/logo?c=1id_elLz2Bd5Ej-dWo7",
//   "https://cdn.brandfetch.io/twitter.com/w/400/h/400/logo?c=1id_elLz2Bd5Ej-dWo7",
//   "https://cdn.brandfetch.io/qualcomm.com/w/400/h/400/logo?c=1id_elLz2Bd5Ej-dWo7",
//   "https://cdn.brandfetch.io/salesforce.com/w/400/h/400/logo?c=1id_elLz2Bd5Ej-dWo7",
//   "https://cdn.brandfetch.io/motorola.com/w/400/h/400/logo?c=1id_elLz2Bd5Ej-dWo7",
//   "https://cdn.brandfetch.io/instacart.com/w/400/h/400/logo?c=1id_elLz2Bd5Ej-dWo7",
// ];

const LOGOS = [
  google,
  microsoft,
  twitter,
  motorola,
  qualcomm,
  salesforce,
  instacart,
];

export function ResponsiveLogoCarousel() {
  return (
    <div className="w-full">
      {/* Mobile: Moving marquee */}
      <div className="block lg:hidden">
        <Marquee
          className="py-4 max-w-[calc(100vw-3rem)] [--duration:20s]  "
          repeat={6}
        >
          {LOGOS.map((logo, idx) => (
            <Image
              key={idx}
              src={logo}
              alt="Company logo"
              className={`h-6 w-auto mx-6 z-40 select-none ${
                logo.src.includes("motorola-logo") ||
                logo.src.includes("x-logo")
                  ? "invert"
                  : ""
              }`}
            />
          ))}
        </Marquee>
      </div>

      {/* Desktop: Moving marquee */}
      <div className="hidden lg:block">
        <Marquee
          className="py-4 max-w-[calc(35vw)] [--duration:30s]"
          repeat={6}
        >
          {LOGOS.map((logo, idx) => (
            <Image
              key={idx}
              src={logo}
              alt="Company logo"
              className={`h-8 w-auto mx-6 z-40 select-none ${
                logo.src.includes("motorola-logo") ||
                logo.src.includes("x-logo")
                  ? "invert"
                  : ""
              }`}
            />
          ))}
        </Marquee>
      </div>
    </div>
  );
}
