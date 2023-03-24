import React from "react";
import "./Task.css";

export default function Task({ date, task }) {
  return <div className="task">{task.clienteMin + task.obraMin}</div>;
}
