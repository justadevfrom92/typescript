# 16 · Declarations & Modules

How TypeScript describes code it doesn't compile itself, and how types are extended from the outside.

| File | Topic |
| --- | --- |
| `vendor/legacy-math.js` + `.d.ts` | Writing a declaration file for an untyped JavaScript module (named exports, a default export, constants and interfaces) |
| `src/enums.ts` | Numeric and string `enum`s compared with the `as const` object + union pattern |
| `src/merging.ts` | Declaration merging (interface + interface, function + namespace, class + namespace) and `namespace` itself |
| `src/settings.ts` + `src/darkModePlugin.ts` | Module augmentation: `declare module "./settings.js"` adds a field to another module's interface |
| `src/globals.ts` | `declare global`: extending `Array<T>` and adding a `globalThis` variable, and why to do it rarely |

`main.ts` imports `../vendor/legacy-math.js`. From `dist/` the path still points at the real JavaScript file, so no copy step is needed.

```bash
cd Projects
npm run build
node 16-DeclarationsAndModules/dist/main.js
```
