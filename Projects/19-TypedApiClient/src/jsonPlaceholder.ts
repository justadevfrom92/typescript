// The concrete API contract for jsonplaceholder.typicode.com.
import { hasShape, isArrayOf, isBoolean, isNumber, isString } from "#shared/guards.js";
import { createClient, type Fetcher, type Guards } from "./client.js";

export type Post = { userId: number; id: number; title: string; body: string };
export type NewPost = Omit<Post, "id">;
export type Todo = { userId: number; id: number; title: string; completed: boolean };

export type JsonPlaceholder = {
  "GET /posts": { response: Post[]; query?: { userId?: number; _limit?: number } };
  "GET /posts/:postId": { response: Post };
  "POST /posts": { response: Post; body: NewPost };
  "PATCH /posts/:postId": { response: Post; body: Partial<NewPost> };
  "GET /users/:userId/todos": { response: Todo[]; query?: { completed?: "true" | "false" } };
};

export const isPost = hasShape<Post>({ userId: isNumber, id: isNumber, title: isString, body: isString });
const isTodo = hasShape<Todo>({ userId: isNumber, id: isNumber, title: isString, completed: isBoolean });

export const guards: Guards<JsonPlaceholder> = {
  "GET /posts": isArrayOf(isPost),
  "GET /posts/:postId": isPost,
  "POST /posts": isPost,
  "PATCH /posts/:postId": isPost,
  "GET /users/:userId/todos": isArrayOf(isTodo),
};

export function createJsonPlaceholderClient(fetcher?: Fetcher) {
  return createClient<JsonPlaceholder>("https://jsonplaceholder.typicode.com", guards, fetcher);
}
