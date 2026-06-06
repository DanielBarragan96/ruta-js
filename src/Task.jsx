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

function EquipoLines({ equipo }) {
  return (
    <span className="equipo">
      {formatEquipo(equipo).map((pair, i, arr) => (
        <React.Fragment key={i}>
          {pair}
          {i < arr.length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  );
}

export default function Task({ task, index, onEdit, wasDragging }) {
  const handleClick = (e) => {
    e.stopPropagation();
    if (!wasDragging?.current && onEdit) onEdit(task);
  };

  if (task.type === 'C') {
    const sep = task.equipo ? task.equipo.indexOf(' --- ') : -1;
    const equipoE = sep >= 0 ? task.equipo.slice(0, sep) : (task.equipo || '');
    const equipoS = sep >= 0 ? task.equipo.slice(sep + 5) : '';
    return (
      <Draggable draggableId={task.id} index={index}>
        {(provided) => (
          <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
            {task.notas ? <div className="notas">{task.notas}</div> : null}
            <div className="task task-combo" onClick={handleClick}>
              <div className="combo-entrada">
                {task.clienteMin ? <>{task.clienteMin}<br /></> : null}
                {task.obraMin ? <>{task.obraMin}<br /></> : null}
                {equipoE ? <EquipoLines equipo={equipoE} /> : null}
              </div>
              <div className="combo-salida">
                {equipoS ? <EquipoLines equipo={equipoS} /> : null}
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  }

  let taskType = getTaskType(task.type);
  let innerComponent = <></>;
  if (taskType === "taskType_none") {
    innerComponent = <>{task.date}</>;
  } else if (taskType === "taskType_bodega") {
    innerComponent = <>Bodega</>;
  } else {
    innerComponent = (
      <>
        {task.clienteMin ? <>{task.clienteMin}<br /></> : null}
        {task.obraMin ? <>{task.obraMin}<br /></> : null}
        {task.equipo ? <><EquipoLines equipo={task.equipo} /><br /></> : null}
      </>
    );
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          {task.notas ? <div className="notas">{task.notas}</div> : null}
          <div className={"task " + taskType} onClick={handleClick}>
            {innerComponent}
          </div>
        </div>
      )}
    </Draggable>
  );
}
