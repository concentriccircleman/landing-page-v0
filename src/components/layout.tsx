"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import CursorTrail from "@/components/cursor-trail";

import { Providers } from "@/app/providers";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const isContact = pathname === "/contact";

  const isBlogRoute = pathname.startsWith("/blog");
  const validRoutes = [
    "/",
    "/about",
    "/contact",
    "/manifesto",
    "/careers",
    "/contact",
    "/privacy",
    "/terms",
    "/data-privacy",
    "/blog",
  ];
  
  const isNotFound = !validRoutes.includes(pathname) && !isBlogRoute;

  return (
    <Providers>
      <CursorTrail />
      <div
        className={cn(
          "relative min-h-screen flex flex-col",
          isContact && "contact-gradient",
        )}
      >
        {isLanding ? (
          <>
            <Header />
            <main className="flex-1 flex flex-col pb-0">
              {children}
            </main>
          </>
        ) : isNotFound ? (
          <>
            <Header />
            <main className="flex-1 flex flex-col py-40">
              {children}
            </main>
          </>
        ) : (
          <div
            className={cn(
              "flex-1 flex flex-col max-w-screen-2xl mx-auto w-full",
              !isContact && "bg-background",
            )}
          >
            <Header />
            <main className="flex-1 flex flex-col py-40">
              {children}
            </main>
          </div>
        )}
        <Footer />
      </div>
    </Providers>
  );
}
