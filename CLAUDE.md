# CLAUDE.md

## Commands

```bash
NODE_OPTIONS=--openssl-legacy-provider npm start   # dev server at localhost:3000
npm run build
npm test -- --watchAll=false
```

## Architecture

Weekly task scheduler (Create React App). State in `App.js`, persisted to `localStorage`.

**Task fields:** `id`, `date` (YYYY-MM-DD), `index` (position in day), `type` (E/S/P/M/D/B/C/N), `clienteMin`, `obraMin`, `equipo`, `notas`

**Type C (Combinado):** Single card combining entrada + salida flete. No extra DB column — both equipos are packed into the `equipo` field as `"equipoEntrada --- equipoSalida"` (e.g. `"1Mod/1Mont --- 1Rev"`). Card renders as green top section (cliente, obra, equipo entrada) + orange bottom section (equipo salida). In the modal, type E shows two equipo fields; if "Eq. Salida" is filled on save the type is set to C automatically. Editing a C card opens as E with both fields pre-populated; clearing salida reverts it to E.

**Key state:**
- `data` — 2D array `data[dayIndex][taskIndex]`, built by `castData(tasks, anchorDate)`
- `currWeek` — module-level `let []` of 7 YYYY-MM-DD strings, populated by `castData`
- `anchorDate` — YYYY-MM-DD Monday string driving the current week view
- `selectedDayIndex` — mobile single-day view (0=Mon, 6=Sun)

**Mutations** always end with `restartIndexes()` → `saveTasks(data.flat())` → `setData([...data])`.

## Drag-and-drop

`react-beautiful-dnd`. Column `droppableId` = day index string (`"0"`–`"6"`). All 7 columns stay in DOM on mobile (CSS hides 6); rbd requires this for cross-column drag.

**Mobile cross-day drag**: tabs use `data-day-tab={i}` attributes. `onDragEnd` in App.js uses pointer-position tracking (`lastPointerPos` ref + `mousemove`/`touchmove`) to detect tab drops — rbd Droppable hit detection is broken on mobile when hidden columns have zero-rect positions.

## Mobile layout

`@media (max-width: 768px)`: only `.column_container--active` is shown. NavBar is `position: sticky`. Day tabs in NavBar highlight via local `dragOverIndex` state tracking pointer position.

## CSS variables (src/index.css)

`--bg-base` `--bg-surface` `--bg-elevated` `--text-primary` `--text-muted` `--accent` (#48abcf) `--border-radius`
