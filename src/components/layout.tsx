"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { Providers } from "@/app/providers";
import { usePathname } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  const isBlogRoute = pathname.startsWith("/blog");
  const validRoutes = [
    "/",
    "/about",
    "/manifesto",
    "/privacy",
    "/terms",
    "/data-privacy",
    "/blog",
  ];
  const isNotFound = !validRoutes.includes(pathname) && !isBlogRoute;

  return (
    <Providers>
      <div className="min-h-screen flex flex-col">
        {isLanding ? (
          <>
            <main className="flex-1 flex flex-col gap-24 pb-24">
              {children}
            </main>
          </>
        ) : isNotFound ? (
          <>
            <Header />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </>
        ) : (
          <div className="flex-1 flex flex-col max-w-screen-4xl mx-auto w-full bg-background">
            <Header />
            <main className="flex-1 flex flex-col py-20">
              {children}
            </main>
          </div>
        )}
        <Footer />
      </div>
    </Providers>
  );
}
