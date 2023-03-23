import React from "react";
import "./Task.css";

export default function Task({ date, task }) {
  return <div key={date + task.index}>{task.clienteMin + task.obraMin}</div>;
}
