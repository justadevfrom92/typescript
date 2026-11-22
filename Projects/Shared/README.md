# Shared

Small, dependency-free building blocks used by the browser projects. Imported through the `#shared/*` alias, which is defined once in `Projects/package.json` (`"imports"`) for TypeScript and Node, and in each project's `index.html` import map for the browser.

| File | What it gives you |
| --- | --- |
| `src/jsx-runtime.ts` | The JSX runtime `tsc` targets with `"jsx": "react-jsx"` and `"jsxImportSource": "#shared"`. JSX becomes real DOM nodes; it also declares the `JSX` types. |
| `src/hooks.ts` | `mount`, `useState`, `useReducer`, `useEffect`, `useRef`. Every state change re-renders the whole tree in one batched microtask, and focus and cursor position are restored by element `id`. |
| `src/http.ts` | `fetchJson(url, guard)`. It checks `response.ok`, rate limits, timeouts, empty bodies, malformed JSON, CORS and network errors, and the data shape. It never throws; it returns a `Result<T>`. |
| `src/guards.ts` | Runtime type guards (`isString`, `isArrayOf`, `hasShape`, …) that turn `unknown` JSON into typed data. |
| `src/result.ts` | `Result<T>`, a discriminated union with `ok` and `err` helpers. |
| `src/storage.ts` | `localStorage` helpers that fall back safely when storage is blocked or holds corrupt data. |
| `src/typeTests.ts` | `Expect<Equal<A, B>>`, which makes compile-time type checks fail the build when types don't match (lessons 14 and 19). |
| `styles.css` | One plain stylesheet with light and dark themes. |

## Hook rules

The hooks follow the same rules as React's. Call them at the top level of a component and never inside conditions. Give list items a `key` when they hold state, so each item keeps its own state when the list changes.
