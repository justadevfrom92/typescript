# 02 · Unions & Narrowing

Discriminated unions, exhaustive `switch` with `never`, and every narrowing tool: `typeof`, equality, truthiness, `in`, `instanceof` and custom type predicates. Ends with `RemoteData<T>`, the state union used by every browser project later on.

```bash
cd Projects
npm run build
node 02-UnionsAndNarrowing/dist/main.js
```

**Try it:** add `{ kind: "square"; size: number }` to `Shape` and see `area()` fail to compile until you handle it.
