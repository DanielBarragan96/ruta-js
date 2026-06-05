import React, { useRef, useEffect, useState } from "react";
import "./TrashZone.css";

export default function TrashZone({ isDragging }) {
  const zoneRef = useRef(null);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setIsOver(false);
      return;
    }
    const track = (e) => {
      const src = e.touches ? e.touches[0] : e;
      const el = zoneRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setIsOver(
        src.clientX >= r.left && src.clientX <= r.right &&
        src.clientY >= r.top  && src.clientY <= r.bottom
      );
    };
    document.addEventListener("mousemove", track);
    document.addEventListener("touchmove", track, { passive: true });
    return () => {
      document.removeEventListener("mousemove", track);
      document.removeEventListener("touchmove", track);
    };
  }, [isDragging]);

  return (
    <div className={"trash-wrapper" + (isDragging ? " trash-wrapper--visible" : "")}>
      <div
        ref={zoneRef}
        data-trash-zone="1"
        className={"trash-zone" + (isOver ? " trash-zone--over" : "")}
      >
        🗑
      </div>
    </div>
  );
}
