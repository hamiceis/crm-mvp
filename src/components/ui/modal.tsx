"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Max width class, defaults to max-w-md */
  maxWidth?: string;
};

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-md",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div
        className={`relative z-10 w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900`}
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div className="pr-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {children}
      </div>
    </div>,
    document.body,
  );
}
