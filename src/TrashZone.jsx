import React from "react";
import { Droppable } from "react-beautiful-dnd";
import "./TrashZone.css";

export default function TrashZone({ isDragging }) {
  return (
    <Droppable droppableId="trash">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={
            "trash-zone" +
            (isDragging ? " trash-zone--dragging" : "") +
            (snapshot.isDraggingOver ? " trash-zone--over" : "")
          }
        >
          🗑
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
