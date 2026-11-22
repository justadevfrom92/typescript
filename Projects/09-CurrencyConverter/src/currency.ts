// Currency form types, validation and API helpers.
import { hasShape, isNumber, isRecord, isString } from "#shared/guards.js";

export const API = "https://api.frankfurter.dev/v1";

export type Currencies = Record<string, string>; // { USD: "United States Dollar", ... }
export type Rates = { amount: number; base: string; date: string; rates: Record<string, number> };

export const isCurrencies = (value: unknown): value is Currencies =>
  isRecord(value) && Object.keys(value).length > 0 && Object.values(value).every(isString);

export const isRates = hasShape<Rates>({
  amount: isNumber,
  base: isString,
  date: isString,
  rates: (value): value is Record<string, number> => isRecord(value) && Object.values(value).every(isNumber),
});

// The form keeps raw strings (what the user typed); validation turns them into a typed request.
export type FormValues = { amount: string; from: string; to: string };
export type ConversionRequest = { amount: number; from: string; to: string };
export type FormErrors = Partial<Record<keyof FormValues, string>>;

export type Validation = { ok: true; request: ConversionRequest } | { ok: false; errors: FormErrors };

export function validate(values: FormValues, currencies: Currencies): Validation {
  const errors: FormErrors = {};
  const amount = Number(values.amount);
  if (values.amount.trim() === "") errors.amount = "Enter an amount.";
  else if (!Number.isFinite(amount) || amount <= 0) errors.amount = "Amount must be a positive number.";
  else if (amount > 1_000_000_000) errors.amount = "Amount is too large.";
  if (!(values.from in currencies)) errors.from = "Choose a currency.";
  if (!(values.to in currencies)) errors.to = "Choose a currency.";
  if (!errors.from && !errors.to && values.from === values.to) errors.to = "Pick two different currencies.";

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, request: { amount, from: values.from, to: values.to } };
}

export function ratesUrl(request: ConversionRequest): string {
  return `${API}/latest?base=${encodeURIComponent(request.from)}&symbols=${encodeURIComponent(request.to)}`;
}

export function convert(request: ConversionRequest, rates: Rates): number | null {
  const rate = rates.rates[request.to];
  return rate === undefined ? null : request.amount * rate;
}

export function formatMoney(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`; // Unknown currency codes fall back to plain text.
  }
}

export type HistoryEntry = { from: string; to: string; amount: number; result: number; date: string };

export const isHistory = (value: unknown): value is HistoryEntry[] =>
  Array.isArray(value) &&
  value.every(hasShape<HistoryEntry>({ from: isString, to: isString, amount: isNumber, result: isNumber, date: isString }));

export function addToHistory(history: readonly HistoryEntry[], entry: HistoryEntry, limit = 5): HistoryEntry[] {
  return [entry, ...history].slice(0, limit);
}
