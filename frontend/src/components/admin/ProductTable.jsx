import { FiInbox } from "react-icons/fi";
import ProductRow from "./ProductRow.jsx";

const ProductTable = ({ products, onToggleFeatured, onEdit, onDelete, onView }) => {
  if (!products.length) {
    return (
      <div className="dg-product-table__empty">
        <FiInbox aria-hidden="true" />
        <strong>No encontramos productos</strong>
        <span>Probá cambiando o limpiando los filtros.</span>
      </div>
    );
  }

  return (
    <div className="dg-product-table__scroll">
      <table className="dg-product-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Categoría</th>
            <th>Condición</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onToggleFeatured={onToggleFeatured}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
