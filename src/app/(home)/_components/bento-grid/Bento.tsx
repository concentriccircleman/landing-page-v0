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
  textSize?: "normal" | "large";
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
}

export function BentoContainer({ children, className }: BentoContainerProps) {
  // Normalize to valid React elements only
  const elements = React.Children.toArray(children).filter(
    React.isValidElement
  ) as React.ReactElement<{ className?: string }>[];

  // Helper: compute border classes for an item within a group
  const borderClassesFor = (
    idxInGroup: number,
    colCount: number,
    isLastGroup: boolean
  ) =>
    cn(
      // base borders
      "border-0 border-l border-t border-border",
      // always show right border on small to keep outer edge continuous
      "border-r md:border-r-0",
      // on md+, only the last column gets the right border
      idxInGroup === colCount - 1 && "md:border-r",
      // bottom edge only on the last group to avoid double seams
      isLastGroup && "border-b"
    );

  // Prepare groups: [0..2), [2..5), [5..end)
  type Group = {
    items: React.ReactElement<{ className?: string }>[];
    colCount: number;
  };
  const groups: Group[] = [
    { items: elements.slice(0, 2), colCount: 2 },
    { items: elements.slice(2, 5), colCount: 3 },
    { items: elements.slice(5), colCount: 1 },
  ].filter((g) => g.items.length > 0);

  const renderedGroups = groups.map((group, gi) => {
    const isLastGroup = gi === groups.length - 1;
    const withBorders = group.items.map((child, i) =>
      // clone element and inject className safely
      React.cloneElement(child, {
        className: cn(
          child.props.className,
          borderClassesFor(i, group.colCount, isLastGroup)
        ),
      })
    );

    const gridColsClass =
      group.colCount === 1
        ? "grid-cols-1"
        : group.colCount === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-3";

    return (
      <div key={gi} className={cn("grid gap-0", gridColsClass)}>
        {withBorders}
      </div>
    );
  });

  return <div className={cn("", className)}>{renderedGroups}</div>;
}

export function Bento({
  children,
  className,
  title,
  subtitle,
  layout = "image-above",
  textSize = "normal",
  image,
}: BentoProps) {
  const imageContent = image ? (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width || 400}
      height={image.height || 300}
      className="object-contain"
    />
  ) : (
    children
  );
  // Consistent internal padding and gaps
  const pad = "p-6";
  const gapRow = "gap-3"; // vertical gap inside column layout
  const gapCol = "gap-4"; // horizontal gap inside row layout

  if (layout === "side-by-side") {
    return (
      <div
        className={cn(
          "bg-background overflow-hidden relative flex w-full",
          className
        )}
      >
        <div className={cn("flex w-full items-center", gapCol, pad)}>
          <div className="flex-1 text-left relative z-10 flex flex-col justify-center">
            <h3
              className={cn(
                "text-foreground mb-2",
                textSize === "large" ? "text-2xl" : "text-xl"
              )}
            >
              {title}
            </h3>
            <p
              className={cn(
                "text-secondary leading-relaxed",
                textSize === "large" ? "text-lg" : "text-base"
              )}
            >
              {subtitle}
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            {imageContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-background overflow-hidden relative flex flex-col w-full",
        className
      )}
    >
      <div className={cn("flex flex-col h-full md:h-auto", pad, gapRow)}>
        <div className="flex-1 md:flex-none flex items-center justify-center">
          {imageContent}
        </div>
        <div className="text-left relative z-10">
          <h3
            className={cn(
              "text-foreground mb-2",
              textSize === "large" ? "text-2xl" : "text-xl"
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "text-secondary leading-relaxed",
              textSize === "large" ? "text-lg" : "text-base"
            )}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
