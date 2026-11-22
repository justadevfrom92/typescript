import { useEffect } from "#shared/dom.js";
import { completionRate } from "../domain/rules.js";
import { href } from "../router/routes.js";
import type { Directory } from "../services/directory.js";
import { useStore } from "../state/store.js";
import { RemoteView } from "./RemoteView.js";

export function UserPage({ directory, id }: { directory: Directory; id: number }): Node {
  const state = useStore(directory.store);

  useEffect(() => {
    void directory.loadUsers();
    void directory.loadTodos(id);
  }, [id, state.source]);

  return (
    <section className="stack">
      <a href={href({ name: "users" })}>← All people</a>
      <RemoteView state={state.users} onRetry={() => directory.loadUsers(true)}>
        {(users) => {
          const user = users.find((candidate) => candidate.id === id);
          if (!user) return <p className="notice">No person with id {id}.</p>;
          return (
            <div className="stack">
              <div className="card">
                <h2>{user.name}</h2>
                <p className="muted">@{user.username} · {user.company.name} · {user.address.city}</p>
                <p>
                  <a href={`mailto:${user.email}`}>{user.email}</a> · {user.phone}
                </p>
              </div>
              <div className="card">
                <RemoteView state={state.todos[id] ?? { status: "idle" }} onRetry={() => directory.loadTodos(id, true)}>
                  {(todos) => (
                    <div>
                      <h2>
                        Todos <span className="muted">({completionRate(todos)}% complete)</span>
                      </h2>
                      <progress max="100" value={completionRate(todos)} style={{ width: "100%" }} />
                      <ul className="list">
                        {todos.map((todo) => (
                          <li>
                            {todo.completed ? "✅" : "⬜"} {todo.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </RemoteView>
              </div>
            </div>
          );
        }}
      </RemoteView>
    </section>
  );
}
