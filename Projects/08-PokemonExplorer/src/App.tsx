import { useEffect, useRef, useState } from "#shared/dom.js";
import { fetchJson } from "#shared/http.js";
import type { Result } from "#shared/result.js";
import { API, filterByName, formatBody, idFromUrl, isPokemon, isPokemonPage, pageUrl, titleCase, PAGE_SIZE, type Pokemon, type PokemonPage } from "./pokemon.js";

type Remote<T> = { status: "loading" } | { status: "error"; error: string } | { status: "ready"; data: T };

export function App(): Node {
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  const [list, setList] = useState<Remote<PokemonPage>>({ status: "loading" });
  const [selected, setSelected] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setList({ status: "loading" });
    fetchJson(pageUrl(page), isPokemonPage).then((result) => {
      if (active) setList(result.ok ? { status: "ready", data: result.data } : { status: "error", error: result.error });
    });
    return () => {
      active = false;
    };
  }, [page, retry]);

  const lastPage = list.status === "ready" ? Math.max(0, Math.ceil(list.data.count / PAGE_SIZE) - 1) : page;

  return (
    <div>
      <header className="header">
        <h1>Pokémon Explorer</h1>
        <p className="muted">Paged list + cached detail requests from pokeapi.co.</p>
      </header>

      <div className="row" style={{ marginBottom: "16px" }}>
        <input
          id="search"
          type="search"
          placeholder="Filter this page by name…"
          aria-label="Filter by name"
          value={query}
          style={{ flex: "1", width: "auto" }}
          onInput={(event) => {
            if (event.currentTarget instanceof HTMLInputElement) setQuery(event.currentTarget.value);
          }}
        />
        <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>← Prev</button>
        <span className="muted">Page {page + 1} / {lastPage + 1}</span>
        <button type="button" disabled={page >= lastPage} onClick={() => setPage((p) => p + 1)}>Next →</button>
      </div>

      {selected && <Details name={selected} onClose={() => setSelected(null)} />}

      {list.status === "loading" && <p className="muted" role="status">Loading Pokémon…</p>}
      {list.status === "error" && (
        <p className="notice" role="alert">
          {list.error}
          <button type="button" onClick={() => setRetry((n) => n + 1)}>Retry</button>
        </p>
      )}
      {list.status === "ready" && (
        <ul className="grid list">
          {filterByName(list.data.results, query).map((item) => (
            <li key={item.name}>
              <button type="button" className="card" style={{ width: "100%", textAlign: "left" }} onClick={() => setSelected(item.name)}>
                <span className="muted">#{idFromUrl(item.url) ?? "?"}</span> {titleCase(item.name)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Module-level cache: each Pokémon is fetched at most once per page load.
const detailCache = new Map<string, Promise<Result<Pokemon>>>();

function loadPokemon(name: string): Promise<Result<Pokemon>> {
  let request = detailCache.get(name);
  if (!request) {
    request = fetchJson(`${API}/pokemon/${name}`, isPokemon);
    detailCache.set(name, request);
    request.then((result) => {
      if (!result.ok) detailCache.delete(name); // Do not cache failures.
    });
  }
  return request;
}

function Details({ name, onClose }: { name: string; onClose: () => void }): Node {
  const [state, setState] = useState<Remote<Pokemon>>({ status: "loading" });
  const [imageFailed, setImageFailed] = useState(false);
  const requested = useRef("");

  useEffect(() => {
    requested.current = name;
    setState({ status: "loading" });
    setImageFailed(false);
    loadPokemon(name).then((result) => {
      if (requested.current !== name) return; // A newer selection won.
      setState(result.ok ? { status: "ready", data: result.data } : { status: "error", error: result.error });
    });
  }, [name]);

  return (
    <section className="card" style={{ marginBottom: "16px" }} aria-live="polite">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2>{titleCase(name)}</h2>
        <button type="button" onClick={onClose}>Close</button>
      </div>
      {state.status === "loading" && <p className="muted">Loading details…</p>}
      {state.status === "error" && <p className="notice">{state.error}</p>}
      {state.status === "ready" && (
        <div className="row" style={{ alignItems: "flex-start", gap: "24px" }}>
          {state.data.sprites.front_default && !imageFailed ? (
            <img src={state.data.sprites.front_default} alt={name} width="120" height="120" onError={() => setImageFailed(true)} />
          ) : (
            <div style={{ width: "120px", height: "120px", display: "grid", placeItems: "center", fontSize: "3rem" }} aria-label="No image">❔</div>
          )}
          <div>
            <p>{state.data.types.map((t) => titleCase(t.type.name)).join(" / ")} · {formatBody(state.data)}</p>
            <ul className="list">
              {state.data.stats.map((s) => (
                <li>
                  <strong>{titleCase(s.stat.name)}</strong>: {s.base_stat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
