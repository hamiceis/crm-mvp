import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "ghost";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  ref?: React.Ref<HTMLButtonElement>;
};

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-brand-600 text-white hover:bg-brand-500 active:bg-brand-700",
  outline:
    "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800",
  ghost:
    "text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800",
};

export const Button = ({
  className,
  variant = "default",
  type = "button",
  ref,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cn(
      "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50",
      variantClasses[variant],
      className,
    )}
    ref={ref}
    {...props}
  />
);
