import React from "react";
import "./Column.css";
import Task from "./Task";
import { Droppable } from "react-beautiful-dnd";

export default function Column({ date, tasks }) {
  return (
    <div className="column_container">
      <div className="task_list">
        <h2>{date}</h2>
        <Droppable droppableId={date}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {tasks.map((task) => (
                <Task key={task.id} task={task} index={task.index}></Task>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
}
