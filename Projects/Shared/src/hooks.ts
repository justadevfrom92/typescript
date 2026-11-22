// Minimal hooks with whole-tree re-rendering.
// mount(App, root) renders App; any setState schedules one batched re-render.
// Each component instance gets its own hook slot, identified by
// (component function, key prop or its position among same-type siblings).

type Slot = { hooks: unknown[]; cleanups: Array<() => void> };
type EffectHook = { deps: readonly unknown[] | undefined; cleanup?: (() => void) | undefined };
type Effect = () => void | (() => void);

let rootRender: (() => void) | null = null;
let currentSlot: Slot | null = null;
let hookIndex = 0;
let slots = new Map<string, Slot>();
let visited = new Map<string, Slot>();
let counters = new Map<Function, number>();
let componentIds = new Map<Function, number>();
let pendingEffects: Array<() => void> = [];
let renderQueued = false;

function componentId(fn: Function): number {
  let id = componentIds.get(fn);
  if (id === undefined) {
    id = componentIds.size;
    componentIds.set(fn, id);
  }
  return id;
}

export function renderComponent<P>(fn: (props: P) => Node, props: P, key?: string | number): Node {
  if (!rootRender) return fn(props); // Outside mount(): plain function call, hooks unavailable.

  const position = counters.get(fn) ?? 0;
  counters.set(fn, position + 1);
  const id = `${componentId(fn)}:${key ?? "#" + position}`;
  const slot = slots.get(id) ?? { hooks: [], cleanups: [] };
  visited.set(id, slot);

  const previousSlot = currentSlot;
  const previousIndex = hookIndex;
  currentSlot = slot;
  hookIndex = 0;
  try {
    return fn(props);
  } finally {
    currentSlot = previousSlot;
    hookIndex = previousIndex;
  }
}

function nextHook(): { slot: Slot; index: number } {
  if (!currentSlot) throw new Error("Hooks can only be called inside a component rendered by mount().");
  return { slot: currentSlot, index: hookIndex++ };
}

export type SetState<T> = (next: T | ((previous: T) => T)) => void;

export function useState<T>(initial: T | (() => T)): [T, SetState<T>] {
  const { slot, index } = nextHook();
  if (!(index in slot.hooks)) {
    slot.hooks[index] = typeof initial === "function" ? (initial as () => T)() : initial;
  }
  const setState: SetState<T> = (next) => {
    const previous = slot.hooks[index] as T;
    const value = typeof next === "function" ? (next as (previous: T) => T)(previous) : next;
    if (Object.is(value, previous)) return;
    slot.hooks[index] = value;
    scheduleRender();
  };
  return [slot.hooks[index] as T, setState];
}

export function useReducer<S, A>(reducer: (state: S, action: A) => S, initial: S): [S, (action: A) => void] {
  const [state, setState] = useState(initial);
  return [state, (action: A) => setState((previous) => reducer(previous, action))];
}

/** Runs `effect` after render when `deps` change. Return a function to clean up. */
export function useEffect(effect: Effect, deps?: readonly unknown[]): void {
  const { slot, index } = nextHook();
  const previous = slot.hooks[index] as EffectHook | undefined;
  const changed = !previous || !deps || !previous.deps || deps.some((dep, i) => !Object.is(dep, previous.deps?.[i]));
  if (!changed) return;

  const hook: EffectHook = { deps, cleanup: previous?.cleanup };
  slot.hooks[index] = hook;
  pendingEffects.push(() => {
    hook.cleanup?.();
    const cleanup = effect();
    hook.cleanup = typeof cleanup === "function" ? cleanup : undefined;
  });
}

/** Keeps a mutable value between renders without triggering a re-render. */
export function useRef<T>(initial: T): { current: T } {
  const { slot, index } = nextHook();
  if (!(index in slot.hooks)) slot.hooks[index] = { current: initial };
  return slot.hooks[index] as { current: T };
}

function scheduleRender(): void {
  if (renderQueued || !rootRender) return;
  renderQueued = true;
  queueMicrotask(() => {
    renderQueued = false;
    rootRender?.();
  });
}

function cleanupSlot(slot: Slot): void {
  for (const hook of slot.hooks) {
    if (hook && typeof hook === "object" && "cleanup" in hook) (hook as EffectHook).cleanup?.();
  }
}

/** Renders `App` into `container` and re-renders it whenever state changes. */
export function mount(App: () => Node, container: HTMLElement): void {
  rootRender = () => {
    visited = new Map();
    counters = new Map();
    pendingEffects = [];

    // Remember focus so typing in an input survives the re-render.
    const active = document.activeElement;
    const focusId = active instanceof HTMLElement ? active.id : "";
    const selection: [number | null, number | null] | null =
      active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement
        ? [active.selectionStart, active.selectionEnd]
        : null;

    const tree = renderComponent(App, {});
    container.replaceChildren(tree);

    if (focusId) {
      const element = document.getElementById(focusId);
      element?.focus();
      if (selection && (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
        try {
          element.setSelectionRange(selection[0], selection[1]);
        } catch {
          // Some input types (number, email) do not support selection ranges.
        }
      }
    }

    // Components that disappeared from the tree get their effects cleaned up.
    for (const [id, slot] of slots) if (!visited.has(id)) cleanupSlot(slot);
    slots = visited;

    const effects = pendingEffects;
    pendingEffects = [];
    effects.forEach((run) => run());
  };
  rootRender();
}
