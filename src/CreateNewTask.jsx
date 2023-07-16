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
    };
  let [taskDate, setTaskDate] = useState(task.date);
  ReactModal.setAppElement("#root");
  let maxYear = currDate.getFullYear() + 1;

  let [clienteMin, setClienteMin] = useState(task.clienteMin);
  let [obraMin, setObraMin] = useState(task.obraMin);
  let [equipo, setEquipo] = useState(task.equipo);
  let [type, setType] = useState(task.type);
  let [bandera, setBandera] = useState(task.type);
  let [id, setId] = useState(task.id);
  let [index, setIndex] = useState(task.index);

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
              task.date = e.target.value;
              setTaskDate(e.target.value);
            }}
            value={taskDate}
          />
        </div>
        <div>
          <label htmlFor="cliente">Cliente:</label>
          <input
            type="text"
            id="cliente"
            placeholder="Cliente"
            value={clienteMin}
            onChange={(e) => {
              task.clienteMin = e.target.value;
              setClienteMin(e.target.value);
            }}
          />
          <label htmlFor="obra">Obra:</label>
          <input
            type="text"
            id="obra"
            placeholder="Obra"
            value={obraMin}
            onChange={(e) => {
              task.obraMin = e.target.value;
              setObraMin(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="ES">ES:</label>
          <input
            type="text"
            id="ES"
            placeholder="ES"
            value={type}
            onChange={(e) => {
              task.type = e.target.value;
              setType(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="equipo">Equipo:</label>
          <input
            type="text"
            id="equipo"
            placeholder="Equipo"
            value={equipo}
            onChange={(e) => {
              task.equipo = e.target.value;
              setEquipo(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="bandera">Bandera:</label>
          <input
            type="text"
            id="bandera"
            placeholder="Bandera"
            value={bandera}
            onChange={(e) => {
              task.bandera = e.target.value;
              setBandera(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="index">Index:</label>
          <input
            type="number"
            id="index"
            placeholder="Index"
            value={index}
            onChange={(e) => {
              task.index = e.target.value;
              setIndex(e.target.value);
            }}
          />
          <label htmlFor="id">Id:</label>
          <input
            type="text"
            id="id"
            placeholder="Id"
            value={id}
            onChange={(e) => {
              task.id = e.target.value;
              setId(e.target.value);
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
