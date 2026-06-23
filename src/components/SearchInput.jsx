import { useEffect, useRef, useState } from "react";
import "./SearchInput.css";

export function SearchInput({ input, suggestions, error, onInputChange, onSubmit, onSelect, disabled }) {
  const inputRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  const handleKey = (e) => {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
        return;
      }
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        onSelect(suggestions[activeIndex]);
      } else if (suggestions.length > 0) {
        onSelect(suggestions[0]);
      } else {
        onSubmit();
      }
    }
  };

  return (
    <div className="search-wrapper">
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Tape le nom d'un collègue…"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          autoComplete="off"
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
        />
        <button
          className="search-btn"
          onClick={onSubmit}
          disabled={disabled || !input.trim()}
        >
          Deviner
        </button>
      </div>

      {error && <p className="search-error">{error}</p>}

      {suggestions.length > 0 && (
        <ul className="suggestions" role="listbox">
          {suggestions.map((s, i) => (
            <li key={s.id} id={`suggestion-${i}`} role="option" aria-selected={i === activeIndex}>
              <button
                className={`suggestion-item${i === activeIndex ? " suggestion-item--active" : ""}`}
                onClick={() => onSelect(s)}
                tabIndex={-1}
              >
                <img className="suggestion-photo" src={s.photo} alt={s.name} />
                <span>{s.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
