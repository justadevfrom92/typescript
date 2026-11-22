// Hash-based routing with the built-in `hashchange` event. Routes are a union type,
// so links and pages can only refer to routes that exist.

export type Route = { name: "users" } | { name: "user"; id: number } | { name: "about" } | { name: "notFound"; path: string };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, "") || "/";
  if (path === "/") return { name: "users" };
  if (path === "/about") return { name: "about" };
  const match = /^\/users\/(\d+)$/.exec(path);
  if (match) return { name: "user", id: Number(match[1]) };
  return { name: "notFound", path };
}

export function href(route: Exclude<Route, { name: "notFound" }>): string {
  switch (route.name) {
    case "users":
      return "#/";
    case "user":
      return `#/users/${route.id}`;
    case "about":
      return "#/about";
  }
}
