import { test } from "node:test";
import assert from "node:assert/strict";
import { initialState, isTaskList, progress, reducer, visibleTasks, type Action, type BoardState } from "./board.js";

function run(...actions: Action[]): BoardState {
  return actions.reduce(reducer, initialState);
}

const add = (id: string, title: string, priority: "low" | "normal" | "high" = "normal"): Action => ({
  type: "add", id, title, priority, now: Number(id),
});

test("add ignores blank titles and trims", () => {
  const state = run(add("1", "  Write docs "), add("2", "   "));
  assert.deepEqual(state.tasks.map((task) => task.title), ["Write docs"]);
});

test("move stays inside the board", () => {
  const state = run(add("1", "A"), { type: "move", id: "1", direction: -1 }, { type: "move", id: "1", direction: 1 }, { type: "move", id: "1", direction: 1 }, { type: "move", id: "1", direction: 1 });
  assert.equal(state.tasks[0]?.column, "done");
});

test("rename, remove and clearDone", () => {
  let state = run(add("1", "A"), add("2", "B"), { type: "rename", id: "1", title: "A2" }, { type: "rename", id: "2", title: " " });
  assert.deepEqual(state.tasks.map((task) => task.title), ["A2", "B"]);
  state = reducer(state, { type: "remove", id: "2" });
  state = reducer(reducer(state, { type: "move", id: "1", direction: 1 }), { type: "move", id: "1", direction: 1 });
  assert.equal(progress(state.tasks), 100);
  assert.equal(reducer(state, { type: "clearDone" }).tasks.length, 0);
});

test("visibleTasks filters and sorts by priority", () => {
  const state = run(add("1", "Low thing", "low"), add("2", "Urgent thing", "high"), add("3", "Other"), { type: "filter", filter: { text: "thing" } });
  assert.deepEqual(visibleTasks(state, "todo").map((task) => task.id), ["2", "1"]);
  const highOnly = reducer(state, { type: "filter", filter: { priority: "high" } });
  assert.equal(visibleTasks(highOnly, "todo").length, 1);
});

test("reducer never mutates the previous state", () => {
  const before = run(add("1", "A"));
  const snapshot = JSON.stringify(before);
  reducer(before, { type: "move", id: "1", direction: 1 });
  assert.equal(JSON.stringify(before), snapshot);
});

test("isTaskList validates stored data", () => {
  assert.equal(isTaskList(run(add("1", "A")).tasks), true);
  assert.equal(isTaskList([{ id: "1", title: "A", column: "archived", priority: "low", createdAt: 1 }]), false);
});
