// A generic component: TypeScript infers T from `state`, so `children` receives typed data.
import type { Remote } from "../domain/types.js";

type Props<T> = {
  state: Remote<T>;
  onRetry: () => void;
  children: (data: T) => Node;
};

export function RemoteView<T>({ state, onRetry, children }: Props<T>): Node {
  switch (state.status) {
    case "idle":
    case "loading":
      return <p className="muted" role="status">Loading…</p>;
    case "error":
      return (
        <p className="notice" role="alert">
          {state.error}
          <button type="button" onClick={onRetry}>Retry</button>
        </p>
      );
    case "ready":
      return children(state.data);
  }
}
