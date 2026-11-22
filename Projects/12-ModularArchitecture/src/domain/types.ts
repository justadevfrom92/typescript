// Domain layer: plain data types and rules. No fetch, no DOM, no framework.

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: { name: string };
  address: { city: string };
};

export type Todo = { userId: number; id: number; title: string; completed: boolean };

export type Remote<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; data: T };
