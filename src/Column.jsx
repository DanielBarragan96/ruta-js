import React from "react";
import "./Column.css";
import Task from "./Task";

export default function Column({ date, tasks }) {
  return (
    <div className="column_container">
      <div className="task_list">
        <h2>{date}</h2>
        {tasks.map((task) => (
          <Task date={date} task={task}></Task>
        ))}
      </div>
    </div>
  );
}
