# 03 · Generics

Type parameters, constraints (`K extends keyof T`), generic higher-order functions, default type parameters and generic classes (`Queue<T>`, `TtlCache<V>` — the same cache idea reused by the Pokémon project).

```bash
cd Projects
npm run build
npm run serve
# open http://localhost:<port>/03-Generics/
```

The page runs every example in `src/main.ts` in your browser and shows each result, or the error it throws, next to the code.

**Try it:** call `pluck(books, "author")` and read the error message.
