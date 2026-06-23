import { ATTRIBUTES } from "../data/entities";
import "./AttributeHeader.css";

export function AttributeHeader() {
  return (
    <div className="attr-header">
      <div className="attr-header__name">Collègue</div>
      <div className="attr-header__cells">
        {ATTRIBUTES.map((a) => (
          <div key={a.key} className="attr-header__cell">
            {a.label}
          </div>
        ))}
      </div>
    </div>
  );
}
