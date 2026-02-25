"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type UseDebounceFilterOptions = {
  /** URL search param name to sync with */
  paramName: string;
  /** Debounce delay in ms (default: 400) */
  delay?: number;
};


export const useDebounceFilter = ({
  paramName,
  delay = 1500,
}: UseDebounceFilterOptions) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialValue = searchParams.get(paramName) ?? "";
  const [value, setValue] = useState(initialValue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyFilter = useCallback(
    (nextValue: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (nextValue.trim()) {
        params.set(paramName, nextValue.trim());
      } else {
        params.delete(paramName);
      }

      // Reset pagination when filter changes
      params.delete("page");

      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, paramName],
  );

  useEffect(() => {
    // Skip the initial render (value matches URL already)
    if (value === initialValue) return;

    // Clear immediately when empty
    if (!value.trim()) {
      if (timerRef.current) clearTimeout(timerRef.current);
      applyFilter("");
      return;
    }

    // Debounce non-empty values
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => applyFilter(value), delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, delay, applyFilter, initialValue]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return { value, onChange: handleChange } as const;
};

/**
 * Hook for select filters — applies the filter immediately on change (no debounce).
 */
export const useSelectFilter = (paramName: string) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = searchParams.get(paramName) ?? "all";

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const params = new URLSearchParams(searchParams.toString());
      const next = e.target.value;

      if (next === "all") {
        params.delete(paramName);
      } else {
        params.set(paramName, next);
      }

      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, paramName],
  );

  return { value, onChange: handleChange } as const;
};
