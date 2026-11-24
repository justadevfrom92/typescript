# TypeScript Mastery Roadmap

A hands-on learning repository of small, runnable projects that teach TypeScript, from the core language through advanced types and the compiler up to application architecture. It uses only standard web and TypeScript features: no third-party libraries, state managers, routing packages, form libraries, UI kits, bundlers or plugins. The one dev dependency is the TypeScript compiler.

All source code, configuration and documentation live in [`Projects/`](Projects/). The only files outside it are this `README.md` and `.github/workflows/ci.yml`.

## Quick start

```bash
cd Projects
npm install        # installs the TypeScript compiler only
npm run build      # tsc --build: type-checks and compiles every project
npm test           # builds, then runs every *.test.js with node:test
npm run serve      # zero-dependency static server on a free port (or PORT=xxxx)
```

**Live site:** every push to `main` that passes CI is published to GitHub Pages at <https://justadevfrom92.github.io/typescript/>.

Open the printed URL to get a menu of all 19 projects. Every project is a TypeScript web page: `tsc` compiles it, and the browser runs it from its own `index.html` and import map. Node is used only to run `tsc`, the local server and the unit tests (Node 22 or later).

## The roadmap

| # | Project | Page shows | You learn |
| --- | --- | --- | --- |
| 01 | [Basic Types](Projects/01-BasicTypes/) | Live examples | primitives, literals and `as const`, tuples, readonly, `unknown`, `never` |
| 02 | [Unions & Narrowing](Projects/02-UnionsAndNarrowing/) | Live examples | discriminated unions, exhaustive `switch`, type predicates, `RemoteData<T>` |
| 03 | [Generics](Projects/03-Generics/) | Live examples | type parameters, `keyof` constraints, generic classes and caches |
| 04 | [Mapped & Utility Types](Projects/04-MappedAndUtilityTypes/) | Live examples | `Partial`/`Pick`/`Omit`/`Record`, mapped, conditional and template literal types, `satisfies` |
| 05 | [Classes & Interfaces](Projects/05-ClassesAndInterfaces/) | Live examples | abstract classes, `#private`, modifiers, `override`, typed event emitter |
| 06 | [Posts Browser](Projects/06-PostsBrowser/) | App | typed DOM, `<template>`, `fetch` with guards (jsonplaceholder) |
| 07 | [Weather Dashboard](Projects/07-WeatherDashboard/) | App | TSX, hooks, effects with abort cleanup (open-meteo) |
| 08 | [Pokémon Explorer](Projects/08-PokemonExplorer/) | App | paging, search, request cache, image fallbacks (pokeapi) |
| 09 | [Currency Converter](Projects/09-CurrencyConverter/) | App | forms and validation with typed field errors (frankfurter) |
| 10 | [Photo Gallery](Projects/10-PhotoGallery/) | App | plain JSX + JSDoc with `checkJs`, lightbox (picsum) |
| 11 | [Task Board](Projects/11-TaskBoard/) | App | `useReducer`, action unions, derived state, `localStorage` |
| 12 | [Modular Architecture](Projects/12-ModularArchitecture/) | App | layers, repository interface, dependency injection, store, hash router |
| 13 | [Functions Deep Dive](Projects/13-FunctionsDeepDive/) | Live examples | overloads, `this` parameters, assertion functions, `pipe`, `Parameters`/`ReturnType` |
| 14 | [Advanced Types](Projects/14-AdvancedTypes/) | Live examples | branded and recursive types, `Path<T>`, variadic tuples, `const` type params, `NoInfer`, type-level tests |
| 15 | [Modern Language Features](Projects/15-ModernLanguageFeatures/) | Live examples | iterators, generators, async generators, symbols, `using`, standard decorators |
| 16 | [Declarations & Modules](Projects/16-DeclarationsAndModules/) | Live examples | writing `.d.ts`, enums vs `as const`, namespaces, declaration merging, module and global augmentation |
| 17 | [Compiler & Strictness](Projects/17-CompilerAndStrictness/) | Live examples | every strict flag proven with `@ts-expect-error`, reading compiler errors, module settings |
| 18 | [Typed Workers](Projects/18-TypedWorkers/) | App | Web Worker with a typed message protocol, cancellation, responsive UI |
| 19 | [Typed API Client](Projects/19-TypedApiClient/) | App | endpoint type map, path params from template literals, typed error unions |

Shared building blocks (the lesson page, JSX runtime, hooks, `fetchJson`, guards and storage) are documented in [`Projects/Shared/`](Projects/Shared/).

## How projects compile and run

Browsers cannot run `.ts`, `.tsx` or `.jsx` files, and they cannot resolve bare specifiers like `#shared/http.js` on their own. So:

1. **`tsc --build`** compiles each project's `src/` into its `dist/` folder, in dependency order (project references from `Projects/tsconfig.json`).
2. **JSX** compiles with `"jsx": "react-jsx"` and `"jsxImportSource": "#shared"`. `tsc` emits `import { jsx } from "#shared/jsx-runtime"`, and that resolves to the small DOM-based runtime in `Shared/`. React is not used.
3. **`#shared/*`** is defined once in `Projects/package.json` `"imports"`, which TypeScript and Node both understand. For the browser, each `index.html` maps the same specifiers with an **import map**.
4. **`serve.mjs`** is a ~50-line static server built on `node:http`. Any static file server rooted at `Projects/` works too. Ports are never fixed: it uses `PORT` or picks a free one.

## Where TypeScript is used

Types are used where they add clarity or safety: data shapes, state unions, hook signatures and shared utilities. Plain JavaScript stays where it fits: the server (`serve.mjs`) and the Photo Gallery UI (`.jsx` checked through JSDoc).

## Public APIs

The live projects use free, keyless APIs through native `fetch`: `jsonplaceholder.typicode.com`, `api.open-meteo.com`, `pokeapi.co`, `api.frankfurter.dev` and `picsum.photos`. Every call goes through `fetchJson`, which checks `response.ok`, rate limits (429), timeouts, empty bodies, malformed JSON, unexpected shapes, and CORS or network failures. The UI shows a non-blocking error with **Retry** instead of breaking.

## Code rules

- **Keep it stupidly simple:** short, plain code using built-in features.
- **Zero third-party packages or plugins.** Even the Node test types (`Projects/Types/node-test.d.ts`) are hand-written instead of installing `@types/node`.
- **Naming:** PascalCase for types, components and project folders; camelCase for values and functions.
- **Tests:** pure logic lives in DOM-free modules and is tested with the built-in `node:test` runner. CI type-checks, tests and smoke-tests every project on each push, then deploys `main` to GitHub Pages.
