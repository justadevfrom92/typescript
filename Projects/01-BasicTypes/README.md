# 01 · Basic Types

Primitive annotations, literal unions with `as const`, optional/default parameters, tuples, readonly arrays, `unknown`, named function types and `never`.

| File | What it shows |
| --- | --- |
| `src/basics.ts` | The lesson code |
| `src/basics.test.ts` | Tests with Node's built-in `node:test` |
| `src/main.ts` | The lesson page: runs each example in the browser and shows the result |

```bash
cd Projects
npm run build
npm run serve
# open http://localhost:<port>/01-BasicTypes/
```

The page runs every example in `src/main.ts` in your browser and shows each result, or the error it throws, next to the code.

**Try it:** change `formatPrice(500, "EUR")` to `formatPrice(500, "JPY")` and watch `tsc` reject it.
