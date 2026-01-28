"use client";

import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface AnnouncementBannerProps {
  message: ReactNode;
}

const AnnouncementBanner = ({ message }: AnnouncementBannerProps) => {
  return (
    <a
      href="https://www.linkedin.com/feed/update/urn:li:activity:7422322649269350400/"
      target="_blank"
      rel="noopener noreferrer"
      className={cn("fixed top-0 inset-x-0 z-50 w-full announcement-gradient text-background cursor-pointer block")}
    >
      <div className="max-w-screen-2xl mx-auto w-full px-4 h-10 flex items-center justify-center">
        <p className="text-xs sm:text-sm text-background text-center">{message}</p>
      </div>
    </a>
  );
};

export default AnnouncementBanner;
