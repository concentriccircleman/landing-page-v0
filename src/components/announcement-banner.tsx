"use client";

import type { ReactNode } from "react";

interface AnnouncementBannerProps {
  message: ReactNode;
}

const AnnouncementBanner = ({ message }: AnnouncementBannerProps) => {
  return (
    <a
      href="https://www.linkedin.com/feed/update/urn:li:activity:7422322649269350400/"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-0 inset-x-0 z-50 w-full bg-[#1a1a1f] text-[#f0f0f0] cursor-pointer block border-b border-[#333338] group"
    >
      <div className="absolute inset-0 bg-[length:200%_100%] bg-[linear-gradient(90deg,transparent_0%,rgba(37,99,235,0.06)_25%,rgba(37,99,235,0.12)_50%,rgba(37,99,235,0.06)_75%,transparent_100%)] animate-[shimmer_4s_ease-in-out_infinite]" />
      <div className="relative max-w-screen-2xl mx-auto w-full px-4 h-10 flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
        <p className="text-[12px] font-semibold tracking-wide text-[#e0e0e0] text-center">{message}</p>
        <svg className="w-3 h-3 text-[#808085] group-hover:text-[#c0c0c5] transition-colors duration-200 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
};

export default AnnouncementBanner;
