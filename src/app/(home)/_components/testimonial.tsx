import Image from "next/image";
import Section from "@/components/section";
import paulRothemund from "@/assets/testimonials/paul-rothemund.png";

const TESTIMONIAL = "Of all the AI tools that I've tried, Sentra is actually useful. I make a million promises across zoom meetings, slack, and emails--faster than I can write them down, and Sentra is the only tool that allowed me to start catching onto them.";

const Testimonial = () => {
  return (
    <Section>
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto py-12 md:py-24">
        <div className="mb-8">
          <Image
            src={paulRothemund}
            alt="Paul Rothemund"
            width={80}
            height={80}
            className="rounded-full object-cover aspect-square"
            placeholder="blur"
          />
        </div>
        
        <blockquote className="text-xl md:text-2xl text-foreground font-medium mb-6 leading-relaxed">
          &ldquo;{TESTIMONIAL}&rdquo;
        </blockquote>

        <cite className="not-italic flex flex-col items-center gap-0.5">
          <span className="text-lg text-foreground font-medium">Paul Rothemund</span>
          <span className="text-base text-secondary">VP of Research at Biostate AI</span>
        </cite>
      </div>
    </Section>
  );
};

export default Testimonial;
