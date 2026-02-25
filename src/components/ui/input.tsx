import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
};

export const Input = ({ className, ref, ...props }: InputProps) => (
  <input
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400",
      className,
    )}
    {...props}
  />
);
