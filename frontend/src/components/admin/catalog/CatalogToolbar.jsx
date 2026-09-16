import { FiSearch, FiX } from "react-icons/fi";

const CatalogToolbar = ({ query, status, searchPlaceholder, onQueryChange, onStatusChange }) => {
  const hasFilters = Boolean(query || status);

  return (
    <div className="dg-catalog-toolbar">
      <label className="dg-catalog-toolbar__search">
        <span className="dg-visually-hidden">Buscar</span>
        <FiSearch aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={searchPlaceholder}
        />
      </label>

      <label className="dg-catalog-toolbar__select">
        <span className="dg-visually-hidden">Filtrar por estado</span>
        <select value={status} onChange={(event) => onStatusChange(event.target.value)}>
          <option value="">Todos los estados</option>
          <option value="active">Activa</option>
          <option value="inactive">Inactiva</option>
        </select>
      </label>

      {hasFilters ? (
        <button
          className="dg-catalog-toolbar__clear"
          type="button"
          onClick={() => {
            onQueryChange("");
            onStatusChange("");
          }}
        >
          <FiX aria-hidden="true" />
          Limpiar
        </button>
      ) : null}
    </div>
  );
};

export default CatalogToolbar;
