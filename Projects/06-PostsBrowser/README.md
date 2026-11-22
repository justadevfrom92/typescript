# 06 · Posts Browser

The first browser project, written in plain TypeScript with no JSX: typed `getElementById` helpers, `<template>` cloning, `instanceof` checks on DOM elements, event listeners and native `fetch` through the shared `fetchJson` helper.

- API: `https://jsonplaceholder.typicode.com/posts` and `/posts/:id/comments`
- Offline or blocked? The status line shows the error with a **Retry** button; comments fail per-post without breaking the page.

```bash
cd Projects
npm run build
npm run serve
# open http://localhost:<port>/06-PostsBrowser/
```

| File | Role |
| --- | --- |
| `src/posts.ts` | Types, guards and filtering (no DOM, so it is unit tested) |
| `src/main.ts` | DOM wiring |
| `index.html` | Markup, `<template>` and the import map |
