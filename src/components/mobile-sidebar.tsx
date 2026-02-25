"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AppNavigation } from "@/components/app-navigation";
import { ThemeToggleWithLabel } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="lg:hidden"
        aria-label="Abrir menu"
        aria-expanded={open}
        aria-controls="mobile-sidebar"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu lateral"
        >
          <button
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
          />

          <aside
            id="mobile-sidebar"
            className="absolute left-0 top-0 h-full w-72 border-r border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                CRM MVP
              </h2>
              <Button
                type="button"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <AppNavigation onNavigate={() => setOpen(false)} />

            <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Tema
              </p>
              <ThemeToggleWithLabel />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
