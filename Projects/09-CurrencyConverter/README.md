# 09 · Currency Converter

A form with no form library. The form state keeps the raw strings the user typed. `validate()` returns either `{ ok: true, request }` with parsed numbers or `{ ok: false, errors }`, where the errors are typed per field (`Partial<Record<keyof FormValues, string>>`). The last five conversions are saved in `localStorage`.

- API: `https://api.frankfurter.dev/v1/currencies` and `/v1/latest`
- If the currency list cannot load, the form falls back to a short offline list and shows a notice. Conversion errors appear under the form.

```bash
cd Projects
npm run build
npm run serve
# open http://localhost:<port>/09-CurrencyConverter/
```
