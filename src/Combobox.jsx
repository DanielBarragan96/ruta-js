import React, { useState, useRef, useMemo, forwardRef, useEffect } from 'react';
import './Combobox.css';

function removeDiacritics(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function matchesSearch(haystack, term) {
  const normalized = removeDiacritics(haystack.toLowerCase());
  const words = removeDiacritics(term.toLowerCase()).split(/\s+/).filter(Boolean);
  return words.every(w => normalized.includes(w));
}

// value      — committed display value (shown when not editing)
// onChange   — called with typed text on every keystroke (optional)
// onSelect   — called with the raw option object when user picks from list
//              if omitted, onChange is called with getLabel(opt) instead
const Combobox = forwardRef(function Combobox(
  { value, onChange, onSelect, options = [], getLabel, getSubLabel, placeholder },
  ref
) {
  const [inputValue, setInputValue] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const isEditingRef = useRef(false);
  const containerRef = useRef(null);

  // Sync from external committed value when not actively typing
  useEffect(() => {
    if (!isEditingRef.current) {
      setInputValue(value || '');
    }
  }, [value]);

  // Filter by what user typed; when not editing show first 60 unfiltered
  const filtered = useMemo(() => {
    if (!isEditingRef.current || !inputValue?.trim()) return options.slice(0, 60);
    return options.filter(opt => {
      const combined = (getLabel(opt) || '') + ' ' + (getSubLabel ? getSubLabel(opt) || '' : '');
      return matchesSearch(combined, inputValue);
    }).slice(0, 60);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, options]);

  useEffect(() => { setActiveIndex(-1); }, [filtered]);

  const handleChange = (e) => {
    isEditingRef.current = true;
    const val = e.target.value;
    setInputValue(val);
    onChange?.(val);
    setIsOpen(true);
    setActiveIndex(-1);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  // Restore committed display if user blurs without selecting
  const handleBlur = () => {
    setTimeout(() => {
      isEditingRef.current = false;
      setInputValue(value || '');
      setIsOpen(false);
    }, 150);
  };

  const handleSelect = (opt) => {
    isEditingRef.current = false;
    if (onSelect) {
      onSelect(opt);
      // value prop will update from parent; useEffect syncs inputValue
    } else {
      const label = getLabel(opt);
      setInputValue(label);
      onChange?.(label);
    }
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
        setActiveIndex(0);
        e.preventDefault();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setActiveIndex(i => Math.max(i - 1, 0));
      e.preventDefault();
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && filtered[activeIndex]) {
        handleSelect(filtered[activeIndex]);
      } else {
        setIsOpen(false);
      }
      e.stopPropagation();
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="combobox" ref={containerRef}>
      <input
        ref={ref}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
      />
      {isOpen && filtered.length > 0 && (
        <div className="combobox-dropdown">
          {filtered.map((opt, i) => (
            <div
              key={i}
              className={'combobox-option' + (i === activeIndex ? ' combobox-option--active' : '')}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(opt); }}
            >
              <span className="combobox-label">{getLabel(opt)}</span>
              {getSubLabel && (
                <span className="combobox-sublabel">{getSubLabel(opt)}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default Combobox;
