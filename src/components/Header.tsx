"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <section className="fixed top-0 left-0 w-full z-20">
      {/* <div className="absolute top-full w-full h-10 bg-gradient-to-t from-transparent to-red-500" /> */}
      <div className="w-full flex justify-between items-center px-8 py-4 pointer-events-auto bg-gray-100 text-black">
        <Link
          href="/"
          scroll={false}
          className="flex items-center gap-2 hover:opacity-80 duration-200"
        >
          <Image src="/sentra.png" alt="Sentra" width={30} height={30} />
          <span className="text-base font-medium">Sentra</span>
        </Link>

        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login">
            <button className="text-sm bg-foreground text-background px-3 py-1.5 hover:brightness-80 duration-200 w-fit">
              Sign In
            </button>
          </Link>
          <Link href="/signup">
            <button className="text-sm bg-primary-600 text-background px-3 py-1.5 hover:brightness-80 duration-200 w-fit">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
