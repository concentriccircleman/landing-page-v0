"use client";

import Link from "next/link";

export default function Security() {
  return (
    <section className="max-w-screen-4xl mx-auto w-full px-4 mt-32">
      <h2 className="text-2xl md:text-4xl tracking-tight text-foreground mb-8">
        Ultimate data security, control, and sovereignty
      </h2>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl md:text-2xl font-medium text-foreground mb-4">
            Enterprise-grade security
          </h2>
          <p className="text-secondary mb-6 leading-relaxed">
            Your data security is our top priority. Sentra is SOC 2 compliant. We adhere to ISO standards and GDPR regulations (certifications pending), ensuring the highest levels of data protection and privacy for your organization.
          </p>
          <Link 
            href="https://trust.delve.co/sentra"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2 hover:brightness-80 duration-200"
          >
            Visit our Security & Trust Center
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
        
        <div>
          <h2 className="text-xl md:text-2xl font-medium text-foreground mb-4">
            On-premise deployments
          </h2>
          <p className="text-secondary mb-6 leading-relaxed">
            For organizations with sensitive data requirements, we offer dedicated isolated VPC or on-premise air-gapped deployments. This flexibility ensures your data never leaves your infrastructure while still providing the full power of Sentra&apos;s AI-driven organizational intelligence.
          </p>
          <Link 
            href="/private-deployments"
            className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2 hover:brightness-80 duration-200"
          >
            Learn more
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
