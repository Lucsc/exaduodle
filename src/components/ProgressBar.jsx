import "./ProgressBar.css";

export function ProgressBar({ current, max }) {
  return (
    <div className="progress-bar" aria-label={`${current} tentatives sur ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`progress-bar__dot ${i < current ? "progress-bar__dot--used" : ""}`}
        />
      ))}
    </div>
  );
}
