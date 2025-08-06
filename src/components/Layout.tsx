"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MobileMenu from "@/components/MobileMenu";
import { Providers } from "@/app/providers";
import { usePathname } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  
  // Valid routes in the app
  const validRoutes = ["/", "/about", "/manifesto", "/privacy", "/terms"];
  const isNotFound = !validRoutes.includes(pathname);

  return (
    <Providers>
      <div className="min-h-screen flex flex-col">
        {isLanding ? (
          <>
            <MobileMenu />
            <main className="flex-1 flex flex-col mb-32">
              {children}
            </main>
          </>
        ) : isNotFound ? (
          <>
            <Header />
            <MobileMenu />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </>
        ) : (
          <div className="flex-1 flex flex-col max-w-screen-4xl mx-auto w-full bg-background">
            <Header />
            <MobileMenu />
            <main className="flex-1 flex flex-col py-8">
              {children}
            </main>
          </div>
        )}
        <Footer />
      </div>
    </Providers>
  );
}
