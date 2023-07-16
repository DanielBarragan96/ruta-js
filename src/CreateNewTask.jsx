import React, { useState } from "react";
import ReactModal from "react-modal";
import "./CreateNewTask.css";

export default function ModalCreateNewTask({
  showModal,
  handleCloseModal,
  taskIn,
}) {
  let currDate = new Date();
  let month = "" + (currDate.getMonth() + 1);
  let day = "" + currDate.getDate();
  let year = currDate.getFullYear();
  let todayString = [
    year,
    month < 10 ? "0" + month : month,
    day < 10 ? "0" + day : day,
  ].join("-");
  if (taskIn === undefined)
    taskIn = {
      date: todayString,
      id: currDate.toString(),
      clienteMin: "",
      obraMin: "",
      index: 99,
      type: "E",
      equipo: "",
      bandera: "",
    };

  ReactModal.setAppElement("#root");
  let maxYear = currDate.getFullYear() + 1;

  let [task, setTask] = useState(taskIn);

  return (
    <ReactModal
      isOpen={showModal}
      contentLabel="onRequestClose"
      onRequestClose={handleCloseModal}
      overlayClassName="Overlay"
      className="Modal"
    >
      <div className="InnerModal">
        <div>
          <label htmlFor="date">Start date:</label>

          <input
            type="date"
            id="date"
            name="trip-start"
            min="2017-01-01"
            max={maxYear + "-12-31"}
            onChange={(e) => {
              setTask({ ...task, date: e.target.value });
            }}
            value={task.date}
          />
        </div>
        <div>
          <label htmlFor="cliente">Cliente:</label>
          <input
            type="text"
            id="cliente"
            placeholder="Cliente"
            value={task.clienteMin}
            onChange={(e) => {
              setTask({ ...task, clienteMin: e.target.value });
            }}
          />
          <label htmlFor="obra">Obra:</label>
          <input
            type="text"
            id="obra"
            placeholder="Obra"
            value={task.obraMin}
            onChange={(e) => {
              setTask({ ...task, obraMin: e.target.value });
            }}
          />
        </div>
        <div>
          <label htmlFor="ES">ES:</label>
          <input
            type="text"
            id="ES"
            placeholder="ES"
            value={task.type}
            onChange={(e) => {
              setTask({ ...task, type: e.target.value });
            }}
          />
        </div>
        <div>
          <label htmlFor="equipo">Equipo:</label>
          <input
            type="text"
            id="equipo"
            placeholder="Equipo"
            value={task.equipo}
            onChange={(e) => {
              setTask({ ...task, equipo: e.target.value });
            }}
          />
        </div>
        <div>
          <label htmlFor="bandera">Bandera:</label>
          <input
            type="text"
            id="bandera"
            placeholder="Bandera"
            value={task.bandera}
            onChange={(e) => {
              setTask({ ...task, bandera: e.target.value });
            }}
          />
        </div>
        <div>
          <label htmlFor="index">Index:</label>
          <input
            type="number"
            id="index"
            placeholder="Index"
            value={task.index}
            onChange={(e) => {
              setTask({ ...task, index: e.target.value });
            }}
          />
          <label htmlFor="id">Id:</label>
          <input
            type="text"
            id="id"
            placeholder="Id"
            value={task.id}
            onChange={(e) => {
              setTask({ ...task, id: e.target.value });
            }}
          />
        </div>
        <button
          onClick={() => {
            console.log(task);
          }}
        >
          Results
        </button>
        <button onClick={handleCloseModal}>Cancelar</button>
      </div>
    </ReactModal>
  );
}
