// Guards the lesson pages: the code shown next to each result must be exactly the code that runs.
// It reads every project's src/main.ts and compares each example's label with its function body.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";

const projectsDir = new URL("../../", import.meta.url); // Shared/dist/ -> Projects/

/** Removes `// comments`, `return ` keywords, semicolons and whitespace so formatting doesn't matter. */
function normalize(code: string): string {
  return code
    .replace(/\/\/[^\n]*/g, "")
    .replace(/\breturn\s+/g, "")
    .replace(/[;\s]/g, "")
    .replace(/,([)\]}])/g, "$1");
}

/** Finds example(`label`, () => body) calls and returns [label, body] pairs. */
function examples(source: string): Array<[string, string]> {
  const pairs: Array<[string, string]> = [];
  const start = /example\(`((?:\\.|[^`\\])*)`,\s*(?:async\s*)?\(\)\s*=>\s*/g;
  for (let match = start.exec(source); match; match = start.exec(source)) {
    let depth = 1;
    let quote = "";
    let i = start.lastIndex;
    for (; i < source.length && depth > 0; i++) {
      const char = source[i]!;
      if (quote) {
        if (char === "\\") i++;
        else if (char === quote) quote = "";
      } else if (char === '"' || char === "'" || char === "`") quote = char;
      else if ("([{".includes(char)) depth++;
      else if (")]}".includes(char)) depth--;
    }
    let body = source.slice(start.lastIndex, i - 1).trim().replace(/,$/, "").trim();
    if (body.startsWith("{") && body.endsWith("}")) body = body.slice(1, -1);
    const label = match[1]!.replace(/\\`/g, "`").replace(/\\\$\{/g, "${").replace(/\\\\/g, "\\");
    pairs.push([label, body]);
  }
  return pairs;
}

test("every lesson example label matches the code that runs", () => {
  let checked = 0;
  for (const project of readdirSync(projectsDir)) {
    const main = new URL(`${project}/src/main.ts`, projectsDir);
    if (!existsSync(main)) continue;
    const source = readFileSync(main, "utf8");
    if (!source.includes("showLesson")) continue;
    for (const [label, body] of examples(source)) {
      assert.equal(normalize(label), normalize(body), `${project}: label "${label}" does not match its code`);
      checked++;
    }
  }
  assert.ok(checked > 100, `expected over 100 lesson examples, found ${checked}`);
});
