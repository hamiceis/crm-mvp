"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export function PopoverContent({
  className,
  align = "center",
  sideOffset = 6,
  ...props
}: PopoverPrimitive.PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-[9999] w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-lg outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
