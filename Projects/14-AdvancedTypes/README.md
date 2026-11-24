# 14 · Advanced Types

- **Deriving types from values:** `keyof typeof` turns a value into a type.
- **Filtering unions:** `Extract` and `Exclude`, plus `EventOf<T>` for handlers typed by event name.
- **Branded types:** `UserId`, `OrderId` and `Cents` are all plain strings or numbers at runtime, but the compiler won't let you mix them up.
- **Index signatures:** dictionaries whose lookups may be `undefined`.
- **Recursive types:** `Json`, `DeepPartial`, and the dotted-path types `Path<T>` and `PathValue<T, P>` (`"server.port"`).
- **Variadic tuples:** `concat`, `Tail` and typed partial application.
- **Inference control:** `const` type parameters keep literal types; `NoInfer` stops a parameter from widening them.
- **Type-level tests:** `Expect<Equal<A, B>>` (in `Shared/src/typeTests.ts`, reused by lesson 19) makes `tsc` check types like a test runner.

```bash
cd Projects
npm run build
npm run serve
# open http://localhost:<port>/14-AdvancedTypes/
```

The page runs every example in `src/main.ts` in your browser and shows each result, or the error it throws, next to the code.
