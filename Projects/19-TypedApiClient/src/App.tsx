import { useEffect, useState } from "#shared/dom.js";
import { describeError, isRetryable, type ApiError } from "./apiTypes.js";
import { createJsonPlaceholderClient, type Post } from "./jsonPlaceholder.js";

const api = createJsonPlaceholderClient();

type Load<T> = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready"; data: T };

function ErrorNotice({ error, onRetry }: { error: ApiError; onRetry: () => void }): Node {
  return (
    <p className="notice" role="alert">
      {describeError(error)}
      {isRetryable(error) && <button type="button" onClick={onRetry}>Retry</button>}
    </p>
  );
}

export function App(): Node {
  const [userId, setUserId] = useState(1);
  const [posts, setPosts] = useState<Load<Post[]>>({ status: "loading" });
  const [retry, setRetry] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [created, setCreated] = useState<{ status: "idle" } | { status: "saving" } | { status: "error"; error: ApiError } | { status: "saved"; post: Post }>({ status: "idle" });

  useEffect(() => {
    const controller = new AbortController();
    setPosts({ status: "loading" });
    // Route, query and response are all checked: try changing "userId" to "user".
    api("GET /posts", { query: { userId, _limit: 5 }, signal: controller.signal }).then((result) => {
      if (!controller.signal.aborted) setPosts(result.ok ? { status: "ready", data: result.data } : { status: "error", error: result.error });
    });
    return () => controller.abort();
  }, [userId, retry]);

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    if (title.trim() === "" || body.trim() === "") return;
    setCreated({ status: "saving" });
    const result = await api("POST /posts", { body: { userId, title: title.trim(), body: body.trim() } });
    setCreated(result.ok ? { status: "saved", post: result.data } : { status: "error", error: result.error });
    if (result.ok) {
      setTitle("");
      setBody("");
    }
  };

  const text = (setter: (value: string) => void) => (event: Event) => {
    const target = event.currentTarget;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) setter(target.value);
  };

  return (
    <div>
      <header className="header">
        <h1>Typed API Client</h1>
        <p className="muted">
          One endpoint type map → checked routes, path params, queries, bodies, responses and error kinds. Data from jsonplaceholder.typicode.com.
        </p>
      </header>

      <div className="row" role="group" aria-label="User" style={{ marginBottom: "12px" }}>
        {[1, 2, 3, 4, 5].map((id) => (
          <button type="button" aria-pressed={String(id === userId)} onClick={() => setUserId(id)}>User {id}</button>
        ))}
      </div>

      <section className="card" style={{ marginBottom: "16px" }}>
        <h2>
          <code>GET /posts?userId={userId}&amp;_limit=5</code>
        </h2>
        {posts.status === "loading" && <p className="muted" role="status">Loading…</p>}
        {posts.status === "error" && <ErrorNotice error={posts.error} onRetry={() => setRetry((n) => n + 1)} />}
        {posts.status === "ready" && (
          <ul className="list">
            {posts.data.map((post) => (
              <li>
                <strong>#{post.id}</strong> {post.title}
              </li>
            ))}
          </ul>
        )}
      </section>

      <form className="card stack" onSubmit={submit}>
        <h2>
          <code>POST /posts</code> <span className="muted">(jsonplaceholder fakes the save)</span>
        </h2>
        <div>
          <label htmlFor="title">Title</label>
          <input id="title" value={title} onInput={text(setTitle)} required />
        </div>
        <div>
          <label htmlFor="body">Body</label>
          <textarea id="body" rows="3" onInput={text(setBody)} required>{body}</textarea>
        </div>
        <button type="submit" className="primary" disabled={created.status === "saving" || title.trim() === "" || body.trim() === ""}>
          {created.status === "saving" ? "Saving…" : "Create post"}
        </button>
        {created.status === "error" && <p className="notice">{describeError(created.error)}</p>}
        {created.status === "saved" && (
          <p className="card">
            Created post <strong>#{created.post.id}</strong> for user {created.post.userId}: “{created.post.title}”
          </p>
        )}
      </form>
    </div>
  );
}
