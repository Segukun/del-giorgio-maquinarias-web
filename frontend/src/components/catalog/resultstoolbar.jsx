import "../../styles/catalog/resultstoolbar.css";

const SORT_OPTIONS = [
  { value: "recientes", label: "Más recientes" },
  { value: "antiguos", label: "Más antiguos" },
  { value: "recomendados", label: "Recomendados" },
  { value: "ancho", label: "Ancho de trabajo" },
];

export default function ResultsToolbar({
  query,
  resultCount,
  sort,
  onSortChange,
  activeFilterCount,
  onOpenMobileFilters,
}) {
  return (
    <div className="dg-toolbar">
      <div className="dg-toolbar__info">
        <h2>
          Resultados para: <span>&ldquo;{query}&rdquo;</span>
        </h2>
        <p>Mostrando {resultCount} resultados</p>
      </div>

      <div className="dg-toolbar__actions">
        <button
          type="button"
          className="dg-toolbar__filters-btn"
          onClick={onOpenMobileFilters}
        >
          Filtros
          {activeFilterCount > 0 && (
            <span className="dg-toolbar__filters-count">{activeFilterCount}</span>
          )}
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <label className="dg-toolbar__sort">
          <span className="dg-toolbar__sort-label-full">Ordenar por</span>
          <svg
            className="dg-toolbar__sort-icon"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M7 12h10M4 7h16M10 17h4" />
          </svg>
          <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
