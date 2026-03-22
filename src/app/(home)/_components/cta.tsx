import Link from "next/link";

const CTA = () => {
  return (
    <section className="relative bg-[#1a1a1f] py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.12)_0%,transparent_70%)]" />
      </div>
      <div className="relative z-10 max-w-screen-2xl mx-auto w-full px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter text-[#f0f0f0] mb-6">
          Sentralize Your Company
        </h2>
        <p className="text-[15px] md:text-base text-[#a0a0a5] mb-8 leading-relaxed">
          Stay focused on what matters.
        </p>

        <Link
          href="/contact"
          className="relative z-10 inline-flex items-center gap-2 bg-brand text-[#f0f0f0] px-8 py-3 text-[15px] font-medium rounded-[4px] hover:brightness-110 duration-200 hover:cursor-pointer shadow-[0_0_0_1px_#1e40af,0_2px_4px_rgba(37,99,235,0.3),0_6px_16px_rgba(37,99,235,0.2),0_12px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all active:scale-[0.97] focus-visible:ring-[3px] focus-visible:ring-[rgba(37,99,235,0.2)]"
        >
          Book a demo
        </Link>
      </div>
    </section>
  );
};

export default CTA;
