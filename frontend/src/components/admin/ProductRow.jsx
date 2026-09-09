import { FiChevronRight, FiEdit3, FiImage, FiStar, FiTrash2 } from "react-icons/fi";
import StatusBadge from "./StatusBadge.jsx";

const ProductRow = ({ product, onToggleFeatured, onEdit, onDelete, onView }) => {
  const images = product.images?.length ? product.images : product.image ? [product.image] : [];

  return (
    <tr>
    <td data-label="Imagen">
      <div className="dg-product-row__image">
        {images[0] ? <img src={images[0]} alt="" loading="lazy" /> : null}
        {images.length > 1 ? (
          <span aria-label={`${images.length} imágenes`}>
            <FiImage aria-hidden="true" />
            {images.length}
          </span>
        ) : null}
      </div>
    </td>
    <td data-label="Modelo">
      <div className="dg-product-row__model">
        <strong>{product.name}</strong>
        <span>
          {product.brand} · {product.year}
        </span>
      </div>
    </td>
    <td data-label="Marca">
      <div className="dg-product-row__brand">
        {product.brandLogo ? <img src={product.brandLogo} alt="" /> : null}
        <span>{product.brand}</span>
      </div>
    </td>
    <td data-label="Categoría">{product.category}</td>
    <td data-label="Condición">{product.condition}</td>
    <td data-label="Estado">
      <StatusBadge status={product.status} />
    </td>
    <td data-label="Acciones">
      <div className="dg-product-row__actions">
        <button
          type="button"
          className={`dg-icon-button ${product.featured ? "is-featured" : ""}`}
          aria-label={product.featured ? `Quitar ${product.name} de destacados` : `Destacar ${product.name}`}
          aria-pressed={product.featured}
          title={product.featured ? "Quitar de destacados" : "Destacar"}
          onClick={() => onToggleFeatured(product.id)}
        >
          <FiStar aria-hidden="true" />
        </button>
        <button
          type="button"
          className="dg-icon-button"
          aria-label={`Editar ${product.name}`}
          title="Editar"
          onClick={() => onEdit(product)}
        >
          <FiEdit3 aria-hidden="true" />
        </button>
        <button
          type="button"
          className="dg-icon-button is-danger"
          aria-label={`Eliminar ${product.name}`}
          title="Eliminar"
          onClick={() => onDelete(product)}
        >
          <FiTrash2 aria-hidden="true" />
        </button>
        <button
          type="button"
          className="dg-icon-button"
          aria-label={`Ver detalle de ${product.name}`}
          title="Ver detalle"
          onClick={() => onView(product)}
        >
          <FiChevronRight aria-hidden="true" />
        </button>
      </div>
    </td>
    </tr>
  );
};

export default ProductRow;
