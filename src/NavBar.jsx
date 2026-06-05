import React, { useRef, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./NavBar.css";

const DAY_SHORT = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// NavBar can't import formatDate from App.js (not exported), so this duplicates
// the same local-time logic to avoid the UTC-midnight shift.
function todayLocalStr() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

export default function NavBar({
  date,
  onPrevWeek,
  onNextWeek,
  onSelectDate,
  currWeek,
  selectedDayIndex,
  onSelectDay,
  isDragging,
  onSignOut,
  onFillWeek,
}) {
  const [showCal, setShowCal] = useState(false);
  const [showDayTabs, setShowDayTabs] = useState(false);
  const [hoveredWeek, setHoveredWeek] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(-1);
  const calRef = useRef(null);

  // While dragging, track which tab the pointer is over for drop highlight
  useEffect(() => {
    if (!isDragging) {
      setDragOverIndex(-1);
      return;
    }
    const track = (e) => {
      const src = e.touches ? e.touches[0] : e;
      const x = src.clientX;
      const y = src.clientY;
      let found = -1;
      const tabs = document.querySelectorAll("[data-day-tab]");
      for (const tab of tabs) {
        const r = tab.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
          found = parseInt(tab.getAttribute("data-day-tab"), 10);
          break;
        }
      }
      setDragOverIndex((prev) => (found !== prev ? found : prev));
    };
    document.addEventListener("mousemove", track);
    document.addEventListener("touchmove", track, { passive: true });
    return () => {
      document.removeEventListener("mousemove", track);
      document.removeEventListener("touchmove", track);
    };
  }, [isDragging]);

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

  const todayStr = todayLocalStr();

  return (
    <div className="navbar_container">
      <div className="nav-side nav-side--left">
        <button
          className={"nav-btn" + (isDragging ? " nav-btn--drag-target" : "")}
          data-nav-week="prev"
          onClick={onPrevWeek}
        >&#8249;</button>
      </div>
      <div className="date-center">
        <button
          className="fill-week-btn"
          onClick={onFillWeek}
          title="Llenar Mar/Mié/Vie con todos los tipos"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <rect x="1"   y="2" width="3.5" height="2.5" rx="0.5"/>
            <rect x="1"   y="6.5" width="3.5" height="2.5" rx="0.5"/>
            <rect x="1"   y="11" width="3.5" height="2.5" rx="0.5"/>
            <rect x="6.25" y="2" width="3.5" height="2.5" rx="0.5"/>
            <rect x="6.25" y="6.5" width="3.5" height="2.5" rx="0.5"/>
            <rect x="6.25" y="11" width="3.5" height="2.5" rx="0.5"/>
            <rect x="11.5" y="2" width="3.5" height="2.5" rx="0.5"/>
            <rect x="11.5" y="6.5" width="3.5" height="2.5" rx="0.5"/>
            <rect x="11.5" y="11" width="3.5" height="2.5" rx="0.5"/>
          </svg>
        </button>
        <button
          className={"day-strip-toggle" + (showDayTabs ? " day-strip-toggle--open" : "")}
          onClick={() => setShowDayTabs((v) => !v)}
        />
        <button className="date" onClick={() => setShowCal((v) => !v)}>
          {month + year}
        </button>
        {currWeek && !currWeek.includes(todayStr) ? (
          <button
            className="today-icon-btn"
            onClick={() => {
                const today = new Date();
                if (window.innerWidth <= 768) {
                  const js = today.getDay();
                  onSelectDate(today, js === 0 ? 6 : js - 1);
                } else {
                  onSelectDate(today);
                }
              }}
            title="Ir a hoy"
          >
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="1" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="5" y1="1" x2="5" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="11" y1="1" x2="11" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <rect x="6.5" y="9.5" width="3" height="3" rx="0.5" fill="currentColor"/>
            </svg>
          </button>
        ) : (
          <span className="date-center__spacer" />
        )}
      </div>
      <div className="nav-side nav-side--right">
        <button
          className={"nav-btn" + (isDragging ? " nav-btn--drag-target" : "")}
          data-nav-week="next"
          onClick={onNextWeek}
        >&#8250;</button>
      </div>

      <button
        className={"signout-btn" + (isDragging ? " signout-btn--hidden" : "")}
        onClick={onSignOut}
        title="Sign out"
      >
        ↩
      </button>

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
                const isMobile = window.innerWidth <= 768;
                if (isMobile) {
                  const js = date.getDay(); // 0=Sun … 6=Sat
                  const dayIndex = js === 0 ? 6 : js - 1; // 0=Mon … 6=Sun
                  onSelectDate(date, dayIndex);
                } else {
                  onSelectDate(date);
                }
                setShowCal(false);
              }}
              tileClassName={tileClassName}
              tileContent={tileContent}
            />
          </div>
        </div>
      )}

      {/* Mobile-only day tab strip — hidden on desktop via CSS.
          Uses data-day-tab attributes for pointer-based drop detection in App.js
          (rbd Droppable hit detection is unreliable on mobile touch). */}
      <div className={`day-tab-strip${!showDayTabs && !isDragging ? " day-tab-strip--collapsed" : ""}`}>
        {DAY_SHORT.map((name, i) => (
          <div
            key={i}
            data-day-tab={i}
            className={[
              "day-tab",
              i === selectedDayIndex ? "day-tab--active" : "",
              isDragging ? "day-tab--dragging" : "",
              i === dragOverIndex ? "day-tab--drop" : "",
              currWeek && currWeek[i] === todayStr ? "day-tab--today" : "",
            ].filter(Boolean).join(" ")}
            onClick={() => onSelectDay(i)}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
