import React, { useState, useEffect, useRef } from "react";
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
  onDelete,
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
      id: crypto.randomUUID(),
      clienteMin: "",
      obraMin: "",
      index: 99,
      type: "E",
      equipo: "",
      notas: "",
    };

  ReactModal.setAppElement("#root");
  let maxYear = currDate.getFullYear() + 1;

  let [formTask, setFormTask] = useState(task);
  const clienteRef = useRef(null);

  useEffect(() => { clienteRef.current?.focus(); }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") {
        const { _isNew, ...taskToSave } = formTask;
        insertTask(taskToSave);
        handleCloseModal();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const tag = document.activeElement?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        const idx = TIPOS.findIndex(t => t.code === formTask.type);
        const next = e.key === "ArrowRight"
          ? (idx + 1) % TIPOS.length
          : (idx - 1 + TIPOS.length) % TIPOS.length;
        setFormTask({ ...formTask, type: TIPOS[next].code });
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [formTask, insertTask, handleCloseModal]);

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
          <label htmlFor="cliente">Cliente:</label>
          <input
            ref={clienteRef}
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
          <label htmlFor="notas">Notas:</label>
          <input
            type="text"
            id="notas"
            placeholder="Notas"
            value={formTask.notas}
            onChange={(e) => setFormTask({ ...formTask, notas: e.target.value })}
          />
        </div>
        <div className="modal-actions">
          <button
            className="btn-primary"
            onClick={() => {
              const { _isNew, ...taskToSave } = formTask;
              insertTask(taskToSave);
              handleCloseModal();
            }}
          >
            GUARDAR
          </button>
          <button className="btn-secondary" onClick={handleCloseModal}>
            CANCELAR
          </button>
          {onDelete && (
            <button className="btn-danger" onClick={() => onDelete(formTask)}>
              ELIMINAR
            </button>
          )}
        </div>
      </div>
    </ReactModal>
  );
}
