"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BentoContainerProps {
  children: React.ReactNode;
  className?: string;
}

interface BentoProps {
  children?: React.ReactNode;
  className?: string;
  title: string;
  subtitle: string;
  layout?: "image-above" | "side-by-side";
  size?: "compact" | "normal";
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
}

export function BentoContainer({ children, className }: BentoContainerProps) {
  const childrenArray = React.Children.toArray(children);
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* First row: 2 cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {childrenArray.slice(0, 2)}
      </div>
      
      {/* Second row: 3 cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {childrenArray.slice(2, 5)}
      </div>
      
      {/* Third row: 1 long card */}
      <div className="grid grid-cols-1">
        {childrenArray.slice(5)}
      </div>
    </div>
  );
}

export function Bento({ children, className, title, subtitle, layout = "image-above", size = "normal", image }: BentoProps) {
  const imageContent = image ? (
    <Image 
      src={image.src} 
      alt={image.alt}
      width={image.width || 400}
      height={image.height || 300}
      className="object-contain"
    />
  ) : children;
  // Dynamic height based on size
  const heightClasses = size === "compact" 
    ? "h-[580px] sm:h-[620px]" 
    : "h-[540px] sm:h-[520px]";

  if (layout === "side-by-side") {
    return (
      <div className={cn(
        "bg-background border border-border overflow-hidden relative flex",
        heightClasses,
        className
      )}>
        <div className="flex-1 p-6 pr-2 text-left relative z-10 flex flex-col justify-center">
          <h3 className="text-2xl sm:text-3xl text-foreground mb-3">
            {title}
          </h3>
          <p className="text-lg text-secondary leading-relaxed">
            {subtitle}
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 pl-2">
          {imageContent}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-background border border-border overflow-hidden relative flex flex-col",
      heightClasses,
      className
    )}>
      <div className="flex-1 flex items-center justify-center px-6 pt-6 pb-2">
        {imageContent}
      </div>
      <div className="p-6 pt-2 text-left relative z-10">
        <h3 className="text-2xl sm:text-3xl text-foreground mb-3">
          {title}
        </h3>
        <p className="text-lg text-secondary leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}