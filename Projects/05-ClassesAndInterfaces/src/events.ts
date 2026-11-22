// A typed event emitter: the event map type decides which payload each event carries.

export class TypedEmitter<Events extends Record<string, unknown>> {
  #listeners: { [E in keyof Events]?: Array<(payload: Events[E]) => void> } = {};

  on<E extends keyof Events>(event: E, listener: (payload: Events[E]) => void): () => void {
    (this.#listeners[event] ??= []).push(listener);
    return () => this.off(event, listener);
  }

  off<E extends keyof Events>(event: E, listener: (payload: Events[E]) => void): void {
    this.#listeners[event] = this.#listeners[event]?.filter((item) => item !== listener);
  }

  protected emit<E extends keyof Events>(event: E, payload: Events[E]): void {
    this.#listeners[event]?.forEach((listener) => listener(payload));
  }
}
