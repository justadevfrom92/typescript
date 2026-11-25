// The DOM layer. Every querySelector result is checked, so a renamed id fails loudly, not silently.
import { fetchJson } from "#shared/http.js";
import { authorIds, filterPosts, isCommentList, isPostList, parseAuthor, type Filters, type Post } from "./posts.js";

const API = "https://jsonplaceholder.typicode.com";

function byId<T extends HTMLElement>(id: string, type: new () => T): T {
  const element = document.getElementById(id);
  if (!(element instanceof type)) throw new Error(`Missing #${id}`);
  return element;
}

const authorSelect = byId("author", HTMLSelectElement);
const searchInput = byId("search", HTMLInputElement);
const statusText = byId("status", HTMLParagraphElement);
const postList = byId("posts", HTMLUListElement);
const template = byId("post-template", HTMLTemplateElement);

let posts: Post[] = [];
const filters: Filters = { author: "all", search: "" };

function setStatus(message: string, isError = false, retry?: () => void): void {
  statusText.className = isError ? "notice" : "muted";
  statusText.textContent = message;
  if (retry) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Retry";
    button.addEventListener("click", retry);
    statusText.append(button);
  }
}

function renderPosts(): void {
  const visible = filterPosts(posts, filters);
  postList.replaceChildren(...visible.map(renderPost));
  setStatus(`${visible.length} of ${posts.length} posts`);
}

function renderPost(post: Post): HTMLElement {
  const fragment = template.content.cloneNode(true) as DocumentFragment;
  const item = fragment.querySelector("li")!; // The template above guarantees these exist.
  item.querySelector(".title")!.textContent = post.title;
  item.querySelector(".body")!.textContent = post.body;
  const toggle = item.querySelector<HTMLButtonElement>(".toggle")!;
  const comments = item.querySelector<HTMLUListElement>(".comments")!;
  toggle.addEventListener("click", () => toggleComments(post.id, toggle, comments));
  return item;
}

async function toggleComments(postId: number, button: HTMLButtonElement, list: HTMLUListElement): Promise<void> {
  // The button's state is stored on the element, so an error message in the list
  // is not mistaken for loaded comments: "Retry comments" fetches again.
  if (button.dataset["state"] === "open") {
    list.replaceChildren();
    button.dataset["state"] = "closed";
    button.textContent = "Show comments";
    return;
  }
  button.disabled = true;
  button.textContent = "Loading…";
  const result = await fetchJson(`${API}/posts/${postId}/comments`, isCommentList);
  button.disabled = false;
  if (!result.ok) {
    button.textContent = "Retry comments";
    list.replaceChildren(Object.assign(document.createElement("li"), { className: "field-error", textContent: result.error }));
    return;
  }
  button.dataset["state"] = "open";
  button.textContent = "Hide comments";
  list.replaceChildren(
    ...result.data.map((comment) => {
      const li = document.createElement("li");
      const strong = Object.assign(document.createElement("strong"), { textContent: comment.email });
      li.append(strong, document.createElement("br"), comment.body);
      return li;
    }),
  );
}

async function loadPosts(): Promise<void> {
  setStatus("Loading posts…");
  const result = await fetchJson(`${API}/posts`, isPostList);
  if (!result.ok) {
    setStatus(result.error, true, loadPosts);
    return;
  }
  posts = result.data;
  authorSelect.replaceChildren(
    new Option("All authors", "all"),
    ...authorIds(posts).map((id) => new Option(`Author ${id}`, String(id))),
  );
  renderPosts();
}

authorSelect.addEventListener("change", () => {
  filters.author = parseAuthor(authorSelect.value);
  renderPosts();
});
searchInput.addEventListener("input", () => {
  filters.search = searchInput.value;
  renderPosts();
});
byId("filters", HTMLFormElement).addEventListener("submit", (event) => event.preventDefault());

void loadPosts();
