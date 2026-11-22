// Pure, DOM-free logic: data shapes, guards, and filtering. Easy to test in Node.
import { hasShape, isArrayOf, isNumber, isString } from "#shared/guards.js";

export type Post = { userId: number; id: number; title: string; body: string };
export type Comment = { postId: number; id: number; name: string; email: string; body: string };

export const isPost = hasShape<Post>({ userId: isNumber, id: isNumber, title: isString, body: isString });
export const isPostList = isArrayOf(isPost);
export const isCommentList = isArrayOf(
  hasShape<Comment>({ postId: isNumber, id: isNumber, name: isString, email: isString, body: isString }),
);

export type Filters = { author: number | "all"; search: string };

export function filterPosts(posts: readonly Post[], filters: Filters): Post[] {
  const search = filters.search.trim().toLowerCase();
  return posts.filter(
    (post) =>
      (filters.author === "all" || post.userId === filters.author) &&
      (search === "" || post.title.toLowerCase().includes(search)),
  );
}

export function authorIds(posts: readonly Post[]): number[] {
  return [...new Set(posts.map((post) => post.userId))].sort((a, b) => a - b);
}

export function parseAuthor(value: string): Filters["author"] {
  const id = Number(value);
  return value !== "all" && Number.isInteger(id) ? id : "all";
}
