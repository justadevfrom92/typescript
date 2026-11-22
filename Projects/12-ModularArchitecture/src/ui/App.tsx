import { useRoute } from "../router/useRoute.js";
import { href } from "../router/routes.js";
import type { Directory } from "../services/directory.js";
import type { UserRepository } from "../services/UserRepository.js";
import { useStore } from "../state/store.js";
import { AboutPage, NotFoundPage } from "./AboutPage.js";
import { UserPage } from "./UserPage.js";
import { UsersPage } from "./UsersPage.js";

export type AppProps = { directory: Directory; repositories: readonly UserRepository[] };

export function App({ directory, repositories }: AppProps): Node {
  const route = useRoute();
  const { source } = useStore(directory.store);

  const page = (() => {
    switch (route.name) {
      case "users":
        return <UsersPage directory={directory} />;
      case "user":
        return <UserPage directory={directory} id={route.id} />;
      case "about":
        return <AboutPage />;
      case "notFound":
        return <NotFoundPage path={route.path} />;
    }
  })();

  return (
    <div>
      <header className="header stack">
        <div>
          <h1>Team Directory</h1>
          <p className="muted">Layered architecture: domain → services → state → UI, with a hash router.</p>
        </div>
        <nav className="row" aria-label="Main">
          <a href={href({ name: "users" })} aria-current={route.name === "users" ? "page" : undefined}>People</a>
          <a href={href({ name: "about" })} aria-current={route.name === "about" ? "page" : undefined}>Architecture</a>
          <label className="row" style={{ marginLeft: "auto", fontWeight: "400" }}>
            Data source
            <select
              id="data-source"
              value={source}
              style={{ width: "auto" }}
              onChange={(event) => {
                const next = repositories.find((repository) => repository.label === (event.currentTarget as HTMLSelectElement).value);
                if (next) directory.useRepository(next);
              }}
            >
              {repositories.map((repository) => (
                <option value={repository.label}>{repository.label}</option>
              ))}
            </select>
          </label>
        </nav>
      </header>
      {page}
    </div>
  );
}
