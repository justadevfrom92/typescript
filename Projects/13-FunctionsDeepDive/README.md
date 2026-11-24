# 13 · Functions Deep Dive

- **Overloads:** `parseDate(timestamp)`, `parseDate(text)` and `parseDate(y, m, d)` share one implementation.
- **`this` parameters:** declare what `this` must be; methods that return `this` keep chaining with the subclass type.
- **Assertion functions:** `asserts condition` and `asserts value is string` narrow a value by throwing.
- **Generic composition:** `pipe` (overloaded), and `debounce`/`once` built with `Parameters<>` and `ReturnType<>`.
- **Function type compatibility:** why a function with fewer parameters can be used where more are passed, and what a `void` return really means.

The tests use `// @ts-expect-error`, so the build fails if a line that should be a type error ever starts compiling.

```bash
cd Projects
npm run build
npm run serve
# open http://localhost:<port>/13-FunctionsDeepDive/
```

The page runs every example in `src/main.ts` in your browser and shows each result, or the error it throws, next to the code.
