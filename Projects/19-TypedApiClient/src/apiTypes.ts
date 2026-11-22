// Template-literal types that read path parameters out of a route string.
//   PathParams<"/users/:userId/posts/:postId"> = { userId: string | number; postId: string | number }

export type Method = "GET" | "POST" | "PATCH" | "DELETE";

type ParamNames<Path extends string> = Path extends `${string}:${infer Param}/${infer Rest}`
  ? Param | ParamNames<`/${Rest}`>
  : Path extends `${string}:${infer Param}`
    ? Param
    : never;

export type PathParams<Path extends string> = { [K in ParamNames<Path>]: string | number };

export type RouteKey = `${Method} /${string}`;
export type PathOf<K extends RouteKey> = K extends `${Method} ${infer Path}` ? Path : never;
export type MethodOf<K extends RouteKey> = K extends `${infer M extends Method} ${string}` ? M : never;

/** What each endpoint needs and returns. `query` and `body` are optional parts of the contract. */
export type EndpointSpec = { response: unknown; query?: Record<string, string | number | undefined>; body?: unknown };
export type ResponseOf<Spec> = Spec extends { response: infer R } ? R : never;

/** Options a caller must pass: params only when the path has them, body only when the spec has one. */
export type RequestOptions<K extends RouteKey, Spec extends EndpointSpec> = ([ParamNames<PathOf<K>>] extends [never]
  ? { params?: undefined }
  : { params: PathParams<PathOf<K>> }) &
  (Spec extends { body: infer Body } ? { body: Body } : { body?: undefined }) &
  (Spec extends { query?: infer Query } ? { query?: Query } : {}) & { signal?: AbortSignal };

// Errors are a union too, so the UI can react to each kind differently.
export type ApiError =
  | { kind: "network" }
  | { kind: "timeout" }
  | { kind: "rateLimited" }
  | { kind: "http"; status: number }
  | { kind: "parse" }
  | { kind: "shape" };

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

export function describeError(error: ApiError): string {
  switch (error.kind) {
    case "network":
      return "Network error: you may be offline or the request was blocked (CORS).";
    case "timeout":
      return "The request timed out.";
    case "rateLimited":
      return "Too many requests. Wait a moment and try again.";
    case "http":
      return error.status === 404 ? "Not found." : `The server answered with HTTP ${error.status}.`;
    case "parse":
      return "The server sent an empty or malformed response.";
    case "shape":
      return "The server sent data in an unexpected shape.";
  }
}

export function isRetryable(error: ApiError): boolean {
  return error.kind === "network" || error.kind === "timeout" || error.kind === "rateLimited" || (error.kind === "http" && error.status >= 500);
}
