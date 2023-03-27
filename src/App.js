import "./App.css";
import Column from "./Column";
import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";

const initialData = [
  {
    date: "2023-03-27",
    id: "1235",
    clienteMin: "Cliente2",
    obraMin: "Obra2",
    index: 1,
  },
  {
    date: "2023-03-27",
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
    index: 1,
  },
  {
    date: "2023-03-28",
    id: "1236",
    clienteMin: "Cliente3",
    obraMin: "Obra3",
    index: 0,
  },
];

function App() {
  let [data, setData] = useState(initialData);

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
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    let modifiedTaskIndex = data.findIndex((task) => task.id === draggableId);

    data[modifiedTaskIndex].date = destination.droppableId;
    data[modifiedTaskIndex].index = destination.index;

    sortTasks(data);
    setData([...data]);
    console.log(modifiedTaskIndex);
    console.log(data);
  };

  let dates = [];
  for (let index in data) {
    if (!dates.includes(data[index].date)) dates.push(data[index].date);
  }
  sortTasks(data);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app">
        {dates.map((date) => (
          <Column
            key={date}
            date={date}
            tasks={data.filter((task) => task.date === date)}
          />
        ))}
      </div>
    </DragDropContext>
  );
}

export default App;
