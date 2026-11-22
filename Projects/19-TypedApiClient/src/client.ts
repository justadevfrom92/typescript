// A generic, fully typed API client built on fetch. Endpoints are described once as a type;
// every call is then checked: route names, path params, query, body and response type.
import type { Guard } from "#shared/guards.js";
import type { ApiResult, EndpointSpec, MethodOf, RequestOptions, ResponseOf, RouteKey } from "./apiTypes.js";

export type Endpoints = Record<RouteKey, EndpointSpec>;
export type Guards<E extends Endpoints> = { [K in keyof E]: Guard<ResponseOf<E[K]>> };
export type Fetcher = (url: string, init: RequestInit) => Promise<Response>;

export function buildUrl(baseUrl: string, path: string, params: Record<string, string | number> = {}, query: Record<string, string | number | undefined> = {}): string {
  const filledPath = path.replace(/:(\w+)/g, (_, name: string) => {
    const value = params[name];
    if (value === undefined) throw new Error(`Missing path parameter "${name}"`);
    return encodeURIComponent(String(value));
  });
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) if (value !== undefined) search.set(key, String(value));
  const queryString = search.toString();
  return `${baseUrl}${filledPath}${queryString ? `?${queryString}` : ""}`;
}

export function createClient<E extends Endpoints>(baseUrl: string, guards: Guards<E>, fetcher: Fetcher = (url, init) => fetch(url, init), timeoutMs = 8000) {
  return async function request<K extends keyof E & RouteKey>(route: K, options: RequestOptions<K, E[K]>): Promise<ApiResult<ResponseOf<E[K]>>> {
    const [method, path] = route.split(" ") as [MethodOf<K>, string];
    const url = buildUrl(baseUrl, path, options.params, "query" in options ? (options.query as Record<string, string | number | undefined>) : {});
    const signals = [AbortSignal.timeout(timeoutMs), ...(options.signal ? [options.signal] : [])];
    const init: RequestInit = { method, signal: AbortSignal.any(signals), headers: { Accept: "application/json" } };
    if (options.body !== undefined) {
      init.body = JSON.stringify(options.body);
      init.headers = { ...init.headers, "Content-Type": "application/json; charset=UTF-8" };
    }

    let response: Response;
    try {
      response = await fetcher(url, init);
    } catch (error) {
      return { ok: false, error: { kind: error instanceof DOMException && error.name === "TimeoutError" ? "timeout" : "network" } };
    }
    if (response.status === 429) return { ok: false, error: { kind: "rateLimited" } };
    if (!response.ok) return { ok: false, error: { kind: "http", status: response.status } };

    let json: unknown;
    try {
      json = JSON.parse(await response.text());
    } catch {
      return { ok: false, error: { kind: "parse" } };
    }
    const guard = guards[route] as Guard<ResponseOf<E[K]>>;
    return guard(json) ? { ok: true, data: json } : { ok: false, error: { kind: "shape" } };
  };
}
