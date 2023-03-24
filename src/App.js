import "./App.css";
import Column from "./Column";
import React from "react";
import { DragDropContext } from "react-beautiful-dnd";

const data = [
  {
    date: "2023-03-27",
    tasks: [
      { id: "1234", clienteMin: "Cliente1", obraMin: "Obra1" },
      { id: "1235", clienteMin: "Cliente2", obraMin: "Obra2" },
    ],
  },
  {
    date: "2023-03-28",
    tasks: [
      { id: "1236", clienteMin: "Cliente1", obraMin: "Obra1" },
      { id: "1237", clienteMin: "Cliente2", obraMin: "Obra2" },
    ],
  },
];

let onDragEnd = (result) => {
  // TODO: reorder our column
};

function App() {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app">
        {data.map((column, i) => (
          <Column key={column.date} date={column.date} tasks={column.tasks} />
        ))}
      </div>
    </DragDropContext>
  );
}

export default App;
