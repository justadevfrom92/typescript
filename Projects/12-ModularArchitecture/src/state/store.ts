// A tiny observable store: state lives outside components, so any page can read it
// and data survives route changes. `useStore` connects it to the hook runtime.
import { useEffect, useState } from "#shared/dom.js";

export type Store<S> = {
  get(): S;
  set(update: (state: S) => S): void;
  subscribe(listener: (state: S) => void): () => void;
};

export function createStore<S>(initial: S): Store<S> {
  let state = initial;
  const listeners = new Set<(state: S) => void>();
  return {
    get: () => state,
    set(update) {
      const next = update(state);
      if (Object.is(next, state)) return;
      state = next;
      listeners.forEach((listener) => listener(state));
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/** Re-renders the calling component whenever the store changes. */
export function useStore<S>(store: Store<S>): S {
  const [, setVersion] = useState(0);
  useEffect(() => store.subscribe(() => setVersion((n) => n + 1)), [store]);
  return store.get();
}
