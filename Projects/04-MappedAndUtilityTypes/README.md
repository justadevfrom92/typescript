# 04 · Mapped & Utility Types

`Partial`, `Pick`, `Omit`, `Record`, `Readonly`; custom mapped types (`Nullable`, `DeepReadonly`), key remapping with template literals (`Getters<T>`), conditional types with `infer`, `satisfies`, and `FormErrors<T>` — the form error type reused by the currency converter.

```bash
cd Projects
npm run build
npm run serve
# open http://localhost:<port>/04-MappedAndUtilityTypes/
```

The page runs every example in `src/main.ts` in your browser and shows each result, or the error it throws, next to the code.

**Try it:** hover `Getters<{ name: string }>` in your editor to see the generated keys.
