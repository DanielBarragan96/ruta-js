import React from "react";
import "./Column.css";
import Task from "./Task";
import { Droppable } from "react-beautiful-dnd";

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function getColumnParts(date) {
  // +1 corrects the UTC-midnight timezone shift for display
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  const dayInitial = DAY_NAMES[d.getDay()];
  const dateLabel =
    d.getDate().toString() +
    Intl.DateTimeFormat("es", { month: "short" }).format(d).toUpperCase() +
    d.getFullYear().toString().substring(2);
  return { dayInitial, dateLabel };
}

export default function Column({ date, tasks, index, onAddCard, onEdit, isDragging }) {
  const { dayInitial, dateLabel } = getColumnParts(date);
  return (
    <div className="column_container">
      <div className="task_list">
        <div className="title">
          <span className="title-day">{dayInitial}</span>
          <span className="title-date">{dateLabel}</span>
        </div>
        <Droppable droppableId={index.toString()}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={"draggable" + (isDragging ? " draggable--drag-active" : "")}
              onClick={(e) => {
                if (e.target === e.currentTarget && onAddCard) {
                  onAddCard();
                }
              }}
            >
              {tasks.map((task, i) => (
                <Task key={task.id} task={task} index={i} onEdit={onEdit} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}
