import React from "react";
import "./Task.css";
import { Draggable } from "react-beautiful-dnd";

function formatEquipo(equipo) {
  const parts = equipo.split(/[/,\s]+/).filter(Boolean);
  const pairs = [];
  for (let i = 0; i < parts.length; i += 2) {
    pairs.push(parts.slice(i, i + 2).join("/"));
  }
  return pairs;
}

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

export default function Task({ task, index, onEdit, wasDragging }) {
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
            <span className="equipo">
              {formatEquipo(task.equipo).map((pair, i, arr) => (
                <React.Fragment key={i}>
                  {pair}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
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
          {task.notas ? <div className="notas">{task.notas}</div> : null}
          <div
            className={"task " + taskType}
            onClick={(e) => {
              e.stopPropagation();
              if (!wasDragging?.current && onEdit) onEdit(task);
            }}
          >
            {innerComponent}
          </div>
        </div>
      )}
    </Draggable>
  );
}
