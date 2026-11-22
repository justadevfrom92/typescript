import { useEffect, useReducer, useState } from "#shared/dom.js";
import { loadJson, saveJson } from "#shared/storage.js";
import { columnTitles, Columns, initialState, isTaskList, progress, reducer, visibleTasks, type Action, type Column, type Priority, type Task } from "./board.js";

const STORAGE_KEY = "task-board";
const newId = () => crypto.randomUUID?.() ?? String(Date.now() + Math.random());

export function App(): Node {
  const [state, dispatch] = useReducer(reducer, { ...initialState, tasks: loadJson(STORAGE_KEY, isTaskList, []) });
  const [draft, setDraft] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");

  useEffect(() => saveJson(STORAGE_KEY, state.tasks), [state.tasks]);

  const add = (event: SubmitEvent) => {
    event.preventDefault();
    dispatch({ type: "add", title: draft, priority, id: newId(), now: Date.now() });
    setDraft("");
  };

  return (
    <div>
      <header className="header">
        <h1>Task Board</h1>
        <p className="muted">
          useReducer + a discriminated union of actions, saved to localStorage. {state.tasks.length} tasks · {progress(state.tasks)}% done
        </p>
      </header>

      <form className="row card" onSubmit={add} style={{ marginBottom: "12px" }}>
        <input
          id="new-task"
          placeholder="What needs doing?"
          aria-label="New task"
          value={draft}
          style={{ flex: "2", width: "auto", minWidth: "180px" }}
          onInput={(event) => event.currentTarget instanceof HTMLInputElement && setDraft(event.currentTarget.value)}
        />
        <PrioritySelect id="new-priority" value={priority} onChange={(value) => value !== "all" && setPriority(value)} />
        <button type="submit" className="primary" disabled={draft.trim() === ""}>Add</button>
      </form>

      <div className="row" style={{ marginBottom: "16px" }}>
        <input
          id="filter-text"
          type="search"
          placeholder="Filter tasks…"
          aria-label="Filter tasks"
          value={state.filter.text}
          style={{ flex: "1", width: "auto" }}
          onInput={(event) => event.currentTarget instanceof HTMLInputElement && dispatch({ type: "filter", filter: { text: event.currentTarget.value } })}
        />
        <PrioritySelect id="filter-priority" value={state.filter.priority} includeAll onChange={(value) => dispatch({ type: "filter", filter: { priority: value } })} />
        <button type="button" onClick={() => dispatch({ type: "clearDone" })}>Clear done</button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))" }}>
        {Columns.map((column) => (
          <BoardColumn key={column} column={column} tasks={visibleTasks(state, column)} dispatch={dispatch} />
        ))}
      </div>
    </div>
  );
}

type ColumnProps = { column: Column; tasks: Task[]; dispatch: (action: Action) => void };

function BoardColumn({ column, tasks, dispatch }: ColumnProps): Node {
  return (
    <section className="card">
      <h2>
        {columnTitles[column]} <span className="muted">({tasks.length})</span>
      </h2>
      {tasks.length === 0 && <p className="muted">Nothing here.</p>}
      <ul className="list">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} dispatch={dispatch} />
        ))}
      </ul>
    </section>
  );
}

const priorityBadge: Record<Priority, string> = { high: "🔴 High", normal: "🟡 Normal", low: "🟢 Low" };

function TaskItem({ task, dispatch }: { task: Task; dispatch: (action: Action) => void }): Node {
  const [editing, setEditing] = useState(false);

  return (
    <li>
      {editing ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const input = (event.currentTarget as HTMLFormElement).elements.namedItem("title");
            if (input instanceof HTMLInputElement) dispatch({ type: "rename", id: task.id, title: input.value });
            setEditing(false);
          }}
        >
          <input name="title" aria-label="Task title" value={task.title} ref={(element) => element.focus()} />
        </form>
      ) : (
        <strong onDblClick={() => setEditing(true)} title="Double-click to rename">{task.title}</strong>
      )}
      <div className="row muted" style={{ fontSize: "0.85rem", marginTop: "4px" }}>
        <span>{priorityBadge[task.priority]}</span>
        <button type="button" aria-label="Move left" disabled={task.column === "todo"} onClick={() => dispatch({ type: "move", id: task.id, direction: -1 })}>←</button>
        <button type="button" aria-label="Move right" disabled={task.column === "done"} onClick={() => dispatch({ type: "move", id: task.id, direction: 1 })}>→</button>
        <button type="button" aria-label="Rename" onClick={() => setEditing(!editing)}>✎</button>
        <button type="button" aria-label="Delete" onClick={() => dispatch({ type: "remove", id: task.id })}>✕</button>
      </div>
    </li>
  );
}

type PriorityValue = Priority | "all";
type SelectProps = { id: string; value: PriorityValue; includeAll?: boolean; onChange: (value: PriorityValue) => void };

function PrioritySelect({ id, value, includeAll = false, onChange }: SelectProps): Node {
  const options: PriorityValue[] = includeAll ? ["all", "high", "normal", "low"] : ["high", "normal", "low"];
  return (
    <select
      id={id}
      aria-label="Priority"
      value={value}
      style={{ width: "auto" }}
      onChange={(event) => {
        const selected = options.find((option) => option === (event.currentTarget as HTMLSelectElement).value);
        if (selected) onChange(selected);
      }}
    >
      {options.map((option) => (
        <option value={option}>{option === "all" ? "All priorities" : priorityBadge[option]}</option>
      ))}
    </select>
  );
}
