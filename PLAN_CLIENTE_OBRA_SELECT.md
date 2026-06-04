# Plan: Cliente / Obra Select Pickers (revised)

## Context

Currently `clienteMin` and `obraMin` in `CreateNewTask.jsx` are plain free-text inputs.
Goal: replace with searchable comboboxes backed by `clientes` and `obras` Supabase tables,
for task types **E / S / M** only.

---

## Decisions

| # | Decision |
|---|----------|
| Supabase | ruta-js shares the same Supabase project as the Flutter app |
| UX pattern | **Combobox** (autocomplete inline dropdown) — no nested modals |
| Free-text fallback | Inherent in combobox: any typed value not in list is kept as-is |
| Legacy data | Combobox pre-fills with existing string; no match = still valid, no error |
| Clientes | Load at app start in `App.js`, pass as prop |
| Obras | Load at app start in `App.js` (~3 000 records ≈ 900 KB — fine for client-side filter) |
| Scope | E, S, M only — P and D keep free-text |
| RLS | Already configured; authenticated Supabase session (LoginForm.jsx) satisfies SELECT |

---

## Architecture

### Data loading — both lists at app start

```js
// App.js — alongside existing state init
const [clientesList, setClientesList] = useState([]);
const [obrasList, setObrasList]       = useState([]);

useEffect(() => {
  fetchClientes().then(setClientesList);
  fetchObras().then(setObrasList);           // all rows, no pagination
}, []);
```

Both lists passed as props to `CreateNewTask`.

### Combobox behaviour

- Typing filters the list (word-split AND, case+diacritic insensitive — same logic as Flutter)
- Clicking a suggestion fills the field and collapses the dropdown
- Typing something not in the list is allowed — value is kept as typed (free-text fallback)
- obraMin combobox filters by selected `clienteMin` when one is set; shows all obras when empty
- Selecting a new cliente clears obraMin (same rule as Flutter FleteSearch)

### Components

```
src/
  Combobox.jsx        — generic reusable combobox (input + filtered dropdown)
  Combobox.css
```

`CreateNewTask.jsx` uses `<Combobox>` for clienteMin and obraMin on E/S/M types.
No new modal component needed.

### Combobox option display

| Field | Display label | Sub-label |
|-------|---------------|-----------|
| clienteMin | `clienteMin` | `clienteMax` (full name) |
| obraMin | `obraMin` | `obraMax` (full name / address) |

### No checkbox toggle

Dropped entirely. Free-text is inherent — if user types and doesn't pick from the list,
the typed value is saved. No mode switching.

---

## Steps

1. **`supabaseClient.js`** — add `fetchClientes()` and `fetchObras()` (full fetch, no pagination)
2. **`App.js`** — load both lists on mount; pass as `clientesList` / `obrasList` props to `CreateNewTask`
3. **`Combobox.jsx` + `Combobox.css`** — generic combobox: `value`, `onChange`, `options`, `getLabel`, `getSubLabel`, `placeholder` props; handles open/close, keyboard nav (arrows + Enter + Escape)
4. **`CreateNewTask.jsx`** — swap clienteMin/obraMin `<input>` for `<Combobox>` on E/S/M; obraMin options filtered by current clienteMin; clear obraMin when clienteMin changes
5. **Loading/error states** — disable comboboxes with a subtle spinner while lists load; show inline "no results" message on empty filter
6. **Manual test** — new task picker flow, edit existing task with legacy string, obra filters by cliente, free-text entry saved correctly

---

## Edge cases covered

- **Legacy / unmatched string** — combobox pre-fills with stored value; user can keep or change it
- **No Supabase match** — typed value saved as-is, no error
- **Slow fetch at app start** — comboboxes show as disabled until lists are ready
- **Failed fetch** — comboboxes fall back to plain text input; error logged
- **obraMin with no clienteMin** — shows full obras list, no filter applied
