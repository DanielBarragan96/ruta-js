import "./App.css";
import Column from "./Column";
import NavBar from "./NavBar";
import TrashZone from "./TrashZone";
import ModalCreateNewTask from "./CreateNewTask";
import LoginForm from "./LoginForm";
import React, { useState, useEffect, useRef } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import supabase, { fetchClientes, fetchObras } from "./supabaseClient";
import { createTestCards } from "./createTestCards";

const initialData = [
  {
    date: "2023-03-27",
    id: "id1",
    clienteMin: "MARCO",
    index: 1,
    type: "P",
    equipo: "Bailarinas",
  },
  {
    date: "2023-03-28",
    id: "1235",
    clienteMin: "Cliente2",
    obraMin: "Obra2",
    index: 1,
    type: "E",
    equipo: "1Dem",
    notas: "X.Confirmar",
  },
  {
    date: "2023-03-28",
    id: "1234",
    clienteMin: "Cliente1",
    obraMin: "Obra1",
    index: 0,
    type: "E",
    equipo: "1Dem",
  },
  {
    date: "2023-03-28",
    id: "12",
    clienteMin: "Guillermo",
    index: 2,
    type: "D",
  },
  {
    date: "2023-03-28",
    id: "1237",
    clienteMin: "Cliente4",
    obraMin: "Obra4",
    index: 3,
    type: "S",
    equipo: "1Dem",
  },
  {
    date: "2023-03-29",
    id: "1236",
    clienteMin: "Cliente3",
    obraMin: "Obra3",
    index: 0,
    type: "S",
    equipo: "1Dem",
  },
  {
    date: "2023-03-31",
    id: "1238",
    clienteMin: "C9",
    obraMin: "Direccion Muy Larga GDL Etc Etc",
    index: 0,
    type: "M",
    equipo: "1Dem",
  },
  {
    date: "2023-03-29",
    id: "1400",
    index: 2,
    type: "N",
    equipo: "1Dem",
  },
  {
    date: "2023-03-29",
    id: "1401",
    index: 3,
    type: "B",
  },
];

const DAYS_OF_WEEK = 7;
let currWeek = [];
const STORAGE_KEY = "ruta-js-tasks";
const CACHE_KEY = "ruta-js-cache";

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialData;
    const tasks = JSON.parse(stored);
    tasks.forEach((t) => { if ("bandera" in t) { t.notas = t.bandera; delete t.bandera; } });
    return tasks;
  } catch {
    return initialData;
  }
}

function saveTasks(flatTasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flatTasks));
}

function loadCache() {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

function getTodayDayIndex() {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

function sortTasks(array) {
  array.sort((task1, task2) => {
    const task1Date = Date.parse(task1.date);
    const task2Date = Date.parse(task2.date);
    let dateDiff = task1Date - task2Date;
    if (dateDiff === 0) {
      return task1.index - task2.index;
    }
    return dateDiff;
  });
}

function castData(tasks, anchorDate) {
  sortTasks(tasks);
  // "T00:00:00" prevents UTC midnight from shifting to previous day in negative UTC offsets
  let monday = new Date(anchorDate + "T00:00:00");
  let week = [];
  currWeek = [];
  for (let i = 0; i < DAYS_OF_WEEK; i++) {
    let currDate = formatDate(monday);
    week.push(tasks.filter((task) => task.date === currDate));
    currWeek.push(currDate);
    monday.setDate(monday.getDate() + 1);
  }
  return week;
}

function genId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function App() {

  function restartIndexes() {
    for (let day in currWeek) {
      if (data[day] === undefined) continue;
      for (let currTask = 0; currTask < data[day].length; currTask++) {
        data[day][currTask].index = currTask;
      }
    }
  }

  const todayMonday = formatDate(getMonday(new Date()));
  const [anchorDate, setAnchorDate] = useState(todayMonday);
  const [data, setData] = useState(() => castData(loadCache(), todayMonday));
  const [session, setSession] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(getTodayDayIndex);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [clientesList, setClientesList] = useState([]);
  const [obrasList, setObrasList] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showDayTabs, setShowDayTabs] = useState(() => {
    try { return localStorage.getItem("dayTabsOpen") === "1"; } catch { return false; }
  });
  const toggleDayTabs = () => setShowDayTabs(v => {
    const next = !v;
    try { localStorage.setItem("dayTabsOpen", next ? "1" : "0"); } catch {}
    return next;
  });
  const wasDragging = useRef(false);
  const lastPointerPos = useRef({ x: 0, y: 0 });
  const swipeStart = useRef(null);
  const localMutating = useRef(false);
  const anchorDateRef = useRef(anchorDate);
  const saveQueue = useRef(Promise.resolve());

  async function loadTasksAsync() {
    const { data: rows, error } = await supabase.from('Rutas').select('*').order('fecha').order('index');
    if (error) {
      try { const cached = localStorage.getItem(CACHE_KEY); return cached ? JSON.parse(cached) : []; } catch { return []; }
    }
    const tasks = rows.map(row => ({ id: row.id, date: row.fecha, index: row.index, type: row.tipo, clienteMin: row.clientemin, obraMin: row.obramin, equipo: row.equipo, notas: row.notas }));
    localStorage.setItem(CACHE_KEY, JSON.stringify(tasks));
    return tasks;
  }

  function saveTasks(flatTasks) {
    if (!session) return;
    const weekSnapshot = [...currWeek];
    if (weekSnapshot.length === 0) return; // never fire a filterless delete
    saveQueue.current = saveQueue.current.then(async () => {
      localMutating.current = true;
      const rows = flatTasks.map(t => ({ id: t.id || undefined, fecha: t.date, index: t.index, tipo: t.type, clientemin: t.clienteMin, obramin: t.obraMin, equipo: t.equipo, notas: t.notas }));
      const { error: delErr } = await supabase.from('Rutas').delete().in('fecha', weekSnapshot);
      if (delErr) { console.error('saveTasks delete error:', delErr); localMutating.current = false; return; }
      if (rows.length > 0) {
        const { error } = await supabase.from('Rutas').insert(rows);
        if (error) { console.error('saveTasks insert error:', error); }
        else { localStorage.setItem(CACHE_KEY, JSON.stringify(flatTasks)); }
      }
      localMutating.current = false;
    });
  }

  useEffect(() => { anchorDateRef.current = anchorDate; }, [anchorDate]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    loadTasksAsync().then(tasks => { setData([...castData(tasks, anchorDate)]); });
  }, [anchorDate, session]);

  useEffect(() => {
    if (!session) return;
    fetchClientes().then(setClientesList);
    fetchObras().then(setObrasList);
  }, [session]);

  useEffect(() => {
    if (!session) return;
    const channel = supabase.channel('tasks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Rutas' }, () => {
        if (localMutating.current) return;
        loadTasksAsync().then(tasks => setData([...castData(tasks, anchorDateRef.current)]));
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [session]);

  // Track pointer position during drag for manual day-tab hit detection on mobile
  useEffect(() => {
    if (!isDragging) return;
    const track = (e) => {
      const src = e.touches ? e.touches[0] : e;
      lastPointerPos.current = { x: src.clientX, y: src.clientY };
    };
    document.addEventListener("mousemove", track);
    document.addEventListener("touchmove", track, { passive: true });
    return () => {
      document.removeEventListener("mousemove", track);
      document.removeEventListener("touchmove", track);
    };
  }, [isDragging]);

  const shiftWeek = (dir) => {
    setAnchorDate(prev => {
      const d = new Date(prev + "T00:00:00");
      d.setDate(d.getDate() + dir * 7);
      return formatDate(d);
    });
    setSelectedDayIndex(0);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (showModal) return;
      if (document.querySelector('.cal-overlay')) return;
      const isMobile = window.innerWidth <= 768;
      if (e.key === 't') {
        setAnchorDate(formatDate(getMonday(new Date())));
        setSelectedDayIndex(getTodayDayIndex());
      } else if (e.key === 'n') {
        if (isMobile) {
          if (selectedDayIndex < 6) {
            setSelectedDayIndex(selectedDayIndex + 1);
          } else {
            setAnchorDate(prev => { const d = new Date(prev + "T00:00:00"); d.setDate(d.getDate() + 7); return formatDate(d); });
            setSelectedDayIndex(0);
          }
        } else {
          shiftWeek(1);
        }
      } else if (e.key === 'p') {
        if (isMobile) {
          if (selectedDayIndex > 0) {
            setSelectedDayIndex(selectedDayIndex - 1);
          } else {
            setAnchorDate(prev => { const d = new Date(prev + "T00:00:00"); d.setDate(d.getDate() - 7); return formatDate(d); });
            setSelectedDayIndex(6);
          }
        } else {
          shiftWeek(-1);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (isMobile) {
          if (selectedDayIndex < 6) setSelectedDayIndex(selectedDayIndex + 1);
          else { setAnchorDate(prev => { const d = new Date(prev + "T00:00:00"); d.setDate(d.getDate() + 7); return formatDate(d); }); setSelectedDayIndex(0); }
        } else {
          shiftWeek(1);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (isMobile) {
          if (selectedDayIndex > 0) setSelectedDayIndex(selectedDayIndex - 1);
          else { setAnchorDate(prev => { const d = new Date(prev + "T00:00:00"); d.setDate(d.getDate() - 7); return formatDate(d); }); setSelectedDayIndex(6); }
        } else {
          shiftWeek(-1);
        }
      } else if (e.key === 'Enter') {
        setEditingTask({
          date: formatDate(new Date()),
          id: genId(),
          clienteMin: "",
          obraMin: "",
          index: 0,
          type: "E",
          equipo: "",
          notas: "",
          _isNew: true,
        });
        setShowModal(true);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [showModal, selectedDayIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  let onDragStart = () => {
    wasDragging.current = true;
    setIsDragging(true);
    lastPointerPos.current = { x: -1, y: -1 };
  };

  // Generic pointer hit-test helper for any selector
  function getElementUnderPointer(selector) {
    const { x, y } = lastPointerPos.current;
    const elements = document.querySelectorAll(selector);
    for (const el of elements) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        return el;
      }
    }
    return null;
  }

  // Check if the last pointer position is over any day tab element
  function getDayTabUnderPointer() {
    const el = getElementUnderPointer("[data-day-tab]");
    return el ? parseInt(el.getAttribute("data-day-tab"), 10) : -1;
  }

  function getNavWeekButtonUnderPointer() {
    const el = getElementUnderPointer("[data-nav-week]");
    return el ? el.getAttribute("data-nav-week") : null;
  }

  function isPointerOverTrash() {
    return !!getElementUnderPointer("[data-trash-zone]");
  }

  let onDragEnd = (result) => {
    setIsDragging(false);
    setTimeout(() => { wasDragging.current = false; }, 0);
    const { destination, source } = result;

    const navDir = getNavWeekButtonUnderPointer();
    if (navDir !== null) {
      const srcDayIndex = parseInt(source.droppableId, 10);
      const task = data[srcDayIndex][source.index];
      const shift = navDir === "next" ? 7 : -1;
      // task.date uses JS field name (maps to Supabase 'fecha' column in saveTasks)
      const base = new Date(currWeek[0] + "T00:00:00");
      base.setDate(base.getDate() + shift);
      task.date = formatDate(base);
      // splice first — restartIndexes only iterates data (now without task), so 999 sentinel is safe
      task.index = 999;
      data[srcDayIndex].splice(source.index, 1);
      restartIndexes();
      saveTasks([...data.flat(), task]); // cross-week task survives the currWeek delete
      setData([...data]);
      // Navigate after save completes. Keep saveQueue.current updated so any subsequent
      // save (e.g. delete) chains AFTER navigate — prevents delete running with stale currWeek.
      saveQueue.current = saveQueue.current.then(() => {
        shiftWeek(navDir === "next" ? 1 : -1);
        setSelectedDayIndex(navDir === "next" ? 0 : 6); // Monday for next, Sunday for prev
      });
      return;
    }

    // Pointer-based day tab detection — works on mobile where rbd Droppable
    // hit detection is unreliable (hidden columns corrupt the Droppable registry)
    const tabDayIndex = getDayTabUnderPointer();
    if (tabDayIndex !== -1) {
      const srcDayIndex = parseInt(source.droppableId, 10);
      if (tabDayIndex !== srcDayIndex) {
        // Cross-column: move card to the target day
        const task = data[srcDayIndex][source.index];
        task.date = currWeek[tabDayIndex];
        data[srcDayIndex].splice(source.index, 1);
        data[tabDayIndex].push(task);
        restartIndexes();
        saveTasks(data.flat());
        setData([...data]);
        setSelectedDayIndex(tabDayIndex);
        return;
      }
      // Same day: pointer landed in the strip while dragging within this column.
      // Fall through to rbd's destination — positions are accurate (no layout shift),
      // so rbd correctly computes index 0 when pointer is above the first card.
    }

    // Pointer-based trash detection — TrashZone is position:fixed so it can't
    // be a rbd Droppable (fixed ancestors make isWindowScrollAllowed=false).
    if (isPointerOverTrash()) {
      data[source.droppableId].splice(source.index, 1);
      restartIndexes();
      saveTasks(data.flat());
      setData([...data]);
      return;
    }

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let task = data[source.droppableId][source.index];
    task.date = currWeek[destination.droppableId];
    data[source.droppableId].splice(source.index, 1);
    data[destination.droppableId].splice(destination.index, 0, task);

    restartIndexes();
    saveTasks(data.flat());
    setData([...data]);
  };

  let insertTask = (task) => {
    let currDateIndex = currWeek.indexOf(task.date);
    if (currDateIndex === -1) return;
    // Remove from whichever column currently holds this id (date may have changed)
    for (let day = 0; day < data.length; day++) {
      const idx = data[day].findIndex((el) => el.id === task.id);
      if (idx !== -1) {
        data[day].splice(idx, 1);
        break;
      }
    }
    data[currDateIndex].splice(task.index, 0, task);
    restartIndexes();
    saveTasks(data.flat());
    setData([...data]);
  };

  let deleteTask = (task) => {
    for (let day = 0; day < data.length; day++) {
      const idx = data[day].findIndex((el) => el.id === task.id);
      if (idx !== -1) {
        data[day].splice(idx, 1);
        restartIndexes();
        saveTasks(data.flat());
        setData([...data]);
        break;
      }
    }
    closeModal();
  };

  let openCreate = (dayIndex) => {
    setEditingTask({
      date: currWeek[dayIndex],
      id: genId(),
      clienteMin: "",
      obraMin: "",
      index: data[dayIndex].length,
      type: "E",
      equipo: "",
      notas: "",
      _isNew: true,
    });
    setShowModal(true);
  };

  let openEdit = (task) => {
    setEditingTask({ ...task, _isNew: false });
    setShowModal(true);
  };

  let closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  let fillWeek = () => createTestCards(data, currWeek, restartIndexes, saveTasks, setData);

  if (!session) return <LoginForm />;

  // Derive the 7 displayed dates directly from anchorDate state so the UI
  // is always in sync even before the async loadTasksAsync effect re-runs.
  // (currWeek is a module-level var set by castData, so it lags one render.)
  const displayWeek = (() => {
    const monday = new Date(anchorDate + "T00:00:00");
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      return formatDate(d);
    });
  })();

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd} enableUserSelectHack={false}>
      <NavBar
        date={displayWeek[0]}
        onPrevWeek={() => shiftWeek(-1)}
        onNextWeek={() => shiftWeek(1)}
        onSelectDate={(date, dayIndex = 0) => {
          setAnchorDate(formatDate(getMonday(date)));
          setSelectedDayIndex(dayIndex);
        }}
        currWeek={displayWeek}
        selectedDayIndex={selectedDayIndex}
        onSelectDay={setSelectedDayIndex}
        isDragging={isDragging}
        showDayTabs={showDayTabs}
        onToggleDayTabs={toggleDayTabs}
        onSignOut={() => supabase.auth.signOut()}
        onFillWeek={fillWeek}
      />
      <div
        className={"app" + (showDayTabs ? " app--tabs-open" : "")}
        onTouchStart={(e) => {
          swipeStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }}
        onTouchEnd={(e) => {
          if (isDragging || !swipeStart.current) return;
          const dx = e.changedTouches[0].clientX - swipeStart.current.x;
          const dy = e.changedTouches[0].clientY - swipeStart.current.y;
          swipeStart.current = null;
          if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
          if (dx < 0) {
            if (selectedDayIndex < 6) setSelectedDayIndex(selectedDayIndex + 1);
            else { setAnchorDate(prev => { const d = new Date(prev + "T00:00:00"); d.setDate(d.getDate() + 7); return formatDate(d); }); setSelectedDayIndex(0); }
          } else {
            if (selectedDayIndex > 0) setSelectedDayIndex(selectedDayIndex - 1);
            else { setAnchorDate(prev => { const d = new Date(prev + "T00:00:00"); d.setDate(d.getDate() - 7); return formatDate(d); }); setSelectedDayIndex(6); }
          }
        }}
      >
        {data.map((tasks, i) => (
          <Column
            key={i}
            date={displayWeek[i]}
            tasks={tasks}
            index={i}
            onAddCard={() => openCreate(i)}
            onEdit={openEdit}
            isDragging={isDragging}
            wasDragging={wasDragging}
            isToday={displayWeek[i] === formatDate(new Date())}
            isWeekend={i >= 5}
            isActive={i === selectedDayIndex}
          />
        ))}
      </div>
      <TrashZone isDragging={isDragging} />
      {showModal && editingTask && (
        <ModalCreateNewTask
          showModal={showModal}
          handleCloseModal={closeModal}
          task={editingTask}
          insertTask={insertTask}
          onDelete={editingTask._isNew ? undefined : deleteTask}
          clientesList={clientesList}
          obrasList={obrasList}
        />
      )}
    </DragDropContext>
  );
}

export default App;
