import React, { useState } from "react";
import ReactModal from "react-modal";
import "./CreateNewTask.css";

const TIPOS = [
  { code: "E", label: "Entrada",   color: "#a6d46f" },
  { code: "S", label: "Salida",    color: "#f58e6c" },
  { code: "P", label: "Proveedor", color: "#48abcf" },
  { code: "M", label: "Mantenim.", color: "#b88a16" },
  { code: "D", label: "Divisor",   color: "#ff1500" },
  { code: "B", label: "Bodega",    color: "#00a550" },
];

export default function ModalCreateNewTask({
  showModal,
  handleCloseModal,
  task,
  insertTask,
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

  if (task == null)
    task = {
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

  let [formTask, setFormTask] = useState(task);

  return (
    <ReactModal
      isOpen={showModal}
      contentLabel="onRequestClose"
      onRequestClose={handleCloseModal}
      overlayClassName="Overlay"
      className="Modal"
    >
      <div className="InnerModal">
        <h2>TAREA</h2>
        <div className="row">
          <label htmlFor="date">Fecha:</label>
          <input
            type="date"
            id="date"
            min="2017-01-01"
            max={maxYear + "-12-31"}
            onChange={(e) => setFormTask({ ...formTask, date: e.target.value })}
            value={formTask.date}
          />
        </div>
        <div className="row">
          <label htmlFor="cliente">Cliente:</label>
          <input
            type="text"
            id="cliente"
            placeholder="Cliente"
            value={formTask.clienteMin}
            onChange={(e) => setFormTask({ ...formTask, clienteMin: e.target.value })}
          />
        </div>
        <div className="row">
          <label htmlFor="obra">Obra:</label>
          <input
            type="text"
            id="obra"
            placeholder="Obra / Dirección"
            value={formTask.obraMin}
            onChange={(e) => setFormTask({ ...formTask, obraMin: e.target.value })}
          />
        </div>

        <div className="tipo-section">
          <label>Tipo:</label>
          <div className="tipo-buttons">
            {TIPOS.map(({ code, label, color }) => (
              <button
                key={code}
                type="button"
                className={"tipo-btn" + (formTask.type === code ? " tipo-btn--active" : "")}
                style={{ "--tipo-color": color }}
                onClick={() => setFormTask({ ...formTask, type: code })}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="row">
          <label htmlFor="equipo">Equipo:</label>
          <input
            type="text"
            id="equipo"
            placeholder="Equipo"
            value={formTask.equipo}
            onChange={(e) => setFormTask({ ...formTask, equipo: e.target.value })}
          />
        </div>
        <div className="row">
          <label htmlFor="bandera">Bandera:</label>
          <input
            type="text"
            id="bandera"
            placeholder="Bandera"
            value={formTask.bandera}
            onChange={(e) => setFormTask({ ...formTask, bandera: e.target.value })}
          />
        </div>
        <div className="row">
          <label htmlFor="index">Orden:</label>
          <input
            type="number"
            id="index"
            placeholder="Orden"
            value={formTask.index}
            onChange={(e) => setFormTask({ ...formTask, index: parseInt(e.target.value, 10) })}
          />
          <label htmlFor="id">Id:</label>
          <input
            type="text"
            id="id"
            placeholder="Id"
            value={formTask.id}
            onChange={(e) => setFormTask({ ...formTask, id: e.target.value })}
          />
        </div>
        <div className="modal-actions">
          <button
            className="btn-primary"
            onClick={() => {
              insertTask(formTask);
              handleCloseModal();
            }}
          >
            GUARDAR
          </button>
          <button className="btn-secondary" onClick={handleCloseModal}>
            CANCELAR
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
