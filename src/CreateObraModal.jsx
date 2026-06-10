import React, { useState, useEffect, useRef } from 'react';
import ReactModal from 'react-modal';
import Combobox from './Combobox';
import CreateClienteModal from './CreateClienteModal';
import { insertObra } from './supabaseClient';
import './CreateObraModal.css';

const FISC_OPTIONS = [
  { value: 'S',  label: 'S',  color: '#4a90d9' },
  { value: 'F0', label: 'F0', color: '#4caf50' },
  { value: 'M2', label: 'M2', color: '#f5c518' },
];

const INITIAL_FORM = {
  clienteMin: '',
  obraMin: '',
  obraMax: '',
  fisc: '',
  link: '',
  notas: '',
  precioS: 225,
  precioM: 355,
  precioL: 900,
  precioXL: 1200,
};

export default function CreateObraModal({ isOpen, onClose, onCreated, clientesList, onClienteCreated }) {
  ReactModal.setAppElement('#root');

  const [formObra, setFormObra] = useState(INITIAL_FORM);
  const [shake, setShake] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showClienteModal, setShowClienteModal] = useState(false);
  const comboboxRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFormObra(INITIAL_FORM);
      setShake(false);
      setSaving(false);
      setErrorMsg('');
    }
  }, [isOpen]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleSave = async () => {
    if (
      !formObra.clienteMin.trim() ||
      !formObra.obraMin.trim() ||
      !formObra.obraMax.trim() ||
      !formObra.fisc
    ) {
      triggerShake();
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const payload = {
        clienteMin: formObra.clienteMin.trim(),
        obraMin: formObra.obraMin.trim(),
        obraMax: formObra.obraMax.trim(),
        fisc: formObra.fisc,
        ...(formObra.link.trim() ? { link: formObra.link.trim() } : {}),
        ...(formObra.notas.trim() ? { notas: formObra.notas.trim() } : {}),
        precioS: formObra.precioS,
        precioM: formObra.precioM,
        precioL: formObra.precioL,
        precioXL: formObra.precioXL,
      };
      const data = await insertObra(payload);
      onCreated(data);
      setFormObra(INITIAL_FORM);
      onClose();
    } catch (err) {
      const msg = err?.message ?? String(err);
      const lower = msg.toLowerCase();
      if (lower.includes('unique') && lower.includes('cliente_obra')) {
        setErrorMsg('Ya existe esa obra para este cliente');
      } else {
        setErrorMsg('Error al guardar la obra');
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
    <>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        overlayClassName="OverlayObra"
        className="ModalObra"
        contentLabel="Crear obra"
      >
        <div
          className={'InnerModalObra' + (shake ? ' InnerModalObra--shake' : '')}
          onKeyDown={handleKeyDown}
        >
          <h2>NUEVA OBRA</h2>

          <div className="row">
            <label>Cliente:</label>
            <Combobox
              ref={comboboxRef}
              value={formObra.clienteMin}
              onChange={(val) => setFormObra(prev => ({ ...prev, clienteMin: val }))}
              onSelect={(opt) => setFormObra(prev => ({
                ...prev,
                clienteMin: opt.clienteMin,
                fisc: opt.defaultFisc || '',
              }))}
              options={clientesList}
              getLabel={(o) => o.clienteMin}
              getSubLabel={(o) => o.clienteMax}
              placeholder="Buscar cliente"
            />
            <button
              type="button"
              className="nueva-cliente-btn"
              onClick={() => setShowClienteModal(true)}
            >
              Nuevo Cliente
            </button>
          </div>

          <div className="row">
            <label htmlFor="obraMin">Nombre:</label>
            <input
              id="obraMin"
              type="text"
              placeholder="Nombre corto"
              value={formObra.obraMin}
              onChange={(e) => setFormObra(prev => ({ ...prev, obraMin: e.target.value }))}
            />
          </div>

          <div className="row">
            <label htmlFor="obraMax">Dirección:</label>
            <input
              id="obraMax"
              type="text"
              placeholder="Dirección completa"
              value={formObra.obraMax}
              onChange={(e) => setFormObra(prev => ({ ...prev, obraMax: e.target.value }))}
            />
          </div>

          <div className="row">
            <label>Fisc:</label>
            <div className="fisc-buttons">
              {FISC_OPTIONS.map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  className={'fisc-btn' + (formObra.fisc === value ? ' fisc-btn--active' : '')}
                  style={{ '--fisc-color': color }}
                  onClick={() => setFormObra(prev => ({ ...prev, fisc: value }))}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="row">
            <label htmlFor="link">Link:</label>
            <input
              id="link"
              type="text"
              placeholder="https://..."
              value={formObra.link}
              onChange={(e) => setFormObra(prev => ({ ...prev, link: e.target.value }))}
            />
          </div>

          <div className="row">
            <label htmlFor="notas">Notas:</label>
            <input
              id="notas"
              type="text"
              placeholder="Notas"
              value={formObra.notas}
              onChange={(e) => setFormObra(prev => ({ ...prev, notas: e.target.value }))}
            />
          </div>

          <div className="precios-grid">
            {[
              { key: 'precioS',  label: 'S' },
              { key: 'precioM',  label: 'M' },
              { key: 'precioL',  label: 'L' },
              { key: 'precioXL', label: 'XL' },
            ].map(({ key, label }) => (
              <div key={key} className="precio-item">
                <span className="precio-label">{label}</span>
                <input
                  type="number"
                  min="0"
                  className="precio-input"
                  value={formObra[key]}
                  onChange={(e) => setFormObra(prev => ({ ...prev, [key]: e.target.value }))}
                />
              </div>
            ))}
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

      <CreateClienteModal
        isOpen={showClienteModal}
        onClose={() => setShowClienteModal(false)}
        onCreated={(newCliente) => {
          setShowClienteModal(false);
          onClienteCreated(newCliente);
          setFormObra(prev => ({
            ...prev,
            clienteMin: newCliente.clienteMin,
            fisc: newCliente.defaultFisc || '',
          }));
        }}
      />
    </>
  );
}
