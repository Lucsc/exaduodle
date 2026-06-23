import { SearchInput } from "./SearchInput";
import { AttributeHeader } from "./AttributeHeader";
import { GuessRow } from "./GuessRow";
import { ActionFooter } from "./ActionFooter";
import "./ZoomChallengeModal.css";

function getImageScale(zoomChallenge, guessCount, status) {
  if (!zoomChallenge) {
    return 1;
  }

  if (status !== "playing") {
    return 1;
  }

  return Math.max(1.15, zoomChallenge.initialScale - guessCount * 0.38);
}

export function ZoomChallengePage({
  zoomChallenge,
  zoomTarget,
  zoomStatus,
  zoomGuesses,
  zoomInput,
  zoomSuggestions,
  zoomError,
  onZoomInputChange,
  onZoomSubmit,
  onZoomSelect,
  onBack,
}) {
  if (!zoomChallenge) {
    return (
      <div className="zoom-page">
        <header className="zoom-page__header">
          <button
            className="zoom-page__back"
            onClick={onBack}
            aria-label="Retour"
          >
            ← Retour
          </button>
        </header>
        <main className="zoom-page__main">
          <div className="zoom-panel">
            <div className="zoom-modal__header">
              <p className="zoom-modal__eyebrow">Erreur</p>
              <h2>Impossible de charger le défi</h2>
              <p>Veuillez rafraîchir la page et réessayer.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!zoomTarget) {
    return (
      <div className="zoom-page">
        <header className="zoom-page__header">
          <button
            className="zoom-page__back"
            onClick={onBack}
            aria-label="Retour"
          >
            ← Retour
          </button>
        </header>
        <main className="zoom-page__main">
          <div className="zoom-panel">
            <div className="zoom-modal__header">
              <p className="zoom-modal__eyebrow">Erreur</p>
              <h2>Cible introuvable</h2>
              <p>Veuillez rafraîchir la page et réessayer.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isComplete = zoomStatus !== "playing";
  const currentImage = isComplete ? zoomChallenge.clearSrc : zoomChallenge.darkSrc;
  const imageScale = getImageScale(zoomChallenge, zoomGuesses.length, zoomStatus);

  return (
    <div className="zoom-page">
      <header className="zoom-page__header">
        <button
          className="zoom-page__back"
          onClick={onBack}
          aria-label="Retour"
        >
          ← Retour
        </button>
      </header>

      <main className="zoom-page__main">
        <div className="zoom-panel">
          <div className="zoom-modal__close-mobile">
            <button
              className="zoom-modal__close"
              onClick={onBack}
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

        <div className="zoom-modal__header">
          <p className="zoom-modal__eyebrow">Round bonus</p>
          <h2>Zoom Exaduo</h2>
          <p>
            L&apos;image démarre très zoomée et se dévoile un peu plus à chaque essai.
          </p>
        </div>

        <div className="zoom-stage">
          <div className="zoom-stage__frame">
            <img
              className="zoom-stage__image"
              src={currentImage}
              alt={isComplete ? zoomTarget.name : "Défi zoom mystère"}
              style={{
                transform: `scale(${imageScale})`,
                transformOrigin: `${zoomChallenge.focusX}% ${zoomChallenge.focusY}%`,
              }}
            />
          </div>

          <div className="zoom-stage__meta">
            <span>
              {zoomStatus === "playing"
                ? "Image sombre"
                : zoomStatus === "won"
                  ? "Image révélée"
                  : `C'était ${zoomTarget.name}`}
            </span>
          </div>
        </div>

        {zoomStatus === "playing" ? (
          <div className="zoom-modal__search">
            <SearchInput
              input={zoomInput}
              suggestions={zoomSuggestions}
              error={zoomError}
              onInputChange={onZoomInputChange}
              onSubmit={onZoomSubmit}
              onSelect={onZoomSelect}
              disabled={false}
            />
          </div>
        ) : (
          <div className={`zoom-result zoom-result--${zoomStatus}`}>
            <h3>{zoomStatus === "won" ? "Trouvé" : "Raté"}</h3>
            <p>
              {zoomStatus === "won"
                ? `Bien joué, c'était ${zoomTarget.name}.`
                : `L'image correspondait à ${zoomTarget.name}.`}
            </p>
          </div>
        )}

        {zoomGuesses.length > 0 && (
          <div className="zoom-guesses-section">
            <AttributeHeader />
            <div className="zoom-guesses-list">
              {[...zoomGuesses].reverse().map((guess, i) => (
                <GuessRow
                  key={guess.entity.id}
                  guess={guess}
                  isNew={i === 0}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
    <ActionFooter 
      showBackButton={true}
      onBack={onBack}
    />
    </div>
  );
}