import { FiEdit3, FiImage, FiInbox, FiTrash2 } from "react-icons/fi";
import ActiveStatusBadge from "../catalog/ActiveStatusBadge.jsx";

const BrandsTable = ({ brands, hasFilters, onEdit, onDelete }) => {
  if (!brands.length) {
    return (
      <div className="dg-catalog-empty">
        <FiInbox aria-hidden="true" />
        <strong>{hasFilters ? "No encontramos marcas" : "No hay marcas registradas"}</strong>
        <span>{hasFilters ? "Probá cambiando o limpiando los filtros." : "Creá la primera marca desde el botón superior."}</span>
      </div>
    );
  }

  return (
    <div className="dg-catalog-table__scroll">
      <table className="dg-catalog-table dg-catalog-table--brands">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Marca</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand.id}>
              <td data-label="Imagen">
                <div className="dg-brand-thumbnail">
                  {brand.image ? <img src={brand.image.url ?? brand.image} alt="" /> : <FiImage aria-hidden="true" />}
                </div>
              </td>
              <td data-label="Marca"><strong>{brand.name}</strong></td>
              <td data-label="Estado"><ActiveStatusBadge isActive={brand.isActive} /></td>
              <td data-label="Acciones">
                <div className="dg-catalog-actions">
                  <button type="button" aria-label={`Editar ${brand.name}`} title="Editar" onClick={() => onEdit(brand)}>
                    <FiEdit3 aria-hidden="true" />
                  </button>
                  <button className="is-danger" type="button" aria-label={`Eliminar ${brand.name}`} title="Eliminar" onClick={() => onDelete(brand)}>
                    <FiTrash2 aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BrandsTable;
