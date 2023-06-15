import { useState, useEffect } from "react";
import React from "react";
import "./NavBar.css";

function ModalCreateNewTask({ displayModal, closeModal }) {
  return (
    <div
      id="myModal"
      className="modal"
      style={{ display: displayModal ? "block" : "none" }}
    >
      <div className="modal-content">
        <p>Some text in the Modal..</p>
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
}

export default function NavBar({ date }) {
  let newDate = new Date(date);
  newDate.setMonth(newDate.getMonth());
  const month = newDate
    .toLocaleString("ES-MX", { month: "short" })
    .toUpperCase();
  let year = newDate
    .getFullYear()
    .toString()
    .substring(2, 4);

  let [displayModal, setDisplayModal] = useState(false);
  let showModal = () => {
    setDisplayModal(!displayModal);
  };
  let closeModal = () => {
    setDisplayModal(false);
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        setDisplayModal(false);
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div className="navbar_container">
      <button disabled></button>
      <button className="date">{month + year}</button>
      <button onClick={showModal}>Add</button>
      <ModalCreateNewTask displayModal={displayModal} closeModal={closeModal} />
    </div>
  );
}
