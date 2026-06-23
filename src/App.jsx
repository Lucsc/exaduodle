import { useEffect, useState } from "react";
import { useGame } from "./hooks/useGame";
import { Header } from "./components/Header";
import { SearchInput } from "./components/SearchInput";
import { GuessRow } from "./components/GuessRow";
import { ResultBanner } from "./components/ResultBanner";
import { ProgressBar } from "./components/ProgressBar";
import { AttributeHeader } from "./components/AttributeHeader";
import { ZoomChallengePage } from "./components/ZoomChallengeModal";
import { BonusSelector } from "./components/BonusSelector";
import { ActionFooter } from "./components/ActionFooter";
import { EmojiChallengePage } from "./components/EmojiChallengePage";
import "./App.css";

export default function App() {
  const {
    guesses,
    gameStatus,
    input,
    suggestions,
    error,
    handleInputChange,
    handleSubmit,
    submitGuess,
    target,
    zoomTarget,
    zoomGuesses,
    zoomStatus,
    zoomChallenge,
    zoomInput,
    zoomSuggestions,
    zoomError,
    handleZoomInputChange,
    handleZoomSubmit,
    submitZoomGuess,
    emojiTarget,
    emojiGuesses,
    emojiStatus,
    emojiChallenge,
    emojiInput,
    emojiSuggestions,
    emojiError,
    handleEmojiInputChange,
    handleEmojiSubmit,
    submitEmojiGuess,
  } = useGame();
  const [showBonusSelector, setShowBonusSelector] = useState(false);
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [isEmojiActive, setIsEmojiActive] = useState(false);

  const zoomDone = zoomStatus === "won" || zoomStatus === "lost";
  const emojiDone = emojiStatus === "won" || emojiStatus === "lost";

  // Show bonus selector after main game completes
  useEffect(() => {
    if (gameStatus !== "playing" && (zoomChallenge || emojiChallenge)) {
      const timer = setTimeout(() => {
        setShowBonusSelector(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameStatus, zoomChallenge, emojiChallenge]);

  // Auto-return from zoom page when completed and show next modal
  useEffect(() => {
    if (isZoomActive && zoomDone) {
      const timer = setTimeout(() => {
        setIsZoomActive(false);
        setShowBonusSelector(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [zoomDone, isZoomActive]);

  // No auto-return from emoji page — user stays until they click back

  return (
    <div className="app">
      {isZoomActive ? (
        <>
          <ZoomChallengePage
            zoomChallenge={zoomChallenge}
            zoomTarget={zoomTarget}
            zoomStatus={zoomStatus}
            zoomGuesses={zoomGuesses}
            zoomInput={zoomInput}
            zoomSuggestions={zoomSuggestions}
            zoomError={zoomError}
            onZoomInputChange={handleZoomInputChange}
            onZoomSubmit={handleZoomSubmit}
            onZoomSelect={submitZoomGuess}
            onBack={() => setIsZoomActive(false)}
          />
        </>
      ) : isEmojiActive ? (
        <>
          <EmojiChallengePage
            emojiChallenge={emojiChallenge}
            emojiTarget={emojiTarget}
            emojiStatus={emojiStatus}
            emojiGuesses={emojiGuesses}
            emojiInput={emojiInput}
            emojiSuggestions={emojiSuggestions}
            emojiError={emojiError}
            onEmojiInputChange={handleEmojiInputChange}
            onEmojiSubmit={handleEmojiSubmit}
            onEmojiSelect={submitEmojiGuess}
            onBack={() => setIsEmojiActive(false)}
          />
        </>
      ) : (
        <>
          <Header />

          <main className="main">
            <section className="hero">
              <p className="hero__eyebrow">Défi du jour</p>
              <h1 className="hero__title">
                Devine ton collègue <br />
                <span className="hero__accent">Exaduo</span> du jour
              </h1>
            </section>

            <div className="section">
              <ProgressBar current={guesses.length} />
            </div>

            {gameStatus !== "playing" && (
              <div className="section">
                <ResultBanner
                  status={gameStatus}
                  target={target}
                  guessCount={guesses.length}
                />
              </div>
            )}

            {gameStatus === "playing" && (
              <div className="section">
                <SearchInput
                  input={input}
                  suggestions={suggestions}
                  error={error}
                  onInputChange={handleInputChange}
                  onSubmit={handleSubmit}
                  onSelect={(entity) => {
                    submitGuess(entity);
                  }}
                  disabled={gameStatus !== "playing"}
                />
              </div>
            )}

            {guesses.length > 0 && (
              <div className="section guesses-section">
                <AttributeHeader />
                <div className="guesses-list">
                  {[...guesses].reverse().map((guess, i) => (
                    <GuessRow
                      key={guess.entity.id}
                      guess={guess}
                      isNew={i === 0}
                    />
                  ))}
                </div>
              </div>
            )}

            {guesses.length === 0 && gameStatus === "playing" && (
              <div className="empty-state">
                <div className="empty-state__icon">🔍</div>
                <p>Tes essais apparaîtront ici</p>
              </div>
            )}
          </main>

          {gameStatus !== "playing" && (
            <ActionFooter
              showZoomButton={!!zoomChallenge && !zoomDone}
              onSelectZoom={() => setIsZoomActive(true)}
              showEmojiButton={!!emojiChallenge && !emojiDone}
              onSelectEmoji={() => setIsEmojiActive(true)}
              showBackButton={false}
            />
          )}

          <footer className="footer">
            <span>Exaduodle — Un défi quotidien par </span>
            <a href="https://www.exaduo.fr" target="_blank" rel="noreferrer">
              Exaduo
            </a>
          </footer>
        </>
      )}

      <BonusSelector
        isOpen={showBonusSelector}
        onClose={() => setShowBonusSelector(false)}
        showZoom={!!zoomChallenge && !zoomDone}
        showEmoji={!!emojiChallenge && !emojiDone}
        onSelectZoom={() => {
          setShowBonusSelector(false);
          setIsZoomActive(true);
        }}
        onSelectEmoji={() => {
          setShowBonusSelector(false);
          setIsEmojiActive(true);
        }}
      />
    </div>
  );
}
