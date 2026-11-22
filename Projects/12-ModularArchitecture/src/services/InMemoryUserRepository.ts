import { err, ok, type Result } from "#shared/result.js";
import type { Todo, User } from "../domain/types.js";
import type { UserRepository } from "./UserRepository.js";

export const sampleUsers: User[] = [
  { id: 1, name: "Ada Lovelace", username: "ada", email: "ada@example.com", phone: "555-0101", website: "example.com", company: { name: "Analytical Engines" }, address: { city: "London" } },
  { id: 2, name: "Grace Hopper", username: "grace", email: "grace@example.com", phone: "555-0102", website: "example.com", company: { name: "Compilers Inc" }, address: { city: "Arlington" } },
  { id: 3, name: "Alan Turing", username: "alan", email: "alan@example.com", phone: "555-0103", website: "example.com", company: { name: "Bletchley Labs" }, address: { city: "Manchester" } },
];

export const sampleTodos: Todo[] = [
  { userId: 1, id: 1, title: "Write the first program", completed: true },
  { userId: 1, id: 2, title: "Describe the engine", completed: false },
  { userId: 2, id: 3, title: "Find the first bug", completed: true },
  { userId: 3, id: 4, title: "Define computability", completed: true },
  { userId: 3, id: 5, title: "Design the imitation game", completed: false },
];

/** Works offline and in tests. Optional delay and failure make loading/error states visible. */
export class InMemoryUserRepository implements UserRepository {
  readonly label = "Offline sample data";

  constructor(
    private readonly users: User[] = sampleUsers,
    private readonly todos: Todo[] = sampleTodos,
    private readonly delayMs = 0,
  ) {}

  async listUsers(): Promise<Result<User[]>> {
    await this.wait();
    return ok(structuredClone(this.users));
  }

  async listTodos(userId: number): Promise<Result<Todo[]>> {
    await this.wait();
    if (!this.users.some((user) => user.id === userId)) return err(`User ${userId} does not exist.`);
    return ok(this.todos.filter((todo) => todo.userId === userId));
  }

  private wait(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.delayMs));
  }
}
