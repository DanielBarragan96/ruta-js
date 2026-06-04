# How We Built the Select Cliente / Obra Screens

This document is a reference prompt for recreating, extending, or onboarding to the
cliente/obra selection pattern used throughout the app.

---

## Overview

Two reusable picker screens handle entity selection:

| Screen | File | Returns |
|---|---|---|
| `ClienteSelect` | `lib/cliente/ClienteSelect.dart` | `Cliente` object via `Navigator.pop` |
| `ObraSelect` | `lib/obra/ObraSelect.dart` | `Obra` object via `Navigator.pop` |

Both screens are opened via `Navigator.push` on top of any existing BLoC screen
(Pattern A / Hybrid Navigation). The caller receives the selected entity in a
`.then((value) { ... })` callback.

---

## Data Schema

### `Clientes` table (Supabase)

| Column | Type | Meaning |
|---|---|---|
| `id` | text | Primary key |
| `clienteMin` | text | **Short code / key** — used for FK references and search |
| `clienteMax` | text | **Full legal name** — displayed in lists and forms |
| `notas` | text | Free-form notes; searchable |
| `defaultFisc` | text | Default fiscal regime inherited by new obras: `S`, `F0`, or `M2` |
| `correos` | text | Semicolon-separated email addresses |
| `lastFleteFecha` | date | DB-managed (trigger). Date of the most recent flete. Never sent in POST/PATCH. |

**Model file:** `lib/utils/cliente.dart`

`lastFleteFecha` is populated in `fromJson` but **excluded from `toJson`** — it is
written only by a Supabase DB trigger when a flete is created/updated.

### `Obras` table (Supabase)

| Column | Type | Meaning |
|---|---|---|
| `id` | text | Primary key |
| `clienteMin` | text | **FK to `clientes.clienteMin`** — links obra to its owner cliente |
| `obraMin` | text | **Short code / key** — used in dropdowns and flete records |
| `obraMax` | text | **Full name / address** — displayed in lists and forms |
| `notas` | text | Free-form notes; searchable |
| `fisc` | text | Fiscal regime for this obra: `S`, `F0`, or `M2` |
| `link` | text | Optional URL (maps, drive, etc.) |
| `precioS` | integer | Price for equipment size S (nullable) |
| `precioM` | integer | Price for equipment size M (nullable) |
| `precioL` | integer | Price for equipment size L (nullable) |
| `precioXL` | integer | Price for equipment size XL (nullable) |
| `lastFleteFecha` | date | DB-managed (trigger). Never sent in POST/PATCH. |

**Model file:** `lib/obra/obra.dart` (or `lib/utils/obra.dart`)

### Naming convention: Min vs Max

`*Min` = short canonical code used as an identifier (e.g., `"ABC"`, `"OBR-01"`).  
`*Max` = human-readable full name (e.g., `"ABC Construcciones S.A."`, `"Obra Polanco 2024"`).

Fletes and other records store `clienteMin` + `obraMin` as foreign keys; full names
are resolved by looking up `bloc.clientesList` and `bloc.obrasList`.

### Fiscal regime values

| Code | Color indicator | Meaning |
|---|---|---|
| `S` | Blue | SAT simplified / no special regime |
| `F0` | Green | Standard formal invoice |
| `M2` | Yellow | Micro/small-business regime |

Displayed as a colored left-border bar on every `ClienteListItem` and `ObraListItem`.
When a new obra is created from `ObraItem`, it inherits `defaultFisc` from the
selected cliente if the obra has no fiscal status yet.

---

## Data Loading

### Clientes — loaded at login, served from BLoC cache

```
AppStartEvent → loadBasicData() → Future.wait([loadClientes(), ...])
                                          ↓
                    PostgresDB.pgAPIGet("Clientes", {})   // no server-side filter or order
                                          ↓
                    list.sort()   // client-side: lastFleteFecha DESC, NULLs last
                                          ↓
                    bloc.clientesList  (session-long cache)
```

`ClienteSelect` receives the pre-filled `clientesList` as a constructor parameter.
It does **not** fetch from the DB itself.

**Reload behavior:** Menu tiles pass `reload: list.isEmpty` — re-fetch only on
first open, use cache on subsequent opens.

### Obras — paginated fetch inside ObraSelect itself

Unlike clientes, `ObraSelect` fetches its own data directly (no BLoC involvement
for the list):

```
_ObraSelectState.initState() → _loadNextPage()
    PostgresDB.pgAPIGetPage(
      "Obras", {}, _offset, 500,
      orderColumn: 'lastFleteFecha',
      ascending: false,
      nullsFirst: false,
    )
```

- Page size: **500 rows**
- Scroll listener triggers the next page when within 200 px of the bottom
- If filtered results drop below 20 items and more pages exist, the next page is
  auto-loaded without user scrolling
- All loaded rows are accumulated in `_allLoadedObras`; filter is re-applied after
  every page

### API helpers (`lib/utils/postgres_db.dart`)

| Method | Purpose |
|---|---|
| `pgAPIGet(table, filter)` | Fetch **all** rows by auto-paginating through 1 000-row chunks. `limit` key in filter is applied **client-side** after full fetch — never use `limit: 1` for "most recent row". |
| `pgAPIGetPage(table, filter, offset, pageSize, {orderColumn, ascending, nullsFirst, ...})` | Single-page fetch. Supports primary + secondary sort. Safe for "most recent row" queries. |

---

## Filtering

### ClienteSelect — in-memory filter on cached list

```dart
// Applied on every keystroke
filteredClientesList = widget.clientesList
    .where((c) => c.contains(searchTerm))
    .toList();
```

`Cliente.contains(String search)` (in `lib/utils/cliente.dart`):
- Splits `search` on spaces → each word must match at least one field (**AND** logic)
- Fields searched: `clienteMin`, `clienteMax`, `notas`
- Case-insensitive (`toLowerCase()`)
- Diacritic-insensitive (`removeDiacritics()` strips accent marks)

### ObraSelect — two-stage filter

```dart
void _applyFilter() {
  // Stage 1: filter by cliente (exact match)
  var base = widget.clienteMin.isEmpty
      ? List<Obra>.from(_allLoadedObras)
      : _allLoadedObras.where((o) => o.clienteMin == widget.clienteMin).toList();

  // Stage 2: text search
  filteredObrasList = _searchTerm.isEmpty
      ? base
      : base.where((o) => o.contains(_searchTerm)).toList();
}
```

`Obra.contains(String search)` (in `lib/utils/obra.dart`):
- Same word-split, AND, case/diacritic-insensitive logic as Cliente
- Fields searched: `clienteMin`, `obraMin`, `obraMax`, `notas`

**Cliente filter is optional.** `ObraSelect` has `this.clienteMin = ''` as a default.
- When `clienteMin` is passed → only that client's obras appear
- When empty → all obras are shown

---

## Sorting

### Clientes

Sorted **client-side** after fetch, by `lastFleteFecha` descending:

```dart
// Cliente.compareTo() in lib/utils/cliente.dart
int compareTo(other) {
  final a = lastFleteFecha;
  final b = other.lastFleteFecha;
  if (a == null && b == null) return 0;
  if (a == null) return 1;   // no history → bottom
  if (b == null) return -1;
  return b.compareTo(a);     // most recent → top
}
```

### Obras

Sorted **server-side** via `pgAPIGetPage` order parameter:
```
orderColumn: 'lastFleteFecha', ascending: false, nullsFirst: false
```
Most recently active obras appear first; obras never used (NULL) appear last.

---

## How the Caller Opens and Receives Results

### Opening ClienteSelect

```dart
Navigator.of(context).push(
  MaterialPageRoute(
    builder: (_) => ClienteSelect(
      bloc: widget.bloc,
      clientesList: widget.bloc.clientesList,
    ),
  ),
).then((value) {
  if (value is Cliente) {
    // use value.clienteMin, value.clienteMax, value.defaultFisc …
  }
});
```

### Opening ObraSelect (with cliente filter)

```dart
Navigator.of(context).push(
  MaterialPageRoute(
    builder: (_) => ObraSelect(
      bloc: widget.bloc,
      clienteMin: selectedClienteMin,   // pass '' to show all obras
    ),
  ),
).then((value) {
  if (value is Obra) {
    // use value.obraMin, value.obraMax …
  }
});
```

### When obra selection must clear on cliente change

```dart
// FleteSearch pattern: clear obra when a new cliente is picked
bloc.fletesSearchCliente = value.clienteMin;
bloc.fletesSearchObra = "";   // ← always reset obra
```

---

## Known Patterns and Gotchas

1. **ObraSelect does not use BLoC for its list.** It fetches directly. Do not try to
   populate it via a BLoC event.

2. **ClienteSelect uses the BLoC cache.** Always pass `widget.bloc.clientesList`,
   never trigger a fresh load inside the picker.

3. **FleteItem opens ObraSelect WITHOUT clienteMin** (shows all obras). FleteSearch
   opens it WITH clienteMin (filters by client). This is intentional: FleteItem
   allows reassigning an obra to any client, whereas FleteSearch needs to narrow the
   search.

4. **lastFleteFecha is read-only.** It is populated by a Supabase DB trigger. Never
   include it in `toJson` or any POST/PATCH payload.

5. **defaultFisc inheritance.** When a user selects a cliente in ObraItem, the obra's
   `fisc` is auto-set to `cliente.defaultFisc` if it is currently empty.

6. **ObraSelect "+" button.** Creates a new obra via `ObraItem` (Navigator.push on
   top), then inserts it at index 0 of `_allLoadedObras` and re-applies the filter —
   without refetching from the server.

7. **Obra compareTo has a bug.** In `obrasList` (main list), `Obra.compareTo()`
   compares `obraMin` against `other.clienteMin` instead of `other.obraMin`. This
   only affects the main ObrasList screen, not ObraSelect (which uses DB ordering).
