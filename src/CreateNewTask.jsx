import React, { useState, useEffect, useRef } from "react";
import ReactModal from "react-modal";
import Combobox from "./Combobox";
import CreateObraModal from './CreateObraModal';
import "./CreateNewTask.css";

const PICKER_TYPES = new Set(['E', 'S', 'M']);

const MONTHS_ES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
function formatDateLabel(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}${MONTHS_ES[parseInt(month, 10) - 1]}${year.slice(2)}`;
}

const TIPOS = [
  { code: "E", label: "Entrada",   color: "#a6d46f" },
  { code: "S", label: "Salida",    color: "#f58e6c" },
  { code: "B", label: "Bodega",    color: "#00a550" },
  { code: "D", label: "Divisor",   color: "#ff1500" },
  { code: "P", label: "Proveedor", color: "#48abcf" },
  { code: "M", label: "Mmto",      color: "#b88a16" },
];

// Fields shown per type. clienteLabel: shown + label text. obra/equipo/notas: boolean.
const FIELDS = {
  E: { clienteLabel: "Cliente",    obra: true, equipo: true, equipoSalida: true, notas: true },
  S: { clienteLabel: "Cliente",    obra: true, equipo: true, notas: true },
  M: { clienteLabel: "Cliente",    obra: true, equipo: true, notas: true },
  P: { clienteLabel: "Proveedor",  equipo: true },
  D: { clienteLabel: "Separador" },
  B: {},
};

export default function ModalCreateNewTask({
  showModal,
  handleCloseModal,
  task,
  insertTask,
  onDelete,
  obrasList = [],
  clientesList = [],
  onObraCreated,
  onClienteCreated,
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

  const isCombo = task.type === 'C';
  const sepIdx = isCombo && task.equipo ? task.equipo.indexOf(' --- ') : -1;
  const initEquipoE = sepIdx >= 0 ? task.equipo.slice(0, sepIdx) : (task.equipo || '');
  const initEquipoS = sepIdx >= 0 ? task.equipo.slice(sepIdx + 5) : '';

  const [formTask, setFormTask] = useState({
    ...task,
    type: isCombo ? 'E' : task.type,
    equipo: initEquipoE,
    equipoSalida: initEquipoS,
  });
  const [shake, setShake] = useState(false);
  const [showObraModal, setShowObraModal] = useState(false);
  // Fixed-index refs: [cliente, obra, equipo, notas]. Null when field is hidden.
  const inputRefs = useRef([null, null, null, null]);
  const dateInputRef = useRef(null);

  useEffect(() => { inputRefs.current.find(Boolean)?.focus(); }, []);

  const saveTask = () => {
    if (formTask.type !== "B") {
      const hasValue = [formTask.clienteMin, formTask.obraMin, formTask.equipo, formTask.notas]
        .some(v => v && v.trim() !== "");
      if (!hasValue) {
        setShake(true);
        setTimeout(() => setShake(false), 400);
        inputRefs.current.find(Boolean)?.focus();
        return;
      }
    }
    const { _isNew, equipoSalida, ...base } = formTask;
    const salida = equipoSalida?.trim();
    const type = salida ? 'C' : base.type;
    const equipo = salida ? `${base.equipo} --- ${salida}` : base.equipo;
    insertTask({ ...base, type, equipo });
    handleCloseModal();
  };

  const fields = FIELDS[formTask.type] ?? FIELDS.E;
  const usePicker = PICKER_TYPES.has(formTask.type);

  const selectedObra = usePicker
    ? obrasList.find(o => o.clienteMin === formTask.clienteMin && o.obraMin === formTask.obraMin)
    : null;

  const openLocation = () => {
    if (!selectedObra) return;
    const url = selectedObra.link
      ? selectedObra.link
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedObra.obraMax)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const changeType = (code) => {
    const updates = { type: code };
    if (code === "B") updates.clienteMin = "Bodega";
    else if (formTask.type === "B") updates.clienteMin = "";
    setFormTask(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") {
        saveTask();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const tag = document.activeElement?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        const idx = TIPOS.findIndex(t => t.code === formTask.type);
        const next = e.key === "ArrowRight"
          ? (idx + 1) % TIPOS.length
          : (idx - 1 + TIPOS.length) % TIPOS.length;
        const newCode = TIPOS[next].code;
        const updates = { type: newCode };
        if (newCode === "B") updates.clienteMin = "Bodega";
        else if (formTask.type === "B") updates.clienteMin = "";
        setFormTask(prev => ({ ...prev, ...updates }));
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
      <div className={"InnerModal" + (shake ? " InnerModal--shake" : "")}>
        <h2>TAREA</h2>
        <div className="row">
          <label htmlFor="date">Fecha:</label>
          <div className="date-display-wrap" onClick={() => dateInputRef.current?.showPicker?.()}>
            <span className="date-label-formatted">{formatDateLabel(formTask.date)}</span>
            <input
              ref={dateInputRef}
              type="date"
              id="date"
              tabIndex={-1}
              min="2017-01-01"
              max={maxYear + "-12-31"}
              onChange={(e) => setFormTask({ ...formTask, date: e.target.value })}
              value={formTask.date}
              className="date-input-overlay"
            />
          </div>
        </div>

        <div className="row">
          <label>Tipo:</label>
          <div className="tipo-buttons">
            {TIPOS.map(({ code, label, color }) => (
              <button
                key={code}
                type="button"
                tabIndex={formTask.type === code ? 0 : -1}
                className={"tipo-btn" + (formTask.type === code ? " tipo-btn--active" : "")}
                style={{ "--tipo-color": color }}
                onClick={() => changeType(code)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {fields.clienteLabel && (
          <div className="row">
            <label>{fields.clienteLabel}{usePicker && fields.obra ? '/Obra' : ''}:</label>
            {usePicker ? (
              <>
                <Combobox
                  ref={(el) => { inputRefs.current[0] = el; }}
                  value={[formTask.clienteMin, formTask.obraMin].filter(Boolean).join(' · ')}
                  onChange={(val) => {
                    if (!val) setFormTask(prev => ({ ...prev, clienteMin: '', obraMin: '' }));
                  }}
                  onSelect={(opt) => setFormTask(prev => ({
                    ...prev,
                    clienteMin: opt.clienteMin,
                    obraMin: opt.obraMin,
                  }))}
                  options={obrasList}
                  getLabel={(o) => o.obraMin}
                  getSubLabel={(o) => `${o.clienteMin} · ${o.obraMax}`}
                  placeholder="Cliente / Obra"
                />
                {selectedObra && (
                  <button
                    type="button"
                    className="btn-location"
                    onClick={openLocation}
                    title={selectedObra.link ? 'Abrir enlace' : 'Ver en Google Maps'}
                  >
                    {selectedObra.link ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    )}
                  </button>
                )}
                <button
                  type="button"
                  className="btn-nueva-obra"
                  onClick={() => setShowObraModal(true)}
                >
                  + Obra
                </button>
              </>
            ) : (
              <input
                ref={(el) => { inputRefs.current[0] = el; }}
                type="text"
                id="cliente"
                placeholder={fields.clienteLabel}
                value={formTask.clienteMin}
                onChange={(e) => setFormTask({ ...formTask, clienteMin: e.target.value })}
              />
            )}
          </div>
        )}
        {fields.equipo && (
          <div className="row">
            <label htmlFor="equipo">Eq. Entrada:</label>
            <input
              ref={(el) => { inputRefs.current[2] = el; }}
              type="text"
              id="equipo"
              placeholder="Equipo entrada"
              value={formTask.equipo}
              onChange={(e) => setFormTask({ ...formTask, equipo: e.target.value })}
            />
          </div>
        )}
        {fields.equipoSalida && (
          <div className="row">
            <label htmlFor="equipoSalida">Eq. Salida:</label>
            <input
              type="text"
              id="equipoSalida"
              placeholder="Equipo salida (opcional)"
              value={formTask.equipoSalida || ''}
              onChange={(e) => setFormTask({ ...formTask, equipoSalida: e.target.value })}
            />
          </div>
        )}
        {fields.notas && (
          <div className="row">
            <label htmlFor="notas">Notas:</label>
            <input
              ref={(el) => { inputRefs.current[3] = el; }}
              type="text"
              id="notas"
              placeholder="Notas"
              value={formTask.notas}
              onChange={(e) => setFormTask({ ...formTask, notas: e.target.value })}
            />
          </div>
        )}

        <div className="modal-actions">
          <button
            className="btn-primary"
            onClick={saveTask}
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
        <CreateObraModal
          isOpen={showObraModal}
          onClose={() => setShowObraModal(false)}
          onCreated={(newObra) => {
            setShowObraModal(false);
            setFormTask(prev => ({ ...prev, clienteMin: newObra.clienteMin, obraMin: newObra.obraMin }));
            onObraCreated?.(newObra);
          }}
          clientesList={clientesList}
          onClienteCreated={(newCliente) => onClienteCreated?.(newCliente)}
        />
      </div>
    </ReactModal>
  );
}
