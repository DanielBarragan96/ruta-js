import React from "react";
import ReactModal from "react-modal";
import "./CreateNewTask.css";

export default function ModalCreateNewTask({
  showModal,
  setShowModal,
  handleOpenModal,
  handleCloseModal,
}) {
  ReactModal.setAppElement("#root");
  return (
    <ReactModal
      isOpen={showModal}
      contentLabel="onRequestClose"
      onRequestClose={handleCloseModal}
      overlayClassName="Overlay"
      className="Modal"
    >
      <div className="InnerModal">
        <p>Modal text!</p>
        <button onClick={handleCloseModal}>Close Modal</button>
      </div>
    </ReactModal>
  );
}
