// Renders a language lesson as a web page: each example runs in the browser
// and shows its result (or the error it throws) next to the code that produced it.
// Plain DOM on purpose, so lessons that come before JSX don't depend on it.

export type Example = { code: string; run: () => unknown };
export type Section = { heading: string; note?: string; examples: Example[] };
export type Lesson = { title: string; intro: string; sections: Section[] };

/** Shorthand for one example: example("add(1, 2)", () => add(1, 2)) */
export function example(code: string, run: () => unknown): Example {
  return { code, run };
}

export function formatValue(value: unknown): string {
  if (value === undefined) return "undefined";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "function") return `ƒ ${value.name || "anonymous"}()`;
  if (typeof value === "symbol" || typeof value === "bigint") return String(value);
  if (value instanceof Date) return `Date(${value.toISOString()})`;
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (value instanceof Map) return `Map ${formatValue(Object.fromEntries(value))}`;
  if (value instanceof Set) return `Set ${formatValue([...value])}`;
  try {
    return JSON.stringify(value, (_key, item: unknown) => (item === undefined ? "undefined" : item)) ?? String(value);
  } catch {
    return String(value);
  }
}

async function runExample(item: Example): Promise<{ text: string; failed: boolean }> {
  try {
    return { text: formatValue(await item.run()), failed: false };
  } catch (error) {
    return { text: `throws ${formatValue(error)}`, failed: true };
  }
}

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export async function showLesson(lesson: Lesson, root: HTMLElement | null = document.getElementById("app")): Promise<void> {
  if (!root) return;
  document.title = lesson.title;
  const header = element("header", "header");
  header.append(element("h1", "", lesson.title), element("p", "muted", lesson.intro));
  root.replaceChildren(header);

  for (const section of lesson.sections) {
    const card = element("section", "card stack");
    card.style.marginBottom = "16px";
    card.append(element("h2", "", section.heading));
    if (section.note) card.append(element("p", "muted", section.note));
    const list = element("dl", "examples");
    for (const item of section.examples) {
      const result = await runExample(item);
      const code = element("dt", "");
      code.append(element("code", "", item.code));
      list.append(code, element("dd", result.failed ? "field-error" : "", `→ ${result.text}`));
    }
    card.append(list);
    root.append(card);
  }

  const footer = element(
    "p",
    "muted",
    "Each code line above is exactly the code that ran. For multi-line examples, the result is the value of the last line. Source: this project's src/main.ts. Change it, run npm run build, and reload.",
  );
  root.append(footer);
}
