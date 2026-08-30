import "../../styles/catalog/checkboxgroup.css";

export default function CheckboxGroup({ options, selected, onToggle }) {
  return (
    <div className="dg-checkgroup">
      {options.map((opt) => {
        const checked = selected.includes(opt);
        return (
          <label key={opt} className={`dg-checkgroup__item ${checked ? "is-checked" : ""}`}>
            <input type="checkbox" checked={checked} onChange={() => onToggle(opt)} />
            <span className="dg-checkgroup__box">
              <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 8.5l3 3 7-7" />
              </svg>
            </span>
            <span className="dg-checkgroup__label">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}
