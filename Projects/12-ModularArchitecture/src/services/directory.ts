// Application service: coordinates a repository and the store.
// The UI calls these methods; it never fetches or reshapes data itself.
import type { Remote, Todo, User } from "../domain/types.js";
import { createStore, type Store } from "../state/store.js";
import type { UserRepository } from "./UserRepository.js";

export type DirectoryState = {
  source: string;
  users: Remote<User[]>;
  todos: Record<number, Remote<Todo[]>>;
};

export type Directory = {
  store: Store<DirectoryState>;
  loadUsers(force?: boolean): Promise<void>;
  loadTodos(userId: number, force?: boolean): Promise<void>;
  useRepository(repository: UserRepository): void;
};

export function createDirectory(initialRepository: UserRepository): Directory {
  let repository = initialRepository;
  const store = createStore<DirectoryState>({ source: repository.label, users: { status: "idle" }, todos: {} });

  const directory: Directory = {
    store,

    async loadUsers(force = false) {
      const current = store.get().users.status;
      if (!force && (current === "ready" || current === "loading")) return;
      store.set((state) => ({ ...state, users: { status: "loading" } }));
      const result = await repository.listUsers();
      store.set((state) => ({
        ...state,
        users: result.ok ? { status: "ready", data: result.data } : { status: "error", error: result.error },
      }));
    },

    async loadTodos(userId, force = false) {
      const current = store.get().todos[userId]?.status;
      if (!force && (current === "ready" || current === "loading")) return;
      const setTodos = (value: Remote<Todo[]>) => store.set((state) => ({ ...state, todos: { ...state.todos, [userId]: value } }));
      setTodos({ status: "loading" });
      const result = await repository.listTodos(userId);
      setTodos(result.ok ? { status: "ready", data: result.data } : { status: "error", error: result.error });
    },

    useRepository(next) {
      repository = next;
      store.set(() => ({ source: next.label, users: { status: "idle" }, todos: {} }));
      void directory.loadUsers();
    },
  };
  return directory;
}
