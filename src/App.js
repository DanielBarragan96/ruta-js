import "./App.css";
import Column from "./Column";
import React from "react";
import { DragDropContext } from "react-beautiful-dnd";

const data = [
  {
    date: "2023-03-27",
    id: "1234",
    clienteMin: "Cliente1",
    obraMin: "Obra1",
  },
  {
    date: "2023-03-27",
    id: "1235",
    clienteMin: "Cliente2",
    obraMin: "Obra2",
  },
  {
    date: "2023-03-28",
    id: "1236",
    clienteMin: "Cliente3",
    obraMin: "Obra3",
  },
  {
    date: "2023-03-28",
    id: "1237",
    clienteMin: "Cliente4",
    obraMin: "Obra4",
  },
];

let onDragEnd = (result) => {
  //TODO set onDragEnd
};

function App() {
  let dates = [];
  for (let index in data) {
    if (!dates.includes(data[index].date)) dates.push(data[index].date);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app">
        {dates.map((date, i) => (
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
