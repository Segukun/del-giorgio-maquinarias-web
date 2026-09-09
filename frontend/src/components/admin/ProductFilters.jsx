import { FiSearch, FiX } from "react-icons/fi";

const ProductFilters = ({ filters, options, onChange, onClear }) => {
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="dg-product-filters" aria-label="Filtros de productos">
      <label className="dg-product-filters__search">
        <span className="dg-visually-hidden">Buscar productos</span>
        <FiSearch aria-hidden="true" />
        <input
          type="search"
          value={filters.query}
          onChange={(event) => onChange("query", event.target.value)}
          placeholder="Buscar por nombre, marca o modelo..."
        />
      </label>

      <label className="dg-product-filters__select">
        <span className="dg-visually-hidden">Filtrar por categoría</span>
        <select
          value={filters.category}
          onChange={(event) => onChange("category", event.target.value)}
        >
          <option value="">Categoría</option>
          {options.categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="dg-product-filters__select">
        <span className="dg-visually-hidden">Filtrar por marca</span>
        <select
          value={filters.brand}
          onChange={(event) => onChange("brand", event.target.value)}
        >
          <option value="">Marca</option>
          {options.brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </label>

      <label className="dg-product-filters__select">
        <span className="dg-visually-hidden">Filtrar por estado</span>
        <select
          value={filters.status}
          onChange={(event) => onChange("status", event.target.value)}
        >
          <option value="">Estado</option>
          {options.statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      {hasFilters && (
        <button className="dg-product-filters__clear" type="button" onClick={onClear}>
          <FiX aria-hidden="true" />
          Limpiar
        </button>
      )}
    </div>
  );
};

export default ProductFilters;
