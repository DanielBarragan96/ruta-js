import "./App.css";
import Column from "./Column";
import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";

const initialData = [
  {
    date: "2023-03-28",
    id: "1235",
    clienteMin: "Cliente2",
    obraMin: "Obra2",
    index: 1,
  },
  {
    date: "2023-03-28",
    id: "1234",
    clienteMin: "Cliente1",
    obraMin: "Obra1",
    index: 0,
  },
  {
    date: "2023-03-28",
    id: "1237",
    clienteMin: "Cliente4",
    obraMin: "Obra4",
    index: 2,
  },
  {
    date: "2023-03-29",
    id: "1236",
    clienteMin: "Cliente3",
    obraMin: "Obra3",
    index: 0,
  },
  {
    date: "2023-03-31",
    id: "1238",
    clienteMin: "C9",
    obraMin: "O9",
    index: 0,
  },
];

const DAYS_OF_WEEK = 7;
const currWeek = [];

function App() {
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
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  function castData(initialData) {
    sortTasks(initialData);
    let nextDay = getMonday(Date.parse(initialData[0].date));
    let week = [];
    for (let index = 0; index < DAYS_OF_WEEK; index++) {
      let currDate = formatDate(nextDay);
      week.push(initialData.filter((task) => task.date === currDate));
      currWeek.push(currDate);
      let date = nextDay.getDate();
      nextDay.setDate(date + 1);
    }
    return week;
  }

  let [data, setData] = useState(castData(initialData));

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

  let onDragEnd = (result) => {
    const { destination, source } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    let task = data[source.droppableId][source.index];
    task.date = currWeek[destination.droppableId];
    data[source.droppableId].splice(source.index, 1);
    data[destination.droppableId].splice(destination.index, 0, task);

    //recalculate tasks indexes
    for (let day in currWeek) {
      if (data[day] === undefined) continue;
      for (let currTask = 0; currTask < data[day].length; currTask++) {
        data[day][currTask].index = currTask;
      }
    }

    setData([...data]);
    return;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app">
        {data.map((date, i) => (
          <Column key={i} date={currWeek[i]} tasks={date} index={i} />
        ))}
      </div>
    </DragDropContext>
  );
}

export default App;
