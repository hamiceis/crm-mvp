"use client";

import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CurrencyInput } from "@/components/ui/currency-input";
import { useDebounceFilter, useSelectFilter } from "@/lib/use-debounce-filter";

type DealsFilterFormProps = {
  q: string;
  minValue: string;
  maxValue: string;
  owner: string;
  isAdmin: boolean;
  className?: string;
};

const DealsFilterFormInner = ({
  q,
  minValue,
  maxValue,
  owner,
  isAdmin,
  className,
}: DealsFilterFormProps) => {
  const search = useDebounceFilter({ paramName: "q" });
  const ownerFilter = useSelectFilter("owner");

  return (
    <div className={`${className ?? ""} flex flex-wrap gap-2`}>
      <Input
        value={search.value || q}
        onChange={search.onChange}
        placeholder="Buscar por título..."
        className="w-full md:w-64"
      />
      <div className="flex items-center gap-2">
        <CurrencyInput
          name="min"
          defaultValue={minValue}
          placeholder="Min"
          className="w-28"
        />
        <CurrencyInput
          name="max"
          defaultValue={maxValue}
          placeholder="Max"
          className="w-28"
        />
      </div>
      {isAdmin ? (
        <Select
          value={ownerFilter.value === "all" ? owner : ownerFilter.value}
          onChange={ownerFilter.onChange}
          className="w-40"
        >
          <option value="all">Todos os donos</option>
          <option value="mine">Meus negócios</option>
        </Select>
      ) : null}
    </div>
  );
};

/**
 * Client-side filter form for deals with debounced search and instant select filters.
 * Wrapped in Suspense because useSearchParams requires it in Next.js App Router.
 */
export const DealsFilterForm = (props: DealsFilterFormProps) => (
  <Suspense
    fallback={
      <div className="flex flex-wrap gap-2">
        <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800 md:w-64" />
        <div className="flex items-center gap-2">
          <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    }
  >
    <DealsFilterFormInner {...props} />
  </Suspense>
);
