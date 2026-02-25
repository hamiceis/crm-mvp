"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-6 dark:border-slate-700 dark:bg-slate-900/30">
      <div className="text-center">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Algo deu errado
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Ocorreu um erro ao carregar esta página. Tente novamente.
        </p>
        {error.digest ? (
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            Código: {error.digest}
          </p>
        ) : null}
      </div>
      <Button onClick={reset} variant="outline">
        Tentar novamente
      </Button>
    </main>
  );
}
