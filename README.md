# TypeScript Mastery Roadmap

A hands-on learning repository of small, runnable projects that teach TypeScript, from the core language up to application architecture. It uses only standard web and TypeScript features: no third-party libraries, state managers, routing packages, form libraries, UI kits, bundlers or plugins. The one dev dependency is the TypeScript compiler.

All source code, configuration and documentation live in [`Projects/`](Projects/). The only files outside it are this `README.md` and `.github/workflows/ci.yml`.

## Quick start

```bash
cd Projects
npm install        # installs the TypeScript compiler only
npm run build      # tsc --build: type-checks and compiles every project
npm test           # builds, then runs every *.test.js with node:test
npm run serve      # zero-dependency static server on a free port (or PORT=xxxx)
```

Open the printed URL to get a menu of the browser projects. Run the Node lessons directly, for example `node 01-BasicTypes/dist/main.js`. Requires Node 22 or later.

## The roadmap

| # | Project | Runs in | You learn |
| --- | --- | --- | --- |
| 01 | [Basic Types](Projects/01-BasicTypes/) | Node | primitives, literals and `as const`, tuples, readonly, `unknown`, `never` |
| 02 | [Unions & Narrowing](Projects/02-UnionsAndNarrowing/) | Node | discriminated unions, exhaustive `switch`, type predicates, `RemoteData<T>` |
| 03 | [Generics](Projects/03-Generics/) | Node | type parameters, `keyof` constraints, generic classes and caches |
| 04 | [Mapped & Utility Types](Projects/04-MappedAndUtilityTypes/) | Node | `Partial`/`Pick`/`Omit`/`Record`, mapped, conditional and template literal types, `satisfies` |
| 05 | [Classes & Interfaces](Projects/05-ClassesAndInterfaces/) | Node | abstract classes, `#private`, modifiers, `override`, typed event emitter |
| 06 | [Posts Browser](Projects/06-PostsBrowser/) | Browser | typed DOM, `<template>`, `fetch` with guards (jsonplaceholder) |
| 07 | [Weather Dashboard](Projects/07-WeatherDashboard/) | Browser | TSX, hooks, effects with abort cleanup (open-meteo) |
| 08 | [Pokémon Explorer](Projects/08-PokemonExplorer/) | Browser | paging, search, request cache, image fallbacks (pokeapi) |
| 09 | [Currency Converter](Projects/09-CurrencyConverter/) | Browser | forms and validation with typed field errors (frankfurter) |
| 10 | [Photo Gallery](Projects/10-PhotoGallery/) | Browser | plain JSX + JSDoc with `checkJs`, lightbox (picsum) |
| 11 | [Task Board](Projects/11-TaskBoard/) | Browser | `useReducer`, action unions, derived state, `localStorage` |
| 12 | [Modular Architecture](Projects/12-ModularArchitecture/) | Browser | layers, repository interface, dependency injection, store, hash router |

Shared building blocks (the JSX runtime, hooks, `fetchJson`, guards and storage) are documented in [`Projects/Shared/`](Projects/Shared/).

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
- **Tests:** pure logic lives in DOM-free modules and is tested with the built-in `node:test` runner. CI type-checks, tests and smoke-tests every project on each push.
