"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="max-w-screen-4xl mx-auto w-full px-4 mt-32">
      <div className="bg-primary-50 border border-primary-200 p-12 md:p-16 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-6">
          Sentralize Your Company
        </h1>
        <div className="text-lg md:text-xl text-secondary mb-8 max-w-3xl mx-auto space-y-4">
          <p className="text-center">&ldquo;Sentra is going to be the most useful tool ever.&rdquo;</p>
          <p className="text-center">&ldquo;I see value in this. I can act on this information.&rdquo;</p>
          <p className="text-center">&ldquo;This is the exact kind of thing leadership needs.&rdquo;</p>
          <p className="text-center">- first cohort of series A founders</p>
        </div>
        
        <Link 
          href="/signup"
          className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-lg hover:brightness-80 duration-200"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}