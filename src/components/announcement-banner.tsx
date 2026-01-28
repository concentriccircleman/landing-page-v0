"use client";

import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface AnnouncementBannerProps {
  message: ReactNode;
}

const AnnouncementBanner = ({ message }: AnnouncementBannerProps) => {
  return (
    <div className={cn("fixed top-0 inset-x-0 z-50 w-full announcement-gradient text-background")}>
      <div className="max-w-screen-2xl mx-auto w-full px-4 h-10 flex items-center justify-center">
        <p className="text-xs sm:text-sm text-background text-center">{message}</p>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
