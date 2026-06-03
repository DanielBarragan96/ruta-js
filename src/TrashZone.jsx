import React from "react";
import { Droppable } from "react-beautiful-dnd";
import "./TrashZone.css";

export default function TrashZone({ isDragging }) {
  return (
    <div className={"trash-wrapper" + (isDragging ? " trash-wrapper--visible" : "")}>
      <Droppable droppableId="trash">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={"trash-zone" + (snapshot.isDraggingOver ? " trash-zone--over" : "")}
          >
            🗑
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
