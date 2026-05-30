import React, { useRef, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./NavBar.css";

export default function NavBar({ date, onPrevWeek, onNextWeek, onSelectDate }) {
  const [showCal, setShowCal] = useState(false);
  const [hoveredWeek, setHoveredWeek] = useState(null);
  const calRef = useRef(null);

  // Single close mechanism: click anywhere outside the calendar container
  useEffect(() => {
    if (!showCal) return;
    const handler = (e) => {
      if (calRef.current && !calRef.current.contains(e.target)) {
        setShowCal(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showCal]);

  // Returns the ISO Monday of the week containing date d (Monday-anchored)
  const getWeekStart = (d) => {
    const copy = new Date(d);
    const day = copy.getDay();
    copy.setDate(copy.getDate() - (day === 0 ? 6 : day - 1));
    return copy.toISOString().slice(0, 10);
  };

  const tileClassName = ({ date: tileDate }) => {
    if (!hoveredWeek) return null;
    return getWeekStart(tileDate) === hoveredWeek ? "week-highlight" : null;
  };

  const tileContent = ({ date: tileDate }) => (
    // Full-coverage div so onMouseEnter fires across the entire tile hit area
    <div
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
      onMouseEnter={() => setHoveredWeek(getWeekStart(tileDate))}
    />
  );

  // date prop is "YYYY-MM-DD"; parsing without time component can shift back
  // 1 day in negative UTC offsets — +1 corrects for display only
  const displayDate = new Date(date);
  displayDate.setDate(displayDate.getDate() + 1);
  const month = displayDate
    .toLocaleString("ES-MX", { month: "short" })
    .toUpperCase();
  const year = displayDate.getFullYear().toString().substring(2, 4);

  return (
    <div className="navbar_container">
      <button className="nav-btn" onClick={onPrevWeek}>&#8249;</button>
      <button className="date" onClick={() => setShowCal((v) => !v)}>
        {month + year}
      </button>
      <button className="nav-btn" onClick={onNextWeek}>&#8250;</button>

      {showCal && (
        <div className="cal-overlay">
          <div
            ref={calRef}
            className="cal-container"
            onMouseLeave={() => setHoveredWeek(null)}
          >
            <Calendar
              calendarType="iso8601"
              onClickDay={(date) => {
                onSelectDate(date);
                setShowCal(false);
              }}
              tileClassName={tileClassName}
              tileContent={tileContent}
            />
          </div>
        </div>
      )}
    </div>
  );
}
