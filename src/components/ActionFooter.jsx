import "./ActionFooter.css";

export function ActionFooter({ 
  showZoomButton, 
  onSelectZoom,
  showEmojiButton,
  onSelectEmoji,
  showBackButton,
  onBack 
}) {
  return (
    <footer className="action-footer">
      {showZoomButton && (
        <button className="action-footer__button" onClick={onSelectZoom}>
          🔍 Trouve avec l&apos;image
        </button>
      )}
      {showEmojiButton && (
        <button className="action-footer__button" onClick={onSelectEmoji}>
          😊 Trouve avec les emojis
        </button>
      )}
      {showBackButton && (
        <button className="action-footer__button" onClick={onBack}>
          ← Trouve ton collègue
        </button>
      )}
    </footer>
  );
}
