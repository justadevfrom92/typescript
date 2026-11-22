// Every built-in way to narrow a union.

// typeof narrowing
export function padLeft(value: string, padding: number | string): string {
  return typeof padding === "number" ? " ".repeat(padding) + value : padding + value;
}

// truthiness + equality narrowing
export function describeCount(count: number | null | undefined): string {
  if (count == null) return "unknown";
  if (count === 0) return "none";
  return count === 1 ? "one" : "many";
}

// `in` narrowing
type Fish = { swim: () => string };
type Bird = { fly: () => string };
export function move(animal: Fish | Bird): string {
  return "swim" in animal ? animal.swim() : animal.fly();
}

// instanceof narrowing
export function toMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown error";
}

// user-defined type predicate
export type Email = { type: "email"; address: string };
export type Phone = { type: "phone"; number: string };
export type Contact = Email | Phone;

export function isEmail(contact: Contact): contact is Email {
  return contact.type === "email";
}

export function emailsOnly(contacts: Contact[]): string[] {
  return contacts.filter(isEmail).map((contact) => contact.address);
}

// Modelling async state as a union removes "impossible" combinations
// like { loading: true, error: "x", data: [...] }.
export type RemoteData<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

export function renderStatus(state: RemoteData<string[]>): string {
  switch (state.status) {
    case "idle":
      return "Press load to start.";
    case "loading":
      return "Loading…";
    case "success":
      return `Loaded ${state.data.length} items.`;
    case "error":
      return `Failed: ${state.error}`;
  }
}
