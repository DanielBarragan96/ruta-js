import { useState } from "react";
import React from "react";
import "./NavBar.css";
import ModalCreateNewTask from "./CreateNewTask";

export default function NavBar({ date }) {
  let newDate = new Date(date);
  newDate.setMonth(newDate.getMonth());
  const month = newDate
    .toLocaleString("ES-MX", { month: "short" })
    .toUpperCase();
  let year = newDate.getFullYear().toString().substring(2, 4);

  let [showModal, setShowModal] = useState(true);
  let handleOpenModal = () => {
    setShowModal(true);
  };
  let handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="navbar_container">
      <button disabled></button>
      <button className="date">{month + year}</button>
      <button onClick={handleOpenModal}>Add</button>
      <ModalCreateNewTask
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        //TODO remove dummy data
        task={{
          date: "2023-03-28",
          id: "1235",
          clienteMin: "Cliente2",
          obraMin: "Obra2",
          index: 1,
          type: "E",
          equipo: "1Dem",
          bandera: "X.Confirmar",
        }}
      />
    </div>
  );
}
