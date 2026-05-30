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
    case "B":
      return "taskType_bodega";
    default:
      return "taskType_none";
  }
}

export default function Task({ task, index, onEdit }) {
  let taskType = getTaskType(task.type);
  let innerComponent = <></>;
  if (taskType === "taskType_none") {
    innerComponent = <>{task.date}</>;
  } else if (taskType === "taskType_bodega") {
    innerComponent = <>Bodega</>;
  } else {
    innerComponent = (
      <>
        {task.clienteMin ? (
          <>
            {task.clienteMin}
            <br />
          </>
        ) : null}
        {task.obraMin ? (
          <>
            {task.obraMin}
            <br />
          </>
        ) : null}
        {task.equipo ? (
          <>
            {task.equipo}
            <br />
          </>
        ) : null}
      </>
    );
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {task.bandera ? <div className="bandera">{task.bandera}</div> : null}
          <div
            className={"task " + taskType}
            onClick={(e) => {
              e.stopPropagation();
              if (onEdit) onEdit(task);
            }}
          >
            {innerComponent}
          </div>
        </div>
      )}
    </Draggable>
  );
}
