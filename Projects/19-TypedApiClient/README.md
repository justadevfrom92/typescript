# 19 · Typed API Client

A generic API client built on `fetch`, combining most of the type techniques from lessons 03, 04 and 14.

- `src/jsonPlaceholder.ts` describes each endpoint once in a type map: `"GET /posts/:postId": { response: Post }`.
- `src/apiTypes.ts` extracts path parameters from the route string with template literal types (`PathParams<"/users/:userId/todos">` gives `{ userId }`). `RequestOptions` requires `params` only when the path has them, and `body` only when the endpoint takes one.
- `src/client.ts` is `createClient<E>()`. Each call checks the route name, params, query and body, and returns the endpoint's exact response type.
- **Errors:** failures come back as a union, `ApiError = network | timeout | rateLimited | http(status) | parse | shape`, so the UI can choose an error message and offer **Retry** only when retrying could help.
- **Tests:** the client takes the fetch function as a parameter, so tests pass in a fake one with no mocking library. `@ts-expect-error` lines prove that invalid calls don't compile.

```bash
cd Projects
npm run build
npm run serve
# open http://localhost:<port>/19-TypedApiClient/
```
