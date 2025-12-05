"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="max-w-screen-4xl mx-auto w-full px-4 mt-32">
      <div className="bg-primary-50 border border-primary-200 p-12 md:p-16 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-6">
          Sentralize Your Company
        </h1>
        <div className="text-lg md:text-xl text-secondary mb-8 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <p className="text-center flex-1">&ldquo;I&apos;ve tried 5 other status report tools, yours is the only one that works. The one thing Sentra does well that others can&apos;t is that Sentra can contextualize what&apos;s important for me to know.&rdquo;</p>
            {/* <p className="text-center flex-1">&ldquo;Wow. The report is fantastic.&rdquo;</p> */}
            <p className="text-center flex-1">&ldquo;Of all the AI tools that I&apos;ve tried, Sentra is actually useful.  I make a million promises across zoom meetings, slack, and emails---faster than I can write them down, and Sentra is the only tool that allowed me to start catching onto them.&rdquo;</p>
          </div>

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