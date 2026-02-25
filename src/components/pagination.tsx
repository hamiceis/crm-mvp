"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

const PaginationInner = ({ currentPage, totalPages }: PaginationProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };
  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <div className="mt-6 flex items-center justify-between px-1">
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        className={cn(
          "rounded-xl border px-4 py-2 text-xs font-bold transition-all",
          isPrevDisabled
            ? "pointer-events-none border-slate-100 text-slate-300 dark:border-slate-800 dark:text-slate-600"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
        )}
      >
        Anterior
      </Link>

      <p className="text-xs font-bold text-slate-500">
        {currentPage} / {totalPages}
      </p>

      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        className={cn(
          "rounded-xl border px-4 py-2 text-xs font-bold transition-all",
          isNextDisabled
            ? "pointer-events-none border-slate-100 text-slate-300 dark:border-slate-800 dark:text-slate-600"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
        )}
      >
        Próxima
      </Link>
    </div>
  );
};

/**
 * Pagination component wrapped in Suspense because useSearchParams requires it
 * in Next.js App Router to avoid deopting to client-side rendering.
 */
export const Pagination = (props: PaginationProps) => (
  <Suspense
    fallback={
      <div className="mt-6 flex items-center justify-between px-1">
        <div className="h-9 w-20 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-9 w-20 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    }
  >
    <PaginationInner {...props} />
  </Suspense>
);
