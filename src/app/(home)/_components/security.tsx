"use client";

import Link from "next/link";

export default function Security() {
  return (
    <section className="max-w-screen-2xl mx-auto w-full px-4">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-8 h-8 bg-brand flex items-center justify-center">
          <svg className="w-4 h-4 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter text-[#1a1a1f]">
          Ultimate data security, control, and sovereignty
        </h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="border border-[#ebebeb] bg-[#f8f8f8] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-brand flex items-center justify-center">
              <svg className="w-4 h-4 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-[#1a1a1f] tracking-tighter">
              Enterprise-grade security
            </h3>
          </div>
          <p className="text-[14px] text-[#52525b] mb-8 leading-relaxed">
            Your data security is our top priority. Sentra is SOC 2 compliant. We adhere to ISO standards and GDPR regulations (certifications pending), ensuring the highest levels of data protection and privacy for your organization.
          </p>
          <Link 
            href="https://trust.delve.co/sentra"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#1a1a1f] px-6 py-3 rounded-[4px] text-[13px] font-medium hover:bg-[#f4f4f5] duration-200 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06),inset_0_0.75px_0_rgba(255,255,255,0.8)] transition-all active:scale-[0.97] focus-visible:ring-[3px] focus-visible:ring-[rgba(37,99,235,0.2)]"
          >
            Visit our Security &amp; Trust Center
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
        
        <div className="border border-[#ebebeb] bg-[#f8f8f8] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-brand flex items-center justify-center">
              <svg className="w-4 h-4 text-[#f0f0f0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-[#1a1a1f] tracking-tighter">
              On-premise deployments
            </h3>
          </div>
          <p className="text-[14px] text-[#52525b] leading-relaxed">
            For organizations with sensitive data requirements, we offer dedicated isolated VPC or on-premise air-gapped deployments. This flexibility ensures your data never leaves your infrastructure while still providing the full power of Sentra&apos;s AI-driven organizational intelligence.
          </p>
        </div>
      </div>
    </section>
  );
}
