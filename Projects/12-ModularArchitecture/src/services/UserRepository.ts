// The service layer depends on this interface, not on fetch.
// Swap implementations (HTTP, in-memory, a future cache) without touching the UI.
import type { Result } from "#shared/result.js";
import type { Todo, User } from "../domain/types.js";

export interface UserRepository {
  readonly label: string;
  listUsers(): Promise<Result<User[]>>;
  listTodos(userId: number): Promise<Result<Todo[]>>;
}
