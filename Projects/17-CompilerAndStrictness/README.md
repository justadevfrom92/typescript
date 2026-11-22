# 17 · Compiler & Strictness

`src/strictness.ts` has one section per strictness flag. Each section has a line marked `// @ts-expect-error` that only that flag rejects, followed by the corrected code. If someone switches a flag off, the directive goes unused and **the build fails**, so the file checks that `tsconfig.json` really enforces each flag.

| Flag | Catches |
| --- | --- |
| `strict` → `strictNullChecks` | using a possibly `null`/`undefined` value |
| `strict` → `noImplicitAny` | parameters with no type |
| `strict` → `useUnknownInCatchVariables` | treating `catch (error)` as an `Error` without checking |
| `strict` → `strictPropertyInitialization` | class fields that are never assigned |
| `strict` → `strictFunctionTypes` | callbacks that accept narrower parameters than they will receive |
| `noUncheckedIndexedAccess` | `array[0]` might be `undefined` |
| `exactOptionalPropertyTypes` | `{ color: undefined }` is not the same as leaving `color` out |
| `noPropertyAccessFromIndexSignature` | `env.HOME` must be written `env["HOME"]` |
| `noImplicitReturns` | code paths that return nothing |
| `noFallthroughCasesInSwitch` | a missing `break` |
| `noImplicitOverride` | overriding a method without `override` |
| `noUnusedLocals` / `noUnusedParameters` | dead variables and parameters |

## Reading compiler errors

1. **Read the last line of the message first.** In a long message, the innermost "Type X is not assignable to type Y" names the actual conflict.
2. **Note the error code** (`TS2322`, `TS2345`, …). The same code always means the same kind of problem, so searching for it works well.
3. **Check what TypeScript inferred.** Hover over the variable, or assign the value to a deliberately wrong type such as `const check: never = value`, and the error message shows the inferred type.
4. **Fix the value, not the type.** Use `as` or `!` only when you know something the compiler can't, and leave a comment saying why.

## Module settings used in this repository

`"module": "esnext"` with `"moduleResolution": "bundler"` makes TypeScript understand the `package.json` `"imports"` field (`#shared/*`). `"verbatimModuleSyntax"` requires `import type` for type-only imports, so the emitted JavaScript is exactly what you wrote. Project references (`"composite": true` + `tsc --build`) compile only what changed, in dependency order.

```bash
cd Projects
npm run build
node --test 17-CompilerAndStrictness/dist/*.test.js
```
