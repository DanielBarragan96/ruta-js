import React from "react";
import "./Task.css";
import { Draggable } from "react-beautiful-dnd";

function getTaskType(taskType) {
  switch (taskType) {
    case "P":
      return "taskType_proveedor";
    case "E":
      return "taskType_entrada";
    case "S":
      return "taskType_salida";
    case "M":
      return "taskType_mantenimiento";
    case "D":
      return "taskType_divisor";
    default:
      return "taskType_none";
  }
}
export default function Task({ task, index }) {
  //let text = {[task.clienteMin, task.obraMin].join(<br />)};
  let taskType = getTaskType(task.type);
  let text = [];
  if (taskType === "taskType_none") {
    text = ["NONE"];
  } else {
    if (task.clienteMin) {
      text.push(<>{task.clienteMin}</>);
      text.push(<br />);
    }
    if (task.obraMin) {
      text.push(<>{task.obraMin}</>);
      text.push(<br />);
    }
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={"task " + taskType}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div>
            {text.map((item, i) => (
              <div key={i.toString() + task.id}>{item}</div>
            ))}
          </div>
        </div>
      )}
    </Draggable>
  );
}
