# 02 · Unions & Narrowing

Discriminated unions, exhaustive `switch` with `never`, and every narrowing tool: `typeof`, equality, truthiness, `in`, `instanceof` and custom type predicates. Ends with `RemoteData<T>`, the loading/error/success state pattern that every browser project later uses in some form.

```bash
cd Projects
npm run build
npm run serve
# open http://localhost:<port>/02-UnionsAndNarrowing/
```

The page runs every example in `src/main.ts` in your browser and shows each result, or the error it throws, next to the code.

**Try it:** add `{ kind: "square"; size: number }` to `Shape` and see `area()` fail to compile until you handle it.
