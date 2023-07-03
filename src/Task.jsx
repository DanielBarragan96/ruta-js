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
  let text = <></>;
  if (taskType === "taskType_none") {
    text = <>NONE</>;
  } else {
    text = (
      <>
        {task.clienteMin ? (
          <>
            {task.clienteMin}
            <br></br>
          </>
        ) : (
          <></>
        )}{" "}
        {task.obraMin ? (
          <>
            {task.obraMin}
            <br></br>
          </>
        ) : (
          <></>
        )}
        {task.equipo ? (
          <>
            {task.equipo}
            <br></br>
          </>
        ) : (
          <></>
        )}
      </>
    );
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {task.bandera ? <div className="bandera">{task.bandera}</div> : <></>}

          <div className={"task " + taskType}>{text}</div>
        </div>
      )}
    </Draggable>
  );
}
