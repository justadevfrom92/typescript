import type { Todo, User } from "./types.js";

export function completionRate(todos: readonly Todo[]): number {
  if (todos.length === 0) return 0;
  return Math.round((todos.filter((todo) => todo.completed).length / todos.length) * 100);
}

export type SortKey = "name" | "company" | "city";

export function sortUsers(users: readonly User[], key: SortKey): User[] {
  const value = (user: User): string =>
    key === "name" ? user.name : key === "company" ? user.company.name : user.address.city;
  return [...users].sort((a, b) => value(a).localeCompare(value(b)));
}

export function searchUsers(users: readonly User[], query: string): User[] {
  const q = query.trim().toLowerCase();
  if (q === "") return [...users];
  return users.filter((user) => [user.name, user.username, user.email, user.company.name].some((field) => field.toLowerCase().includes(q)));
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
