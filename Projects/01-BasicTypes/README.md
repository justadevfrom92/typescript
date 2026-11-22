# 01 · Basic Types

Primitive annotations, literal unions with `as const`, optional/default parameters, tuples, readonly arrays, `unknown`, named function types and `never`.

| File | What it shows |
| --- | --- |
| `src/basics.ts` | The lesson code |
| `src/basics.test.ts` | Tests with Node's built-in `node:test` |
| `src/main.ts` | A small console demo |

```bash
cd Projects
npm run build
node 01-BasicTypes/dist/main.js
```

**Try it:** change `formatPrice(500, "EUR")` to `formatPrice(500, "JPY")` and watch `tsc` reject it.
