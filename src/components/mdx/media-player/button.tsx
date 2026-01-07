"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/utils/cn";

type ButtonVariant = "default" | "ghost" | "outline";
type ButtonSize = "md" | "sm" | "icon-sm";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild, className, variant = "default", size = "md", type, ...props }, forwardedRef) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={forwardedRef}
        type={type ?? "button"}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center gap-2 border border-border/60 bg-background text-foreground transition-colors hover:bg-foreground/5 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 leading-none",
          variant === "ghost" && "border-transparent bg-transparent hover:bg-white/10",
          variant === "outline" && "bg-transparent",
          size === "md" && "h-9 px-3 text-sm",
          size === "sm" && "h-8 px-2 text-xs",
          size === "icon-sm" && "size-8 min-w-8 shrink-0 aspect-square p-0",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";


