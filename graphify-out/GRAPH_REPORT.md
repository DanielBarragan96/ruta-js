# Graph Report - ruta-js  (2026-06-10)

## Corpus Check
- 13 files · ~11,052 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 85 nodes · 99 edges · 11 communities detected
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 11|Community 11]]

## God Nodes (most connected - your core abstractions)
1. `Clientes Table (Supabase)` - 8 edges
2. `Obras Table (Supabase)` - 8 edges
3. `Weekly Task Scheduler` - 6 edges
4. `App.js` - 6 edges
5. `clientesList` - 5 edges
6. `React Logo` - 5 edges
7. `obrasList` - 4 edges
8. `Supabase Project` - 4 edges
9. `formatDate()` - 3 edges
10. `castData()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `BLoC Cache` --semantically_similar_to--> `clientesList`  [INFERRED] [semantically similar]
  PROMPT_SELECT_CLIENTE_OBRA.md → PLAN_CLIENTE_OBRA_SELECT.md
- `ClienteSelect` --semantically_similar_to--> `Combobox Component`  [INFERRED] [semantically similar]
  PROMPT_SELECT_CLIENTE_OBRA.md → PLAN_CLIENTE_OBRA_SELECT.md
- `ObraSelect` --semantically_similar_to--> `Combobox Component`  [INFERRED] [semantically similar]
  PROMPT_SELECT_CLIENTE_OBRA.md → PLAN_CLIENTE_OBRA_SELECT.md
- `Task Fields` --uses--> `Min/Max Naming Convention`  [INFERRED]
  CLAUDE.md → PROMPT_SELECT_CLIENTE_OBRA.md
- `createTestCards()` --calls--> `saveTasks()`  [INFERRED]
  createTestCards.js → App.js

## Hyperedges (group relationships)
- **Combobox Data Flow: App.js loads Supabase data and passes to CreateNewTask via Combobox** — claude_appjs, plan_supabaseclient, plan_createnextask, plan_combobox_component [INFERRED 0.95]
- **Cliente-Obra FK Pattern: clienteMin links clientes/obras tables using Min/Max naming convention** — prompt_clientes_table, prompt_obras_table, prompt_min_max_naming, claude_task_fields [EXTRACTED 1.00]
- **Shared Supabase project between Flutter app and ruta-js React app** — plan_supabase_project, plan_loginform, plan_supabaseclient [EXTRACTED 1.00]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.18
Nodes (18): clientesList, Combobox Component, CreateNewTask.jsx, LoginForm.jsx, obrasList, Supabase Project, supabaseClient.js, BLoC Cache (+10 more)

### Community 1 - "Community 1"
Cohesion: 0.18
Nodes (12): App.js, castData, CSS Variables, localStorage, Mobile Cross-Day Drag, react-beautiful-dnd, Task Fields, Type C (Combinado) (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (5): App(), castData(), formatDate(), getMonday(), sortTasks()

### Community 3 - "Community 3"
Cohesion: 0.36
Nodes (7): Atom Icon (3 elliptical orbits + nucleus), Create React App, Light Blue Color (#61DAFB), logo192.png - React Logo Icon (192px), React Framework, React Logo, ruta-js Application

### Community 4 - "Community 4"
Cohesion: 0.5
Nodes (2): register(), registerValidSW()

### Community 5 - "Community 5"
Cohesion: 0.6
Nodes (4): EquipoLines(), formatEquipo(), getTaskType(), Task()

### Community 6 - "Community 6"
Cohesion: 0.5
Nodes (4): saveTasks(), buildCard(), createTestCards(), pick()

### Community 7 - "Community 7"
Cohesion: 1.0
Nodes (2): Column(), getColumnParts()

### Community 8 - "Community 8"
Cohesion: 1.0
Nodes (2): formatDateLabel(), ModalCreateNewTask()

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (2): NavBar(), todayLocalStr()

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (2): matchesSearch(), removeDiacritics()

## Knowledge Gaps
- **13 isolated node(s):** `Type C (Combinado)`, `castData`, `CSS Variables`, `localStorage`, `Create React App` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 4`** (5 nodes): `serviceWorkerRegistration.js`, `checkValidServiceWorker()`, `register()`, `registerValidSW()`, `unregister()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (3 nodes): `Column.jsx`, `Column()`, `getColumnParts()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (3 nodes): `CreateNewTask.jsx`, `formatDateLabel()`, `ModalCreateNewTask()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (3 nodes): `NavBar.jsx`, `NavBar()`, `todayLocalStr()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (3 nodes): `Combobox.jsx`, `matchesSearch()`, `removeDiacritics()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `App.js` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `clientesList` (e.g. with `Clientes Table (Supabase)` and `BLoC Cache`) actually correct?**
  _`clientesList` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Type C (Combinado)`, `castData`, `CSS Variables` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._