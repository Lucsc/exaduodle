import "./BonusSelector.css";

export function BonusSelector({ isOpen, onClose, onSelectZoom, onSelectEmoji, showZoom, showEmoji }) {
  if (!isOpen) {
    return null;
  }

  const allDone = !showZoom && !showEmoji;

  return (
    <div className="bonus-overlay" onClick={onClose}>
      <div className="bonus-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="bonus-modal__close"
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>

        {allDone ? (
          <div className="bonus-modal__done">
            <div className="bonus-modal__done-icon">🎉</div>
            <h2>Bravo !</h2>
            <p>Tu as terminé tous les défis du jour.</p>
            <p className="bonus-modal__done-subtitle">Revenez demain pour de nouveaux défis !</p>
          </div>
        ) : (
          <>
            <div className="bonus-modal__header">
              <h2>Bonus Challenges</h2>
              <p>Continues avec un défi supplémentaire</p>
            </div>

            <div className="bonus-grid">
              {showZoom && (
                <button className="bonus-card" onClick={onSelectZoom}>
                  <div className="bonus-card__icon">🔍</div>
                  <div className="bonus-card__title">Trouve avec l&apos;image</div>
                  <div className="bonus-card__desc">
                    L&apos;image démarre zoomée et se dévoile progressivement
                  </div>
                </button>
              )}

              {showEmoji && (
                <button className="bonus-card" onClick={onSelectEmoji}>
                  <div className="bonus-card__icon">😊</div>
                  <div className="bonus-card__title">Trouve avec les emojis</div>
                  <div className="bonus-card__desc">
                    Devinez le collègue avec les emojis
                  </div>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
