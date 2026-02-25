/**
 * Pure formatting helpers for phone and currency fields.
 * All functions are side-effect free and regex-based.
 */

// ─── Phone ───────────────────────────────────────────────────

const DIGITS_ONLY = /\D/g;

/**
 * Formats a raw string into the Brazilian phone mask: (00) 00000-0000
 * Accepts any input — strips non-digits, then applies progressive mask.
 */
export const formatPhone = (value: string): string => {
  const digits = value.replace(DIGITS_ONLY, "").slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

/**
 * Extracts raw digits from a formatted phone string.
 * "(11) 99999-0000" → "11999990000"
 */
export const parsePhone = (formatted: string): string =>
  formatted.replace(DIGITS_ONLY, "");

// ─── Currency (BRL) ──────────────────────────────────────────

/**
 * Formats a raw digit string into BRL currency format: 1.234,56
 * Works with cents internally to avoid floating-point issues.
 *
 * Input: user keystrokes (digits only after stripping)
 * Output: formatted string like "1.234,56"
 */
export const formatCurrency = (value: string): string => {
  const digits = value.replace(DIGITS_ONLY, "");

  if (digits.length === 0) return "";

  const cents = Number(digits);
  const reais = (cents / 100).toFixed(2);
  const [intPart, decPart] = reais.split(".");

  // Add thousand separators
  const withSeparators = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${withSeparators},${decPart}`;
};

/**
 * Parses a BRL-formatted string back to a float number.
 * "1.234,56" → 1234.56
 * Returns 0 when input is empty or invalid.
 */
export const parseCurrency = (formatted: string): number => {
  if (!formatted) return 0;

  const cleaned = formatted.replace(/\./g, "").replace(",", ".");
  const num = parseFloat(cleaned);

  return Number.isFinite(num) ? num : 0;
};
