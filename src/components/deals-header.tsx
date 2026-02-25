"use client";

import { ToastFromQuery } from "@/components/toast-from-query";
import dynamic from "next/dynamic";

const CreateDealModal = dynamic(
  () => import("@/components/create-deal-modal").then((m) => m.CreateDealModal),
  { ssr: false },
);

type DealsHeaderProps = {
  title?: string;
  description?: string;
  toastMessages: Record<string, { message: string; tone: "success" | "error" }>;
};

export function DealsHeader({
  title = "Pipeline de Vendas",
  description = "Gerencie seus negócios e estágios de venda",
  toastMessages,
}: DealsHeaderProps) {
  return (
    <>
      <ToastFromQuery messages={toastMessages} />
      <header className="flex flex-wrap items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CreateDealModal />
        </div>
      </header>
    </>
  );
}
