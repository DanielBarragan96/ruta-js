import React from "react";
import "./Column.css";
import Task from "./Task";
import { Droppable } from "react-beautiful-dnd";

function getColumnTitle(date) {
  let newDate = new Date(date);
  let title = "";
  title += newDate.getDate().toString();
  title += Intl.DateTimeFormat("es", { month: "short" })
    .format(newDate)
    .toUpperCase();
  title += newDate
    .getFullYear()
    .toString()
    .substring(2);
  return title;
}

export default function Column({ date, tasks, index }) {
  return (
    <div className="column_container">
      <div className="task_list">
        <div className="title">{getColumnTitle(date)}</div>
        <Droppable droppableId={index.toString()}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="extra"
            >
              {tasks.map((task, i) => (
                <Task key={task.id} task={task} index={i}></Task>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}
