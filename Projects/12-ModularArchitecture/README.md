# 12 · Modular Architecture (Team Directory)

The capstone project puts the earlier lessons together in a layered app.

```
src/
  domain/    types.ts, rules.ts        pure types and business rules
  services/  UserRepository.ts         interface (the seam)
             HttpUserRepository.ts     fetch + guards (jsonplaceholder.typicode.com)
             InMemoryUserRepository.ts offline/test data
             directory.ts              application service: repository -> store
  state/     store.ts                  observable store + useStore hook
  router/    routes.ts, useRoute.ts    hash router, routes as a union type
  ui/        App, pages, RemoteView<T> components only read state and call services
  main.tsx                             composition root (dependency injection)
  tests/                               tests every layer without a browser
```

The **Data source** menu swaps the repository while the app is running. The UI does not change because it depends only on the `UserRepository` interface. If the live API is offline or blocked, switch to the offline sample data.

```bash
cd Projects
npm run build
npm run serve
# open http://localhost:<port>/12-ModularArchitecture/
```
