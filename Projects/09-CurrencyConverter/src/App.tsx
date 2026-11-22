import { useEffect, useState } from "#shared/dom.js";
import { fetchJson } from "#shared/http.js";
import { loadJson, saveJson } from "#shared/storage.js";
import { addToHistory, API, convert, formatMoney, isCurrencies, isHistory, isRates, ratesUrl, validate, type Currencies, type FormErrors, type FormValues, type HistoryEntry } from "./currency.js";

type Outcome =
  | { status: "idle" }
  | { status: "converting" }
  | { status: "error"; error: string }
  | { status: "done"; entry: HistoryEntry };

// Used when the currency list cannot be loaded, so the form still renders.
const fallbackCurrencies: Currencies = { EUR: "Euro", GBP: "British Pound", JPY: "Japanese Yen", USD: "United States Dollar" };

export function App(): Node {
  const [currencies, setCurrencies] = useState<Currencies>(fallbackCurrencies);
  const [listError, setListError] = useState<string | null>(null);
  const [values, setValues] = useState<FormValues>({ amount: "100", from: "USD", to: "EUR" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [outcome, setOutcome] = useState<Outcome>({ status: "idle" });
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadJson("currency-history", isHistory, []));

  useEffect(() => {
    fetchJson(`${API}/currencies`, isCurrencies).then((result) => {
      if (result.ok) setCurrencies(result.data);
      else setListError(`${result.error} Showing a short offline list.`);
    });
  }, []);

  const update = (field: keyof FormValues) => (event: Event) => {
    const target = event.currentTarget;
    if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
      setValues((previous) => ({ ...previous, [field]: target.value }));
      setErrors((previous) => ({ ...previous, [field]: undefined }));
    }
  };

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    const validation = validate(values, currencies);
    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }
    setOutcome({ status: "converting" });
    const result = await fetchJson(ratesUrl(validation.request), isRates);
    if (!result.ok) {
      setOutcome({ status: "error", error: result.error });
      return;
    }
    const converted = convert(validation.request, result.data);
    if (converted === null) {
      setOutcome({ status: "error", error: "No rate available for that pair." });
      return;
    }
    const entry: HistoryEntry = { ...validation.request, result: converted, date: result.data.date };
    const nextHistory = addToHistory(history, entry);
    setHistory(nextHistory);
    saveJson("currency-history", nextHistory);
    setOutcome({ status: "done", entry });
  };

  const codes = Object.keys(currencies).sort();
  const currencySelect = (field: "from" | "to", label: string) => (
    <div style={{ flex: "1", minWidth: "140px" }}>
      <label htmlFor={field}>{label}</label>
      <select id={field} value={values[field]} onChange={update(field)} aria-invalid={String(Boolean(errors[field]))}>
        {codes.map((code) => (
          <option value={code}>
            {code} — {currencies[code]}
          </option>
        ))}
      </select>
      {errors[field] && <p className="field-error">{errors[field]}</p>}
    </div>
  );

  return (
    <div>
      <header className="header">
        <h1>Currency Converter</h1>
        <p className="muted">A validated form with typed errors. Rates from api.frankfurter.dev.</p>
      </header>

      {listError && <p className="notice" role="status">{listError}</p>}

      <form className="card stack" noValidate onSubmit={submit}>
        <div>
          <label htmlFor="amount">Amount</label>
          <input id="amount" inputMode="decimal" value={values.amount} onInput={update("amount")} aria-invalid={String(Boolean(errors.amount))} />
          {errors.amount && <p className="field-error">{errors.amount}</p>}
        </div>
        <div className="row" style={{ alignItems: "flex-end" }}>
          {currencySelect("from", "From")}
          <button type="button" aria-label="Swap currencies" onClick={() => setValues((v) => ({ ...v, from: v.to, to: v.from }))}>⇄</button>
          {currencySelect("to", "To")}
        </div>
        <button type="submit" className="primary" disabled={outcome.status === "converting"}>
          {outcome.status === "converting" ? "Converting…" : "Convert"}
        </button>
      </form>

      <div style={{ marginTop: "16px" }} aria-live="polite">
        {outcome.status === "error" && <p className="notice">{outcome.error}</p>}
        {outcome.status === "done" && (
          <p className="card" style={{ fontSize: "1.4rem" }}>
            {formatMoney(outcome.entry.amount, outcome.entry.from)} = <strong>{formatMoney(outcome.entry.result, outcome.entry.to)}</strong>
            <span className="muted" style={{ fontSize: "0.9rem" }}> (rate date {outcome.entry.date})</span>
          </p>
        )}
      </div>

      {history.length > 0 && (
        <section style={{ marginTop: "16px" }}>
          <h2>Recent conversions</h2>
          <ul className="list">
            {history.map((entry) => (
              <li>
                {formatMoney(entry.amount, entry.from)} → {formatMoney(entry.result, entry.to)} <span className="muted">({entry.date})</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
