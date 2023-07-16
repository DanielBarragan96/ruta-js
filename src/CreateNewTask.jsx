import React, { useState } from "react";
import ReactModal from "react-modal";
import "./CreateNewTask.css";

export default function ModalCreateNewTask({
  showModal,
  handleCloseModal,
  task,
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
  if (task === undefined)
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
        <div>
          <label htmlFor="date">Start date:</label>

          <input
            type="date"
            id="date"
            name="trip-start"
            min="2017-01-01"
            max={maxYear + "-12-31"}
            onChange={(e) => {
              setFormTask({ ...formTask, date: e.target.value });
            }}
            value={formTask.date}
          />
        </div>
        <div>
          <label htmlFor="cliente">Cliente:</label>
          <input
            type="text"
            id="cliente"
            placeholder="Cliente"
            value={formTask.clienteMin}
            onChange={(e) => {
              setFormTask({ ...formTask, clienteMin: e.target.value });
            }}
          />
          <label htmlFor="obra">Obra:</label>
          <input
            type="text"
            id="obra"
            placeholder="Obra"
            value={formTask.obraMin}
            onChange={(e) => {
              setFormTask({ ...formTask, obraMin: e.target.value });
            }}
          />
        </div>
        <div>
          <label htmlFor="ES">ES:</label>
          <input
            type="text"
            id="ES"
            placeholder="ES"
            value={formTask.type}
            onChange={(e) => {
              setFormTask({ ...formTask, type: e.target.value });
            }}
          />
        </div>
        <div>
          <label htmlFor="equipo">Equipo:</label>
          <input
            type="text"
            id="equipo"
            placeholder="Equipo"
            value={formTask.equipo}
            onChange={(e) => {
              setFormTask({ ...formTask, equipo: e.target.value });
            }}
          />
        </div>
        <div>
          <label htmlFor="bandera">Bandera:</label>
          <input
            type="text"
            id="bandera"
            placeholder="Bandera"
            value={formTask.bandera}
            onChange={(e) => {
              setFormTask({ ...formTask, bandera: e.target.value });
            }}
          />
        </div>
        <div>
          <label htmlFor="index">Index:</label>
          <input
            type="number"
            id="index"
            placeholder="Index"
            value={formTask.index}
            onChange={(e) => {
              setFormTask({ ...formTask, index: e.target.value });
            }}
          />
          <label htmlFor="id">Id:</label>
          <input
            type="text"
            id="id"
            placeholder="Id"
            value={formTask.id}
            onChange={(e) => {
              setFormTask({ ...formTask, id: e.target.value });
            }}
          />
        </div>
        <button
          onClick={() => {
            console.log(formTask);
          }}
        >
          Results
        </button>
        <button onClick={handleCloseModal}>Cancelar</button>
      </div>
    </ReactModal>
  );
}
