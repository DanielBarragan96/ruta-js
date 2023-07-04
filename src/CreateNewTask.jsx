import React from "react";
import ReactModal from "react-modal";

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
    >
      <p>Modal text!</p>
      <button onClick={handleCloseModal}>Close Modal</button>
    </ReactModal>
  );
}
