"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { formatPhone, parsePhone } from "@/lib/formatters";

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "type"
> & {
  /** Form field name for the raw digits (hidden input) */
  name: string;
  /** Initial formatted value */
  defaultValue?: string;
};

/**
 * Phone input with live Brazilian mask: (00) 00000-0000
 *
 * Renders two inputs:
 * - Visible: formatted display for UX
 * - Hidden: raw digits for form submission
 */
export const PhoneInput = ({
  name,
  defaultValue = "",
  ...rest
}: PhoneInputProps) => {
  const [display, setDisplay] = useState(() =>
    defaultValue ? formatPhone(defaultValue) : "",
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplay(formatPhone(e.target.value));
  }, []);

  return (
    <>
      <Input
        {...rest}
        type="tel"
        inputMode="numeric"
        value={display}
        onChange={handleChange}
        maxLength={15}
      />
      <input type="hidden" name={name} value={parsePhone(display)} />
    </>
  );
};
