import { FiEdit3, FiInbox, FiTrash2 } from "react-icons/fi";
import ActiveStatusBadge from "../catalog/ActiveStatusBadge.jsx";

const CategoriesTable = ({ categories, hasFilters, onEdit, onDelete }) => {
  if (!categories.length) {
    return (
      <div className="dg-catalog-empty">
        <FiInbox aria-hidden="true" />
        <strong>{hasFilters ? "No encontramos categorías" : "No hay categorías registradas"}</strong>
        <span>{hasFilters ? "Probá cambiando o limpiando los filtros." : "Creá la primera categoría desde el botón superior."}</span>
      </div>
    );
  }

  return (
    <div className="dg-catalog-table__scroll">
      <table className="dg-catalog-table dg-catalog-table--categories">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td data-label="Nombre"><strong>{category.name}</strong></td>
              <td data-label="Estado"><ActiveStatusBadge isActive={category.isActive} /></td>
              <td data-label="Acciones">
                <div className="dg-catalog-actions">
                  <button type="button" aria-label={`Editar ${category.name}`} title="Editar" onClick={() => onEdit(category)}>
                    <FiEdit3 aria-hidden="true" />
                  </button>
                  <button className="is-danger" type="button" aria-label={`Eliminar ${category.name}`} title="Eliminar" onClick={() => onDelete(category)}>
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

export default CategoriesTable;
