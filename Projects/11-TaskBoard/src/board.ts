// The whole board is one state value changed only by a pure reducer.
// Actions are a discriminated union, so every action carries exactly the data it needs.
import { hasShape, isArrayOf, isNumber, isString } from "#shared/guards.js";

export const Columns = ["todo", "doing", "done"] as const;
export type Column = (typeof Columns)[number];
export type Priority = "low" | "normal" | "high";

export type Task = { id: string; title: string; column: Column; priority: Priority; createdAt: number };
export type Filter = { text: string; priority: Priority | "all" };
export type BoardState = { tasks: Task[]; filter: Filter };

export type Action =
  | { type: "add"; title: string; priority: Priority; id: string; now: number }
  | { type: "move"; id: string; direction: -1 | 1 }
  | { type: "rename"; id: string; title: string }
  | { type: "remove"; id: string }
  | { type: "clearDone" }
  | { type: "filter"; filter: Partial<Filter> };

export const columnTitles: Record<Column, string> = { todo: "To do", doing: "In progress", done: "Done" };

export const initialState: BoardState = { tasks: [], filter: { text: "", priority: "all" } };

export function reducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    case "add": {
      const title = action.title.trim();
      if (title === "") return state;
      const task: Task = { id: action.id, title, column: "todo", priority: action.priority, createdAt: action.now };
      return { ...state, tasks: [...state.tasks, task] };
    }
    case "move":
      return updateTask(state, action.id, (task) => {
        const next = Columns[Columns.indexOf(task.column) + action.direction];
        return next ? { ...task, column: next } : task;
      });
    case "rename": {
      const title = action.title.trim();
      return title === "" ? state : updateTask(state, action.id, (task) => ({ ...task, title }));
    }
    case "remove":
      return { ...state, tasks: state.tasks.filter((task) => task.id !== action.id) };
    case "clearDone":
      return { ...state, tasks: state.tasks.filter((task) => task.column !== "done") };
    case "filter":
      return { ...state, filter: { ...state.filter, ...action.filter } };
  }
}

function updateTask(state: BoardState, id: string, change: (task: Task) => Task): BoardState {
  return { ...state, tasks: state.tasks.map((task) => (task.id === id ? change(task) : task)) };
}

const priorityOrder: Record<Priority, number> = { high: 0, normal: 1, low: 2 };

/** Derived data: never stored, always computed from state. */
export function visibleTasks(state: BoardState, column: Column): Task[] {
  const text = state.filter.text.trim().toLowerCase();
  return state.tasks
    .filter((task) => task.column === column)
    .filter((task) => state.filter.priority === "all" || task.priority === state.filter.priority)
    .filter((task) => text === "" || task.title.toLowerCase().includes(text))
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority] || a.createdAt - b.createdAt);
}

export function progress(tasks: readonly Task[]): number {
  return tasks.length === 0 ? 0 : Math.round((tasks.filter((task) => task.column === "done").length / tasks.length) * 100);
}

const isColumn = (value: unknown): value is Column => Columns.includes(value as Column);
const isPriority = (value: unknown): value is Priority => value === "low" || value === "normal" || value === "high";

export const isTaskList = isArrayOf(
  hasShape<Task>({ id: isString, title: isString, column: isColumn, priority: isPriority, createdAt: isNumber }),
);
