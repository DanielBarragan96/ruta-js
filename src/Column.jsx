import React from "react";
import "./Column.css";

export default function Column({ date }) {
  return (
    <div className="column_container">
      <div className="task_list">{date}</div>
    </div>
  );
}
