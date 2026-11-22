import { hasShape, isArrayOf, isBoolean, isNumber, isString } from "#shared/guards.js";
import { fetchJson } from "#shared/http.js";
import type { Todo, User } from "../domain/types.js";
import type { UserRepository } from "./UserRepository.js";

export const isUser = hasShape<User>({
  id: isNumber,
  name: isString,
  username: isString,
  email: isString,
  phone: isString,
  website: isString,
  company: hasShape<User["company"]>({ name: isString }),
  address: hasShape<User["address"]>({ city: isString }),
});

export const isTodo = hasShape<Todo>({ userId: isNumber, id: isNumber, title: isString, completed: isBoolean });

export class HttpUserRepository implements UserRepository {
  readonly label = "Live API (jsonplaceholder.typicode.com)";

  constructor(private readonly baseUrl = "https://jsonplaceholder.typicode.com") {}

  listUsers() {
    return fetchJson(`${this.baseUrl}/users`, isArrayOf(isUser));
  }

  listTodos(userId: number) {
    return fetchJson(`${this.baseUrl}/todos?userId=${userId}`, isArrayOf(isTodo));
  }
}
