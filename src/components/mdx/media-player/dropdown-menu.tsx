"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/utils/cn";

interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {
  container?: HTMLElement | null;
}

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.Label
      ref={forwardedRef}
      className={cn("px-2 py-1 text-xs font-medium text-foreground/70", className)}
      {...props}
    />
  );
});
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, sideOffset = 8, container, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.Portal container={container ?? undefined}>
      <DropdownMenuPrimitive.Content
        ref={forwardedRef}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-48 border border-border/60 bg-background p-1 text-foreground shadow-lg outline-none",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.Item
      ref={forwardedRef}
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 px-2 py-1 text-sm outline-none data-[highlighted]:bg-foreground/5 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    />
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuSub = DropdownMenuPrimitive.Sub;

export const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>
>(({ className, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={forwardedRef}
      className={cn(
        "flex cursor-pointer select-none items-center justify-between gap-2 px-2 py-1 text-sm outline-none data-[highlighted]:bg-foreground/5 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    />
  );
});
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

export const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, sideOffset = 8, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.SubContent
      ref={forwardedRef}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-48 border border-border/60 bg-background p-1 text-foreground shadow-lg outline-none",
        className
      )}
      {...props}
    />
  );
});
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";


