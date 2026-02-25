export type UserDateFormat = "pt-BR" | "en-US";

type DateFormatOptions = {
  dateFormat?: UserDateFormat | string | null;
  timezone?: string | null;
  emptyLabel?: string;
};

export function parseDateInput(value?: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function resolveLocale(dateFormat?: string | null) {
  return dateFormat === "en-US" ? "en-US" : "pt-BR";
}

export function formatDateTime(
  value?: Date | string | null,
  options?: DateFormatOptions,
) {
  const emptyLabel = options?.emptyLabel ?? "Sem lembrete";
  if (!value) return emptyLabel;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return emptyLabel;

  const locale = resolveLocale(options?.dateFormat);
  const timezone = options?.timezone?.trim();

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short",
    ...(timezone ? { timeZone: timezone } : {}),
  }).format(date);
}

export function formatDateTimeBR(value?: Date | string | null) {
  return formatDateTime(value, { dateFormat: "pt-BR" });
}

export function isOverdueDate(value?: Date | string | null, now = new Date()) {
  if (!value) return false;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return date < now;
}

export function isDueTodayDate(value?: Date | string | null, now = new Date()) {
  if (!value) return false;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  return date >= startOfDay && date <= endOfDay;
}

export function getDefaultDateInputValue() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDefaultTimeInputValue() {
  const d = new Date(Date.now() + 60 * 60 * 1000);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function combineDateAndTime(date?: string, time?: string) {
  if (!date) return "";
  const safeTime = time && /^\d{2}:\d{2}$/.test(time) ? time : "09:00";
  return `${date}T${safeTime}`;
}

export function toDateTimeLocalInputValue(value?: Date | string | null) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
