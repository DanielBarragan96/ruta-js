import React, { useState, useEffect, useRef } from 'react';
import ReactModal from 'react-modal';
import { insertCliente } from './supabaseClient';
import './CreateClienteModal.css';

const FISC_OPTIONS = [
  { value: 'S',  label: 'S',  color: '#4a90d9' },
  { value: 'F0', label: 'F0', color: '#4caf50' },
  { value: 'M2', label: 'M2', color: '#f5c518' },
];

const INITIAL_FORM = {
  clienteMin: '',
  clienteMax: '',
  defaultFisc: 'F0',
  correos: '',
  notas: '',
};

export default function CreateClienteModal({ isOpen, onClose, onCreated }) {
  ReactModal.setAppElement('#root');

  const [form, setForm] = useState(INITIAL_FORM);
  const [shake, setShake] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const clienteMinRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL_FORM);
      setShake(false);
      setSaving(false);
      setErrorMsg('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => clienteMinRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleSave = async () => {
    if (!form.clienteMin.trim() || !form.clienteMax.trim()) {
      triggerShake();
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const payload = {
        clienteMin: form.clienteMin.trim(),
        clienteMax: form.clienteMax.trim(),
        defaultFisc: form.defaultFisc,
        ...(form.correos.trim() ? { correos: form.correos.trim() } : {}),
        ...(form.notas.trim() ? { notas: form.notas.trim() } : {}),
      };
      const data = await insertCliente(payload);
      onCreated(data);
      setForm(INITIAL_FORM);
      onClose();
    } catch (err) {
      const msg = err?.message ?? String(err);
      if (msg.toLowerCase().includes('unique')) {
        setErrorMsg('Ya existe un cliente con ese código');
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') onClose();
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="OverlayCliente"
      className="ModalCliente"
      contentLabel="Crear cliente"
    >
      <div
        className={'InnerModalCliente' + (shake ? ' InnerModalCliente--shake' : '')}
        onKeyDown={handleKeyDown}
      >
        <h2>NUEVO CLIENTE</h2>

        <div className="row">
          <label htmlFor="clienteMin">Código:</label>
          <input
            ref={clienteMinRef}
            id="clienteMin"
            type="text"
            placeholder="Código corto"
            value={form.clienteMin}
            onChange={(e) => setForm({ ...form, clienteMin: e.target.value })}
          />
        </div>

        <div className="row">
          <label htmlFor="clienteMax">Nombre:</label>
          <input
            id="clienteMax"
            type="text"
            placeholder="Nombre completo"
            value={form.clienteMax}
            onChange={(e) => setForm({ ...form, clienteMax: e.target.value })}
          />
        </div>

        <div className="row">
          <label>Fisc:</label>
          <div className="fisc-buttons">
            {FISC_OPTIONS.map(({ value, label, color }) => (
              <button
                key={value}
                type="button"
                className={'fisc-btn' + (form.defaultFisc === value ? ' fisc-btn--active' : '')}
                style={{ '--fisc-color': color }}
                onClick={() => setForm({ ...form, defaultFisc: value })}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="row">
          <label htmlFor="correos">Correos:</label>
          <input
            id="correos"
            type="text"
            placeholder="correo@ejemplo.com"
            value={form.correos}
            onChange={(e) => setForm({ ...form, correos: e.target.value })}
          />
        </div>

        <div className="row">
          <label htmlFor="notas">Notas:</label>
          <input
            id="notas"
            type="text"
            placeholder="Notas"
            value={form.notas}
            onChange={(e) => setForm({ ...form, notas: e.target.value })}
          />
        </div>

        <div className="modal-actions">
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'GUARDANDO…' : 'GUARDAR'}
          </button>
          <button className="btn-secondary" onClick={onClose}>
            CANCELAR
          </button>
        </div>

        {errorMsg && <p className="modal-error">{errorMsg}</p>}
      </div>
    </ReactModal>
  );
}
