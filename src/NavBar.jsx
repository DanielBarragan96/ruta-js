import React from "react";
import "./NavBar.css";

export default function NavBar({ date }) {
  let newDate = new Date(
    date.substring(0, 4),
    date.substring(5, 7),
    date.substring(8, 10)
  );
  newDate.setMonth(newDate.getMonth() - 1);
  console.log(newDate);
  const month = newDate
    .toLocaleString("ES-MX", { month: "short" })
    .toUpperCase();
  let year = newDate
    .getFullYear()
    .toString()
    .substring(2, 4);
  return (
    <div className="navbar_container">
      <h1>{month + year}</h1>
      <button>Add</button>
    </div>
  );
}