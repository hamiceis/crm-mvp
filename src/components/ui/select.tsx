import * as React from "react";
import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  ref?: React.Ref<HTMLSelectElement>;
};

export const Select = ({ className, ref, ...props }: SelectProps) => (
  <select
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100",
      className,
    )}
    {...props}
  />
);
