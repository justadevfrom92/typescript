# 15 · Modern Language Features

- **Iterables:** `Range implements Iterable<number>` works with `for...of`, spread and `Array.from`.
- **Generators:** lazy and possibly infinite sequences, and all three type parameters of `Generator<Yield, Return, Next>`.
- **Async generators:** `paginate()` with `for await...of`.
- **Symbols:** `unique symbol` keys, plus well-known symbols such as `Symbol.toPrimitive` and `Symbol.toStringTag`.
- **Explicit resource management:** `using` and `await using` with `Disposable` and `AsyncDisposable`. Cleanup runs in reverse order, even when an error is thrown.
- **Standard decorators:** `@logged`, `@bound` and `@clamp(0, 10)`, typed with `ClassMethodDecoratorContext` and `ClassFieldDecoratorContext`.

`tsconfig.json` adds the `esnext.disposable` and `esnext.decorators` libs, and `tsc` compiles `using` and decorators into code Node 22 runs today.

```bash
cd Projects
npm run build
node 15-ModernLanguageFeatures/dist/main.js
```
