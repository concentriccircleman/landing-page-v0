"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/utils/cn";

type TooltipVariant = "default" | "inverse";

interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  variant?: TooltipVariant;
  container?: HTMLElement | null;
}

export const Tooltip = ({ children, ...props }: TooltipPrimitive.TooltipProps) => {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, sideOffset = 8, variant = "default", container, ...props }, forwardedRef) => {
  return (
    <TooltipPrimitive.Portal container={container ?? undefined}>
      <TooltipPrimitive.Content
        ref={forwardedRef}
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-w-xs border border-border/60 bg-background px-2 py-1 text-xs text-foreground shadow-lg",
          variant === "inverse" && "border-white/20 bg-black text-white",
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
});
TooltipContent.displayName = "TooltipContent";


