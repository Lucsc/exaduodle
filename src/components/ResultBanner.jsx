import "./ResultBanner.css";

export function ResultBanner({ status, target, guessCount }) {
  if (status === "playing") return null;

  const won = status === "won";

  return (
    <div className={`result-banner result-banner--${status}`}>
      <div className="result-banner__media">
        <img className="result-banner__photo" src={target.photo} alt={target.name} />
      </div>
      <div className="result-banner__content">
        <h2 className="result-banner__title">
          {won ? "Bravo !" : "Dommage…"}
        </h2>
        <p className="result-banner__text">
          {won
            ? `Tu as trouvé en ${guessCount} essai${guessCount > 1 ? "s" : ""} !`
            : `C'était ${target.name}.`}
        </p>
        <p className="result-banner__sub">
          Reviens demain pour un nouveau défi 🕛
        </p>
      </div>
    </div>
  );
}
