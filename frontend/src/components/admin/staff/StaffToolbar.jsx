import { FiSearch, FiX } from "react-icons/fi";

const StaffToolbar = ({ query, onQueryChange }) => (
  <div className="dg-staff-toolbar">
    <label>
      <span className="dg-visually-hidden">Buscar cuentas</span>
      <FiSearch aria-hidden="true" />
      <input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Buscar por nombre o email..."
      />
    </label>
    {query ? (
      <button type="button" onClick={() => onQueryChange("")}>
        <FiX aria-hidden="true" />
        Limpiar
      </button>
    ) : null}
  </div>
);

export default StaffToolbar;
