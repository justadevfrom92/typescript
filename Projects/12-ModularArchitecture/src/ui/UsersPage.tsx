import { useEffect, useState } from "#shared/dom.js";
import { initials, searchUsers, sortUsers, type SortKey } from "../domain/rules.js";
import { href } from "../router/routes.js";
import type { Directory } from "../services/directory.js";
import { useStore } from "../state/store.js";
import { RemoteView } from "./RemoteView.js";

export function UsersPage({ directory }: { directory: Directory }): Node {
  const state = useStore(directory.store);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");

  useEffect(() => void directory.loadUsers(), [state.source]);

  return (
    <section className="stack">
      <div className="row">
        <input
          id="user-search"
          type="search"
          placeholder="Search people or companies…"
          aria-label="Search users"
          value={query}
          style={{ flex: "1", width: "auto" }}
          onInput={(event) => event.currentTarget instanceof HTMLInputElement && setQuery(event.currentTarget.value)}
        />
        <select
          id="user-sort"
          aria-label="Sort by"
          value={sortKey}
          style={{ width: "auto" }}
          onChange={(event) => {
            const value = (event.currentTarget as HTMLSelectElement).value;
            if (value === "name" || value === "company" || value === "city") setSortKey(value);
          }}
        >
          <option value="name">Sort by name</option>
          <option value="company">Sort by company</option>
          <option value="city">Sort by city</option>
        </select>
      </div>

      <RemoteView state={state.users} onRetry={() => directory.loadUsers(true)}>
        {(users) => {
          const visible = sortUsers(searchUsers(users, query), sortKey);
          return visible.length === 0 ? (
            <p className="muted">No one matches “{query}”.</p>
          ) : (
            <ul className="grid list">
              {visible.map((user) => (
                <li key={user.id}>
                  <a className="card row" href={href({ name: "user", id: user.id })} style={{ textDecoration: "none", color: "inherit" }}>
                    <span aria-hidden="true" style={{ width: "40px", height: "40px", borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--accent)", color: "var(--accent-text)", fontWeight: "700" }}>
                      {initials(user.name)}
                    </span>
                    <span>
                      <strong>{user.name}</strong>
                      <br />
                      <span className="muted">{user.company.name} · {user.address.city}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          );
        }}
      </RemoteView>
    </section>
  );
}
