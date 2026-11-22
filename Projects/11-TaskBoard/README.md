# 11 · Task Board

State management without a state library. The whole board is one `BoardState` value, changed only by a pure `reducer(state, action)`. `Action` is a discriminated union, so each `dispatch` call is checked against the data that action needs. Filtered and sorted lists are computed from state instead of being stored. Tasks are saved in `localStorage` and validated when they load, so corrupt saved data is ignored.

No network is needed. You can add tasks, move them between columns, double-click a task to rename it, delete tasks, filter by text or priority, and clear finished tasks.

```bash
cd Projects
npm run build
npm run serve
# open http://localhost:<port>/11-TaskBoard/
```
