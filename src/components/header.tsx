"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import sentraLogo from "@/assets/brand/sentra.png";
import MobileMenu from "@/components/mobile-menu";
import { cn } from "@/utils/cn";

const Header = () => {
  const pathname = usePathname();
  const isLanding = pathname === "/";


  return (
    <section
      className={cn(
        "fixed top-10 inset-x-0 z-40 w-full transition-colors duration-300",
        isLanding ? "bg-foreground" : "bg-background",
      )}
    >
      <div
        className={cn(
          "w-full max-w-screen-2xl mx-auto flex justify-between items-center p-4 pointer-events-auto",
          isLanding ? "text-background" : "text-foreground",
        )}
      >
        <Link
          href="/"
          scroll={false}
          className="flex items-center gap-2 hover:opacity-80 duration-200 sm:justify-self-start"
        >
          <Image src={sentraLogo} alt="Sentra" width={30} height={30} />
          <span className="text-base font-medium">Sentra</span>
        </Link>

        <div className="flex sm:hidden items-center gap-2">
          <MobileMenu />
        </div>

        <div className="hidden sm:flex items-center justify-end gap-4">
          <Link href="/manifesto" className="text-sm hover:opacity-80 duration-150">
            Manifesto
          </Link>
          <Link
            href="/login"
            className={cn(
              "h-8 inline-flex items-center text-sm px-3 hover:opacity-80 duration-200 w-fit hover:cursor-pointer",
              isLanding ? "bg-background text-foreground" : "bg-foreground text-background",
            )}
          >
            Sign In
          </Link>
          <Link
            href="/contact"
            className="h-8 inline-flex items-center text-sm bg-primary-600 text-background px-3 hover:opacity-80 duration-200 w-fit hover:cursor-pointer"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Header;
