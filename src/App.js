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
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const wasDragging = useRef(false);

  useEffect(() => {
    setData(castData(loadTasks(), anchorDate));
  }, [anchorDate]);

  const shiftWeek = (dir) => {
    setAnchorDate(prev => {
      const d = new Date(prev + "T00:00:00");
      d.setDate(d.getDate() + dir * 7);
      return formatDate(d);
    });
  };

  let onDragStart = () => {
    wasDragging.current = true;
    setIsDragging(true);
  };

  let onDragEnd = (result) => {
    setIsDragging(false);
    setTimeout(() => { wasDragging.current = false; }, 0);
    const { destination, source } = result;

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
    let existing = data[currDateIndex].find((el) => el.id === task.id);
    if (existing !== undefined) {
      data[currDateIndex][existing.index] = task;
    } else {
      data[currDateIndex].splice(task.index, 0, task);
    }
    restartIndexes();
    saveTasks(data.flat());
    setData([...data]);
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
    });
    setShowModal(true);
  };

  let openEdit = (task) => {
    setEditingTask({ ...task });
    setShowModal(true);
  };

  let closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <NavBar
        date={currWeek[0]}
        onPrevWeek={() => shiftWeek(-1)}
        onNextWeek={() => shiftWeek(1)}
        onSelectDate={(date) => setAnchorDate(formatDate(getMonday(date)))}
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
        />
      )}
    </DragDropContext>
  );
}

export default App;
