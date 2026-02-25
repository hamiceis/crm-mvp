import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function currency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function toCents(value: number) {
  return Math.round(value * 100)
}

export function fromCents(value: number) {
  return value / 100
}

export function currencyFromCents(value: number) {
  return currency(fromCents(value))
}
