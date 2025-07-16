import { Marquee } from "@/components/Marquee";
import Image from "next/image";

const LOGOS = [
  "https://cdn.brandfetch.io/google.com/w/400/h/400/logo?c=1id_elLz2Bd5Ej-dWo7",
  "https://cdn.brandfetch.io/microsoft.com/w/400/h/400/logo?c=1id_elLz2Bd5Ej-dWo7",
  "https://cdn.brandfetch.io/twitter.com/w/400/h/400/logo?c=1id_elLz2Bd5Ej-dWo7",
  "https://cdn.brandfetch.io/motorola.com/w/400/h/400/logo?c=1id_elLz2Bd5Ej-dWo7",
  "https://cdn.brandfetch.io/qualcomm.com/w/400/h/400/logo?c=1id_elLz2Bd5Ej-dWo7",
  "https://cdn.brandfetch.io/salesforce.com/w/400/h/400/logo?c=1id_elLz2Bd5Ej-dWo7",
  "https://cdn.brandfetch.io/instacart.com/w/400/h/400/logo?c=1id_elLz2Bd5Ej-dWo7",
];

// const LOGOS = [
//   "/logos/google.png",
//   "/logos/microsoft.png",
//   "/logos/twitter.png",
//   "/logos/motorola.png",
//   "/logos/qualcomm.png",
//   "/logos/salesforce.png",
//   "/logos/instacart.png",
// ];

export function ResponsiveLogoCarousel() {
  return (
    <div className="w-full">
      {/* Mobile: Moving marquee */}
      <div className="block lg:hidden">
        <Marquee
          className="py-4 max-w-[calc(100vw-3rem)] [--duration:20s]  "
          repeat={6}
        >
          {LOGOS.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt="Company logo"
              className="h-6 mx-6 z-40"
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
          {LOGOS.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt="Company logo"
              className="h-8 mx-6 z-40"
            />
          ))}
        </Marquee>
      </div>
    </div>
  );
}
