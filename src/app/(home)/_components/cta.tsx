import Link from "next/link";
import Section from "@/components/section";
const CTA = () => {
  return (
    <Section>
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-6">
          Sentralize Your Company
        </h2>
        <p className="text-lg md:text-xl text-foreground/80 mb-10">
          Stay focused on what matters.
        </p>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-brand text-background px-8 py-3 text-lg font-medium hover:opacity-80 duration-200 hover:cursor-pointer"
        >
          Book a demo
        </Link>
      </div>
    </Section>
  );
};

export default CTA;
