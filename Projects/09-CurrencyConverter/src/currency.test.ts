import { test } from "node:test";
import assert from "node:assert/strict";
import { addToHistory, convert, formatMoney, isCurrencies, isRates, ratesUrl, validate } from "./currency.js";

const currencies = { USD: "US Dollar", EUR: "Euro" };

test("validate returns typed errors per field", () => {
  const result = validate({ amount: "-1", from: "USD", to: "XXX" }, currencies);
  assert.ok(!result.ok);
  assert.equal(result.errors.amount, "Amount must be a positive number.");
  assert.equal(result.errors.to, "Choose a currency.");
});

test("validate ignores inherited object keys like toString", () => {
  const result = validate({ amount: "1", from: "toString", to: "constructor" }, currencies);
  assert.ok(!result.ok && result.errors.from && result.errors.to);
});

test("validate rejects same currency and empty amount", () => {
  const result = validate({ amount: " ", from: "USD", to: "USD" }, currencies);
  assert.ok(!result.ok && result.errors.amount && result.errors.to);
});

test("validate builds a numeric request", () => {
  assert.deepEqual(validate({ amount: "12.5", from: "USD", to: "EUR" }, currencies), {
    ok: true,
    request: { amount: 12.5, from: "USD", to: "EUR" },
  });
});

test("convert and format", () => {
  const rates = { amount: 1, base: "USD", date: "2026-01-01", rates: { EUR: 0.5 } };
  assert.equal(convert({ amount: 10, from: "USD", to: "EUR" }, rates), 5);
  assert.equal(convert({ amount: 10, from: "USD", to: "GBP" }, rates), null);
  assert.equal(formatMoney(5, "EUR"), "€5.00");
  assert.equal(formatMoney(5, "NOPE1"), "5.00 NOPE1");
});

test("guards and url", () => {
  assert.equal(isCurrencies(currencies), true);
  assert.equal(isCurrencies({}), false);
  assert.equal(isRates({ amount: 1, base: "USD", date: "x", rates: { EUR: "0.5" } }), false);
  assert.equal(ratesUrl({ amount: 1, from: "USD", to: "EUR" }), "https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR");
});

test("history keeps the newest entries", () => {
  const entry = { from: "USD", to: "EUR", amount: 1, result: 1, date: "d" };
  const history = Array.from({ length: 5 }, () => entry);
  assert.equal(addToHistory(history, { ...entry, amount: 2 }).length, 5);
  assert.equal(addToHistory(history, { ...entry, amount: 2 })[0]?.amount, 2);
});
