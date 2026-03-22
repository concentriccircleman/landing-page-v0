"use client";

import React from "react";
import Image, { type ImageProps } from "next/image";
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
  icon?: React.ReactNode;
  image?: {
    src: ImageProps["src"];
    alt: string;
    width?: number;
    height?: number;
  };
}

export function BentoContainer({ children, className }: BentoContainerProps) {
  const elements = React.Children.toArray(children).filter(
    React.isValidElement
  ) as React.ReactElement<{ className?: string }>[];

  const borderClassesFor = (
    idxInGroup: number,
    colCount: number,
    isLastGroup: boolean
  ) =>
    cn(
      "border-0 border-l border-t border-[#ebebeb]",
      "border-r md:border-r-0",
      idxInGroup % colCount === colCount - 1 && "md:border-r",
      isLastGroup && "border-b"
    );

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

  return <div className={cn("overflow-hidden border border-[#ebebeb]", className)}>{renderedGroups}</div>;
}

export function Bento({
  children,
  className,
  title,
  subtitle,
  layout = "image-above",
  textSize = "normal",
  icon,
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
  const pad = "p-6";
  const gapRow = "gap-3";
  const gapCol = "gap-4";

  if (layout === "side-by-side") {
    return (
      <div
        className={cn(
          "bg-[#f8f8f8] overflow-hidden relative flex w-full",
          className
        )}
      >
        <div className={cn("flex w-full items-center", gapCol, pad)}>
          <div className="flex-1 text-left relative z-10 flex flex-col justify-center">
            {icon && (
              <div className="w-6 h-6 bg-brand flex items-center justify-center mb-2">
                {icon}
              </div>
            )}
            <h3
              className={cn(
                "text-[#1a1a1f] font-semibold tracking-tighter mb-2",
                textSize === "large" ? "text-2xl" : "text-lg"
              )}
            >
              {title}
            </h3>
            <p
              className={cn(
                "text-[#71717a] leading-relaxed",
                textSize === "large" ? "text-[15px]" : "text-[14px]"
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
        "bg-[#f8f8f8] overflow-hidden relative flex flex-col w-full",
        className
      )}
    >
      <div className={cn("flex flex-col h-full md:h-auto", pad, gapRow)}>
        <div className="flex-1 md:flex-none flex items-center justify-center">
          {imageContent}
        </div>
        <div className="text-left relative z-10">
          {icon && (
            <div className="w-6 h-6 bg-brand flex items-center justify-center mb-2">
              {icon}
            </div>
          )}
          <h3
            className={cn(
              "text-[#1a1a1f] font-semibold tracking-tighter mb-2",
              textSize === "large" ? "text-2xl" : "text-lg"
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "text-[#71717a] leading-relaxed",
              textSize === "large" ? "text-[15px]" : "text-[14px]"
            )}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
