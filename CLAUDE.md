# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Dev server at http://localhost:3000
npm run build    # Production build
npm test         # Run tests in watch mode
npm test -- --watchAll=false  # Run tests once (CI mode)
```

> **Note:** `react-scripts` requires `NODE_OPTIONS=--openssl-legacy-provider` on newer Node versions. The `cross-env` package is installed for this; if you see OpenSSL errors, set that env var before running.

## Architecture

This is a **weekly task scheduler** built with Create React App. All state is held in-memory (no backend, no persistence).

### Data model

A task is a plain object with these fields:

| Field | Description |
|---|---|
| `id` | Unique string identifier |
| `date` | `"YYYY-MM-DD"` string |
| `index` | Integer position within that day's column |
| `type` | Single char: `P` Proveedor, `E` Entrada, `S` Salida, `M` Mantenimiento, `D` Divisor, `B` Bodega, anything else = none |
| `clienteMin` | Client name (optional) |
| `obraMin` | Work/address description (optional) |
| `equipo` | Team/equipment (optional) |
| `bandera` | Flag label rendered as a banner above the task card (optional) |

### State and data flow

`App.js` owns all state:

- `initialData` is a flat array of task objects (hardcoded; the source of truth on load).
- `castData()` converts it into a 2D array `data[dayIndex][taskIndex]`, aligned to the Monday-anchored week of the first task's date. The parallel `currWeek` array holds the `"YYYY-MM-DD"` string for each column index.
- `data` is stored in `useState`; mutations always end with `setData([...data])` to trigger re-render.
- `insertTask(task)` upserts by `id` — if the task already exists in its day's column it overwrites it, otherwise splices it in at `task.index`.
- `restartIndexes()` renumbers `index` sequentially after any mutation to keep indexes contiguous.

### Component tree

```
App (DragDropContext, owns data + currWeek state)
├── NavBar (month/year label, "Add" button → modal)
│   └── ModalCreateNewTask (react-modal form; calls insertTask on submit)
└── Column × 7  (one per day; receives date, tasks[], droppableId = day index)
    └── Task × N  (Draggable; renders type-colored card + optional bandera banner)
```

### Drag-and-drop

Uses `react-beautiful-dnd`. `droppableId` on each `Column` is the **day index string** (`"0"`–`"6"`). On `onDragEnd`, `source.droppableId` and `destination.droppableId` are used directly as array indices into `data`.

### CSS design system

CSS custom properties are defined in `src/index.css` at `:root`:

| Variable | Value | Used for |
|---|---|---|
| `--bg-base` | `#1e1e2e` | `body` background |
| `--bg-surface` | `#2d2d3f` | columns, modal |
| `--bg-elevated` | `#25253a` | navbar |
| `--text-primary` | `#ffffff` | main text |
| `--text-muted` | `#a0a0b8` | labels, secondary text |
| `--accent` | `#48abcf` | buttons, focus states |
| `--border-radius` | `8px` | rounded corners |

All component CSS files reference these via `var()`. Card type colors in `Task.css` are defined directly (not via variables) and intentionally not overridden.

### Week navigation

`App.js` holds a `weekOffset` integer in state (0 = current week, ±N = adjacent weeks). `castData(tasks, offset)` anchors to today's Monday then shifts by `offset * 7` days. A `useEffect` re-casts `data` when `weekOffset` changes. NavBar `‹`/`›` buttons call `setWeekOffset(prev => prev ± 1)`.

### Card creation and editing

- **Create:** clicking empty space in a column fires `onAddCard()` via `e.target === e.currentTarget` check on the Droppable's inner div. This avoids conflict with react-beautiful-dnd event handling. Modal opens pre-filled with that column's date.
- **Edit:** clicking an existing card fires `onEdit(task)` via `e.stopPropagation()` on the task div. Modal opens pre-filled with the card's current data. `insertTask` overwrites by matching `id`.
- Modal state (`showModal`, `editingTask`) lives in `App.js` and is rendered once at the App level.

### Postgres schema (planned)

```sql
CREATE TABLE tareas (
  id          TEXT        PRIMARY KEY,
  cliente_min TEXT        NOT NULL,        -- maps to task.clienteMin
  tipo        CHAR(1)     NOT NULL,        -- E/S/P/M/D/B/N — determines card color
  fecha       DATE        NOT NULL,        -- maps to task.date
  orden       INTEGER     NOT NULL,        -- 1-based; in-memory index is 0-based, add 1 on write
  obra_min    TEXT,
  equipo      TEXT,
  bandera     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX tareas_fecha_orden_idx ON tareas (fecha, orden);
```

Query pattern: `SELECT * FROM tareas WHERE fecha BETWEEN $monday AND $sunday ORDER BY fecha, orden`

`tipo` values: `E`=Entrada, `S`=Salida, `P`=Proveedor, `M`=Mantenimiento, `D`=Divisor, `B`=Bodega

### Known limitations

- No persistence — refreshing resets all changes (Postgres schema above is planned for future integration).
- Navigating to weeks other than the hardcoded `initialData` week shows blank columns.
