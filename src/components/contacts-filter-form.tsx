"use client";

import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useDebounceFilter, useSelectFilter } from "@/lib/use-debounce-filter";

type ContactsFilterFormProps = {
  initialQ: string;
  sourceOptions: string[];
  isAdmin: boolean;
  initialOwner: string;
  initialSource: string;
};

const ContactsFilterFormInner = ({
  initialQ,
  sourceOptions,
  isAdmin,
  initialOwner,
  initialSource,
}: ContactsFilterFormProps) => {
  const search = useDebounceFilter({ paramName: "q" });
  const source = useSelectFilter("source");
  const owner = useSelectFilter("owner");

  return (
    <div className="flex flex-wrap gap-2">
      <Input
        value={search.value || initialQ}
        onChange={search.onChange}
        placeholder="Buscar por nome/email/empresa..."
        className="w-full md:w-80"
      />
      <Select
        value={source.value === "all" ? initialSource : source.value}
        onChange={source.onChange}
        className="w-48"
      >
        <option value="all">Todas as origens</option>
        {sourceOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
      {isAdmin ? (
        <Select
          value={owner.value === "all" ? initialOwner : owner.value}
          onChange={owner.onChange}
          className="w-44"
        >
          <option value="all">Todos os donos</option>
          <option value="mine">Meus contatos</option>
        </Select>
      ) : null}
    </div>
  );
};

/**
 * Client-side filter form for contacts with debounced search and instant selects.
 * Wrapped in Suspense because useSearchParams requires it in Next.js App Router.
 */
export const ContactsFilterForm = (props: ContactsFilterFormProps) => (
  <Suspense
    fallback={
      <div className="flex flex-wrap gap-2">
        <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800 md:w-80" />
        <div className="h-10 w-48 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    }
  >
    <ContactsFilterFormInner {...props} />
  </Suspense>
);
