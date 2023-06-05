import React from "react";
import "./Task.css";
import { Draggable } from "react-beautiful-dnd";

export default function Task({ task, index }) {
  return (
    <Draggable draggableId={"" + task.date + index} index={index}>
      {(provided, snapshot) => (
        <div
          className="task"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {task.clienteMin + task.obraMin + "\n" + task.date + index}
        </div>
      )}
    </Draggable>
  );
}
