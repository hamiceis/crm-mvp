"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";

type IntegrationStatus = "active" | "configure" | "coming_soon";

export type IntegrationCardProps = {
  icon: React.ReactNode;
  name: string;
  description: string;
  status: IntegrationStatus;
  children?: React.ReactNode;
  helpContent?: React.ReactNode;
};

export function IntegrationCard({
  icon,
  name,
  description,
  status,
  children,
  helpContent,
}: IntegrationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const isComingSoon = status === "coming_soon";

  const toggleExpand = () => {
    if (isComingSoon || !children) return;
    setExpanded((prev) => !prev);
  };

  const handleHelpClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHelpOpen(true);
  };

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-200 overflow-hidden",
        isComingSoon
          ? "border-slate-100 bg-slate-50/50 opacity-60 dark:border-slate-800/60 dark:bg-slate-900/40"
          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900",
        expanded && !isComingSoon ? "shadow-md" : "shadow-sm",
      )}
    >
      {/* Header (Always visible) */}
      <button
        type="button"
        onClick={toggleExpand}
        disabled={isComingSoon || !children}
        className={cn(
          "w-full flex items-start gap-4 p-5 text-left transition-colors",
          !isComingSoon &&
            children &&
            "hover:bg-slate-50 dark:hover:bg-slate-800/50",
          !isComingSoon && !children && "cursor-default",
        )}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {name}
            </h3>
            {status === "active" && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 ring-1 ring-inset ring-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
                Ativo
              </span>
            )}
            {status === "configure" && (
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 ring-1 ring-inset ring-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20">
                Configurar
              </span>
            )}
            {status === "coming_soon" && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">
                Em breve
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {description}
          </p>
        </div>
        <div className="text-slate-400 shrink-0 mt-1 flex items-center gap-1">
          {helpContent && (
            <div
              role="button"
              tabIndex={0}
              onClick={handleHelpClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsHelpOpen(true);
                }
              }}
              className="p-1 rounded-md text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Configurar integração"
            >
              <HelpCircle className="h-5 w-5" />
            </div>
          )}
          {!isComingSoon && children && (
            <div className="p-1">
              {expanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          )}
        </div>
      </button>

      {/* Modal de Ajuda */}
      {helpContent && (
        <Modal
          open={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
          title={`Configurar ${name}`}
          maxWidth="max-w-2xl"
        >
          {helpContent}
        </Modal>
      )}

      {/* Expandable Content */}
      {expanded && !isComingSoon && children && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
          {children}
        </div>
      )}
    </div>
  );
}
