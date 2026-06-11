# Graph Report - ruta-js  (2026-06-11)

## Corpus Check
- 18 files · ~19,517 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 112 nodes · 145 edges · 18 communities detected
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.89)
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
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]

## God Nodes (most connected - your core abstractions)
1. `Clientes Table (Supabase)` - 8 edges
2. `Obras Table (Supabase)` - 8 edges
3. `Weekly Task Scheduler` - 6 edges
4. `App.js` - 6 edges
5. `clientesList` - 5 edges
6. `React Logo` - 5 edges
7. `formatDate()` - 4 edges
8. `castData()` - 4 edges
9. `App()` - 4 edges
10. `obrasList` - 4 edges

## Surprising Connections (you probably didn't know these)
- `BLoC Cache` --semantically_similar_to--> `clientesList`  [INFERRED] [semantically similar]
  PROMPT_SELECT_CLIENTE_OBRA.md → PLAN_CLIENTE_OBRA_SELECT.md
- `ClienteSelect` --semantically_similar_to--> `Combobox Component`  [INFERRED] [semantically similar]
  PROMPT_SELECT_CLIENTE_OBRA.md → PLAN_CLIENTE_OBRA_SELECT.md
- `ObraSelect` --semantically_similar_to--> `Combobox Component`  [INFERRED] [semantically similar]
  PROMPT_SELECT_CLIENTE_OBRA.md → PLAN_CLIENTE_OBRA_SELECT.md
- `Create React App` --bootstraps--> `Weekly Task Scheduler`  [EXTRACTED]
  README.md → CLAUDE.md
- `index.html Root Entry Point` --entry_point_for--> `Weekly Task Scheduler`  [EXTRACTED]
  public/index.html → CLAUDE.md

## Hyperedges (group relationships)
- **Combobox Data Flow: App.js loads Supabase data and passes to CreateNewTask via Combobox** — claude_appjs, plan_supabaseclient, plan_createnextask, plan_combobox_component [INFERRED 0.95]
- **Cliente-Obra FK Pattern: clienteMin links clientes/obras tables using Min/Max naming convention** — prompt_clientes_table, prompt_obras_table, prompt_min_max_naming, claude_task_fields [EXTRACTED 1.00]
- **Shared Supabase project between Flutter app and ruta-js React app** — plan_supabase_project, plan_loginform, plan_supabaseclient [EXTRACTED 1.00]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.15
Nodes (20): Task Fields, Type C (Combinado), clientesList, Combobox Component, CreateNewTask.jsx, LoginForm.jsx, obrasList, Supabase Project (+12 more)

### Community 1 - "Community 1"
Cohesion: 0.36
Nodes (10): App(), castData(), formatDate(), genId(), getMonday(), getTodayDayIndex(), loadCache(), loadTasks() (+2 more)

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (10): App.js, castData, CSS Variables, localStorage, Mobile Cross-Day Drag, react-beautiful-dnd, Weekly Task Scheduler, Web App Manifest (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.36
Nodes (7): Atom Icon (3 elliptical orbits + nucleus), Create React App, Light Blue Color (#61DAFB), logo192.png - React Logo Icon (192px), React Framework, React Logo, ruta-js Application

### Community 4 - "Community 4"
Cohesion: 0.6
Nodes (4): checkValidServiceWorker(), register(), registerValidSW(), unregister()

### Community 5 - "Community 5"
Cohesion: 0.53
Nodes (4): fetchClientes(), fetchObras(), insertCliente(), insertObra()

### Community 6 - "Community 6"
Cohesion: 0.67
Nodes (4): EquipoLines(), formatEquipo(), getTaskType(), Task()

### Community 7 - "Community 7"
Cohesion: 0.7
Nodes (3): buildCard(), createTestCards(), pick()

### Community 8 - "Community 8"
Cohesion: 0.5
Nodes (2): run(), main()

### Community 9 - "Community 9"
Cohesion: 0.83
Nodes (2): Column(), getColumnParts()

### Community 10 - "Community 10"
Cohesion: 0.83
Nodes (2): formatDateLabel(), ModalCreateNewTask()

### Community 11 - "Community 11"
Cohesion: 0.83
Nodes (2): NavBar(), todayLocalStr()

### Community 12 - "Community 12"
Cohesion: 0.83
Nodes (2): matchesSearch(), removeDiacritics()

### Community 13 - "Community 13"
Cohesion: 0.67
Nodes (1): reportWebVitals()

### Community 14 - "Community 14"
Cohesion: 0.67
Nodes (1): CreateObraModal()

### Community 15 - "Community 15"
Cohesion: 0.67
Nodes (1): CreateClienteModal()

### Community 16 - "Community 16"
Cohesion: 0.67
Nodes (1): hitTest()

### Community 17 - "Community 17"
Cohesion: 0.67
Nodes (1): LoginForm()

## Knowledge Gaps
- **13 isolated node(s):** `Type C (Combinado)`, `castData`, `CSS Variables`, `localStorage`, `Create React App` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 8`** (4 nodes): `run()`, `main()`, `lib.rs`, `main.rs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (4 nodes): `Column.jsx`, `Column()`, `getColumnParts()`, `Column.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (4 nodes): `CreateNewTask.jsx`, `formatDateLabel()`, `CreateNewTask.jsx`, `ModalCreateNewTask()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (4 nodes): `NavBar.jsx`, `NavBar.jsx`, `NavBar()`, `todayLocalStr()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (4 nodes): `Combobox.jsx`, `Combobox.jsx`, `matchesSearch()`, `removeDiacritics()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (3 nodes): `reportWebVitals.js`, `reportWebVitals.js`, `reportWebVitals()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (3 nodes): `CreateObraModal.jsx`, `CreateObraModal()`, `CreateObraModal.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (3 nodes): `CreateClienteModal.jsx`, `CreateClienteModal()`, `CreateClienteModal.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (3 nodes): `App.test.js`, `hitTest()`, `App.test.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (3 nodes): `LoginForm.jsx`, `LoginForm.jsx`, `LoginForm()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `App.js` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `Weekly Task Scheduler` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `clientesList` (e.g. with `Clientes Table (Supabase)` and `BLoC Cache`) actually correct?**
  _`clientesList` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Type C (Combinado)`, `castData`, `CSS Variables` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._