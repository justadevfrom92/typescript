# 07 · Weather Dashboard

The first TSX app. It introduces the shared JSX runtime and hooks, `useEffect` with an `AbortController` cleanup (a quick city switch cancels the stale request), a state union for loading, error and ready, and a unit preference saved in `localStorage`.

- API: `https://api.open-meteo.com/v1/forecast` (free, keyless)
- If you are offline or the request is blocked, a non-blocking error with **Retry** appears and the city and unit controls keep working.

```bash
cd Projects
npm run build
npm run serve
# open http://localhost:<port>/07-WeatherDashboard/
```

| File | Role |
| --- | --- |
| `src/weather.ts` | API types, a guard, mapping WMO weather codes to a `Sky` union, formatting (unit tested) |
| `src/App.tsx` | UI and data loading |
| `src/main.tsx` | Mounts the app |
