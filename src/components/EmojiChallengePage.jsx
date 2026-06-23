import { SearchInput } from "./SearchInput";
import { AttributeHeader } from "./AttributeHeader";
import { GuessRow } from "./GuessRow";
import { ActionFooter } from "./ActionFooter";
import "./EmojiChallengePage.css";

export function EmojiChallengePage({
  emojiChallenge,
  emojiTarget,
  emojiStatus,
  emojiGuesses,
  emojiInput,
  emojiSuggestions,
  emojiError,
  onEmojiInputChange,
  onEmojiSubmit,
  onEmojiSelect,
  onBack,
}) {
  if (!emojiChallenge) {
    return (
      <div className="emoji-page">
        <header className="emoji-page__header">
          <button
            className="emoji-page__back"
            onClick={onBack}
            aria-label="Retour"
          >
            ← Retour
          </button>
        </header>
        <main className="emoji-page__main">
          <div className="emoji-panel">
            <div className="emoji-modal__header">
              <p className="emoji-modal__eyebrow">Erreur</p>
              <h2>Impossible de charger le défi</h2>
              <p>Veuillez rafraîchir la page et réessayer.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!emojiTarget) {
    return (
      <div className="emoji-page">
        <header className="emoji-page__header">
          <button
            className="emoji-page__back"
            onClick={onBack}
            aria-label="Retour"
          >
            ← Retour
          </button>
        </header>
        <main className="emoji-page__main">
          <div className="emoji-panel">
            <div className="emoji-modal__header">
              <p className="emoji-modal__eyebrow">Erreur</p>
              <h2>Cible introuvable</h2>
              <p>Veuillez rafraîchir la page et réessayer.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isComplete = emojiStatus !== "playing";

  return (
    <div className="emoji-page">
      <header className="emoji-page__header">
        <button
          className="emoji-page__back"
          onClick={onBack}
          aria-label="Retour"
        >
          ← Retour
        </button>
      </header>

      <main className="emoji-page__main">
        <div className="emoji-panel">
          <div className="emoji-modal__close-mobile">
            <button
              className="emoji-modal__close"
              onClick={onBack}
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          <div className="emoji-modal__header">
            <p className="emoji-modal__eyebrow">Round bonus</p>
            <h2>Emoji Exaduo</h2>
            <p>
              Devine le collègue avec les emojis. Un nouvel emoji s'affiche à chaque essai.
            </p>
          </div>

          <div className="emoji-stage">
            <div className="emoji-stage__frame">
              <div className="emoji-stage__emojis">
                {emojiChallenge.emojiSequence.map((emoji, index) => {
                  const revealed = isComplete || index < emojiGuesses.length + 1;
                  return (
                    <div
                      key={index}
                      className={`emoji-stage__emoji-item ${
                        revealed
                          ? "emoji-stage__emoji-item--revealed"
                          : "emoji-stage__emoji-item--hidden"
                      }`}
                    >
                      <span className="emoji-stage__emoji-text">
                        {revealed ? emoji : "❓"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="emoji-stage__meta">
              <span>
                {emojiStatus === "playing"
                  ? "Emojis révélés peu à peu"
                  : emojiStatus === "won"
                    ? "Image révélée"
                    : `C'était ${emojiTarget.name}`}
              </span>
            </div>
          </div>

          {emojiStatus === "playing" ? (
            <div className="emoji-modal__search">
              <SearchInput
                input={emojiInput}
                suggestions={emojiSuggestions}
                error={emojiError}
                onInputChange={onEmojiInputChange}
                onSubmit={onEmojiSubmit}
                onSelect={onEmojiSelect}
                disabled={false}
              />
            </div>
          ) : (
            <div className={`emoji-result emoji-result--${emojiStatus}`}>
              {emojiStatus === "won" && (
                <div className="emoji-result__photo-wrap">
                  <img
                    className="emoji-result__photo"
                    src={emojiTarget.photo}
                    alt={emojiTarget.name}
                  />
                </div>
              )}
              <h3>{emojiStatus === "won" ? "Bravo !" : "Dommage…"}</h3>
              <p>
                {emojiStatus === "won"
                  ? `Tu as trouvé en ${emojiGuesses.length} essai${emojiGuesses.length > 1 ? "s" : ""} !`
                  : `C'était ${emojiTarget.name}.`}
              </p>
            </div>
          )}

          {emojiGuesses.length > 0 && (
            <div className="emoji-guesses-section">
              <AttributeHeader />
              <div className="emoji-guesses-list">
                {[...emojiGuesses].reverse().map((guess, i) => (
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
