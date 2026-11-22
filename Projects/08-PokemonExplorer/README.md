# 08 · Pokémon Explorer

A paginated list with a search filter that keeps focus while you type. Clicking a name opens a detail panel. Detail requests go through a module-level `Map<string, Promise<Result<Pokemon>>>` cache, so each Pokémon is fetched only once and failed requests are not cached. A sprite that fails to load is replaced by a placeholder.

- API: `https://pokeapi.co/api/v2/pokemon`
- Teaches: nested runtime guards, `useRef` to ignore stale responses, components with their own state (`Details`), and `onError` fallbacks for images.

```bash
cd Projects
npm run build
npm run serve
# open http://localhost:<port>/08-PokemonExplorer/
```
