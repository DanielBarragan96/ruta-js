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

        <button onClick={handleCloseModal}>Cancelar</button>
      </div>
    </ReactModal>
  );
}
