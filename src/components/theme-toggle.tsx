"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  return <ThemeToggleWithLabel showLabel={false} />;
}

export function ThemeToggleWithLabel({
  showLabel = true,
}: {
  showLabel?: boolean;
}) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900",
          !showLabel && "px-1",
        )}
      >
        <Moon className="h-4 w-4 text-slate-500 dark:text-slate-300" />
        <Switch checked={false} aria-label="Alternar tema" />
        {showLabel ? (
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Tema
          </span>
        ) : null}
      </div>
    );
  }

  const effectiveTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = effectiveTheme === "dark";
  const Icon = isDark ? Sun : Moon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900",
        !showLabel && "px-1",
      )}
    >
      <Icon
        className={cn("h-4 w-4", isDark ? "text-amber-500" : "text-brand-600")}
      />
      <Switch
        checked={isDark}
        aria-label="Alternar tema"
        onCheckedChange={(checked) => {
          setTheme(checked ? "dark" : "light");
        }}
      />
      {showLabel ? (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
          {isDark ? "Escuro" : "Claro"}
        </span>
      ) : null}
    </div>
  );
}
