import { ATTRIBUTES, formatAttributeValue } from "../data/entities";
import "./GuessRow.css";

export function GuessRow({ guess, isNew }) {
  // Handle guesses without result (from zoom page)
  if (!guess.result) {
    return (
      <div className={`guess-row ${isNew ? "guess-row--new" : ""}`}>
        <div className="guess-name">
          <img
            className="guess-photo"
            src={guess.entity.photo}
            alt={guess.entity.name}
          />
          <span>{guess.entity.name}</span>
        </div>
      </div>
    );
  }

  // Handle regular guesses with result data
  return (
    <div className={`guess-row ${isNew ? "guess-row--new" : ""}`}>
      <div className="guess-name">
        <img
          className="guess-photo"
          src={guess.entity.photo}
          alt={guess.entity.name}
        />
        <span>{guess.entity.name}</span>
      </div>
      <div className="guess-cells">
        {guess.result.map((r, i) => {
          const attr = ATTRIBUTES[i];
          const display = formatAttributeValue(r.key, r.guessVal);

          return (
            <div
              key={r.key}
              className={`guess-cell guess-cell--${r.status}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="guess-cell__label">{attr.label}</span>
              <span className="guess-cell__value">
                {display}
                {r.hint && <span className="guess-cell__hint">{r.hint}</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
