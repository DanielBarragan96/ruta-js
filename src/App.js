import "./App.css";
import Column from "./Column";
import NavBar from "./NavBar";
import TrashZone from "./TrashZone";
import ModalCreateNewTask from "./CreateNewTask";
import React, { useState, useEffect, useRef } from "react";
import { DragDropContext } from "react-beautiful-dnd";

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
    bandera: "X.Confirmar",
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

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialData;
  } catch {
    return initialData;
  }
}

function saveTasks(flatTasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flatTasks));
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
  const day = date.getDay(); // 0=Sun, 1=Mon … 6=Sat
  const diff = day === 0 ? -6 : 1 - day; // ISO 8601: week starts Monday
  date.setDate(date.getDate() + diff);
  return date;
}

function getTodayDayIndex() {
  const day = new Date().getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  return day === 0 ? 6 : day - 1; // ISO Mon=0, Tue=1, ..., Sun=6
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
  const [data, setData] = useState(() => castData(loadTasks(), todayMonday));
  const [selectedDayIndex, setSelectedDayIndex] = useState(getTodayDayIndex);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const wasDragging = useRef(false);
  const lastPointerPos = useRef({ x: 0, y: 0 });

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

  useEffect(() => {
    setData(castData(loadTasks(), anchorDate));
  }, [anchorDate]);

  const shiftWeek = (dir) => {
    setAnchorDate(prev => {
      const d = new Date(prev + "T00:00:00");
      d.setDate(d.getDate() + dir * 7);
      return formatDate(d);
    });
    setSelectedDayIndex(0);
  };

  let onDragStart = () => {
    wasDragging.current = true;
    setIsDragging(true);
    lastPointerPos.current = { x: -1, y: -1 }; // reset so a stationary drop doesn't match tab-0
  };

  // Check if the last pointer position is over any day tab element
  function getDayTabUnderPointer() {
    const { x, y } = lastPointerPos.current;
    const tabs = document.querySelectorAll("[data-day-tab]");
    for (const tab of tabs) {
      const r = tab.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue; // hidden on desktop
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        return parseInt(tab.getAttribute("data-day-tab"), 10);
      }
    }
    return -1;
  }

  let onDragEnd = (result) => {
    setIsDragging(false);
    setTimeout(() => { wasDragging.current = false; }, 0);
    const { destination, source } = result;

    // Pointer-based day tab detection — works on mobile where rbd Droppable
    // hit detection is unreliable (hidden columns corrupt the Droppable registry)
    const tabDayIndex = getDayTabUnderPointer();
    if (tabDayIndex !== -1) {
      const srcDayIndex = parseInt(source.droppableId, 10);
      if (tabDayIndex !== srcDayIndex) {
        const task = data[srcDayIndex][source.index];
        task.date = currWeek[tabDayIndex];
        data[srcDayIndex].splice(source.index, 1);
        data[tabDayIndex].push(task);
        restartIndexes();
        saveTasks(data.flat());
        setData([...data]);
      }
      setSelectedDayIndex(tabDayIndex);
      return;
    }

    if (!destination) return;

    // Dropped on the trash zone — delete the task
    if (destination.droppableId === "trash") {
      data[source.droppableId].splice(source.index, 1);
      restartIndexes();
      saveTasks(data.flat());
      setData([...data]);
      return;
    }

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
      id: Date.now().toString(),
      clienteMin: "",
      obraMin: "",
      index: data[dayIndex].length,
      type: "E",
      equipo: "",
      bandera: "",
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

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd} enableUserSelectHack={false}>
      <NavBar
        date={currWeek[0]}
        onPrevWeek={() => shiftWeek(-1)}
        onNextWeek={() => shiftWeek(1)}
        onSelectDate={(date) => {
          setAnchorDate(formatDate(getMonday(date)));
          setSelectedDayIndex(0);
        }}
        currWeek={currWeek}
        selectedDayIndex={selectedDayIndex}
        onSelectDay={setSelectedDayIndex}
        isDragging={isDragging}
      />
      <div className="app">
        {data.map((tasks, i) => (
          <Column
            key={i}
            date={currWeek[i]}
            tasks={tasks}
            index={i}
            onAddCard={() => openCreate(i)}
            onEdit={openEdit}
            isDragging={isDragging}
            wasDragging={wasDragging}
            isToday={currWeek[i] === formatDate(new Date())}
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
        />
      )}
    </DragDropContext>
  );
}

export default App;
