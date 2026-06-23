import { useState } from "react";
import "./Header.css";

export function Header() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <header className="header">
      <div className="header__logo">
        <div className="header__logo-mark">
          <img className="header__logo-img" src="favicon.svg" alt="Exaduo logo" />
        </div>
        <span className="header__title">Exaduodle</span>
      </div>

      <button
        className="header__info-btn"
        onClick={() => setShowInfo((v) => !v)}
        aria-label="Comment jouer"
      >
        ?
      </button>

      {showInfo && (
        <div className="info-overlay" onClick={() => setShowInfo(false)}>
          <div className="info-modal" onClick={(e) => e.stopPropagation()}>
            <button className="info-modal__close" onClick={() => setShowInfo(false)}>
              ✕
            </button>
            <h2>Comment jouer</h2>
            <p>
              Devine <strong>ton collègue Exaduo</strong> du jour en{" "}
              <strong>8 tentatives maximum</strong>.
            </p>
            <ul>
              <li>Tape le nom d&apos;un collègue pour proposer une réponse</li>
              <li>
                Les cases <span className="badge badge--correct">vertes</span> indiquent
                un attribut correct
              </li>
              <li>
                Les cases <span className="badge badge--wrong">grises</span> indiquent
                un attribut différent
              </li>
              <li>
                Les flèches <strong>↑ ↓</strong> t&apos;indiquent si la valeur est
                plus haute ou plus basse (taille, âge, salaire, année)
              </li>
            </ul>
            <p className="info-modal__footer">
              Un nouveau défi chaque jour à minuit 🕛
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
