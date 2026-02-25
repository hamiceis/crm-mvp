"use client";

import type { ComponentProps } from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import "react-day-picker/dist/style.css";

type CalendarProps = ComponentProps<typeof DayPicker>;

export function Calendar({ className, classNames, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays
      className={cn("p-2", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "space-y-2",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-semibold capitalize dark:text-slate-100",
        nav: "space-x-1 flex items-center",
        nav_button:
          "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 border border-slate-300 rounded-md text-xs dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-slate-500 rounded-md w-8 font-medium text-[0.8rem] dark:text-slate-400",
        row: "flex w-full mt-1",
        cell: "h-8 w-8 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-brand-100 dark:[&:has([aria-selected])]:bg-brand-900/30 rounded-md",
        day: "h-8 w-8 p-0 font-normal rounded-md hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
        day_selected:
          "bg-brand-600 text-white hover:bg-brand-700 dark:text-white",
        day_today: "border border-slate-300 dark:border-slate-600",
        day_outside: "text-slate-400 opacity-60 dark:text-slate-600",
        day_disabled: "text-slate-400 opacity-50 dark:text-slate-600",
        day_range_middle:
          "aria-selected:bg-brand-100 aria-selected:text-slate-900 dark:aria-selected:bg-brand-900/30 dark:aria-selected:text-slate-100",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}
