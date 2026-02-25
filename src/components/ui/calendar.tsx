"use client";

import type { ComponentProps } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils";
import "react-day-picker/dist/style.css";

type CalendarProps = ComponentProps<typeof DayPicker>;

export function Calendar({ className, classNames, ...props }: CalendarProps) {
  const defaults = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays
      className={cn("p-2", className)}
      classNames={{
        root: cn(defaults.root, "dark:text-slate-100"),
        months: cn(defaults.months, "flex flex-col sm:flex-row gap-2"),
        month_caption: cn(
          defaults.month_caption,
          "text-sm font-semibold capitalize dark:text-slate-100",
        ),
        nav: cn(defaults.nav, "space-x-1 flex items-center"),
        button_previous: cn(
          defaults.button_previous,
          "h-7 w-7 flex items-center justify-center rounded-md border border-slate-300 bg-transparent text-xs opacity-70 hover:opacity-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800",
        ),
        button_next: cn(
          defaults.button_next,
          "h-7 w-7 flex items-center justify-center rounded-md border border-slate-300 bg-transparent text-xs opacity-70 hover:opacity-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800",
        ),
        chevron: cn(defaults.chevron, "fill-slate-500 dark:fill-slate-400"),
        weekdays: cn(defaults.weekdays, "flex"),
        weekday: cn(
          defaults.weekday,
          "text-slate-500 w-8 font-medium text-[0.8rem] dark:text-slate-400",
        ),
        week: cn(defaults.week, "flex w-full mt-1"),
        day: cn(
          defaults.day,
          "h-8 w-8 text-center text-sm p-0 relative rounded-md",
        ),
        day_button: cn(
          defaults.day_button,
          "h-8 w-8 p-0 font-normal rounded-md hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
        ),
        selected: cn(
          defaults.selected,
          "bg-brand-600 text-white hover:bg-brand-700 dark:text-white",
        ),
        today: cn(
          defaults.today,
          "border border-slate-300 dark:border-slate-600",
        ),
        outside: cn(
          defaults.outside,
          "text-slate-400 opacity-60 dark:text-slate-600",
        ),
        disabled: cn(
          defaults.disabled,
          "text-slate-400 opacity-50 dark:text-slate-600",
        ),
        hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}
