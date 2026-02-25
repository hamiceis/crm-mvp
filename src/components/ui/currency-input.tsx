"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { formatCurrency, parseCurrency } from "@/lib/formatters";

type CurrencyInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "type"
> & {
  /** Form field name for the numeric value (hidden input) */
  name: string;
  /** Initial numeric value (float, e.g. 1234.56) */
  defaultValue?: string | number;
};

/**
 * Currency input with live BRL formatting: 1.234,56
 *
 * Renders two inputs:
 * - Visible: formatted display for UX
 * - Hidden: raw numeric value (float) for form submission
 */
export const CurrencyInput = ({
  name,
  defaultValue = "",
  ...rest
}: CurrencyInputProps) => {
  const [display, setDisplay] = useState(() => {
    if (!defaultValue) return "";

    // Convert initial numeric value to display format
    const num =
      typeof defaultValue === "number"
        ? defaultValue
        : parseFloat(defaultValue);

    if (!Number.isFinite(num) || num === 0) return "";

    // Convert to cents-as-digits string for formatCurrency
    const cents = Math.round(num * 100).toString();
    return formatCurrency(cents);
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplay(formatCurrency(e.target.value));
  }, []);

  const numericValue = display ? parseCurrency(display) : "";

  return (
    <>
      <Input
        {...rest}
        type="text"
        inputMode="numeric"
        value={display}
        onChange={handleChange}
      />
      <input type="hidden" name={name} value={numericValue} />
    </>
  );
};
