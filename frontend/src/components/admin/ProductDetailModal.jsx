import { FiCalendar, FiInfo, FiLayers, FiTag } from "react-icons/fi";
import AdminModal from "./AdminModal.jsx";
import ProductGallery from "./ProductGallery.jsx";
import StatusBadge from "./StatusBadge.jsx";

const ProductDetailModal = ({ product, onClose, onEdit }) => (
  <AdminModal title={product.name} eyebrow="Detalle del producto" onClose={onClose} size="large">
    <div className="dg-product-detail">
      <ProductGallery
        productName={product.name}
        images={product.images?.length ? product.images : product.image ? [product.image] : []}
      />

      <div className="dg-product-detail__content">
        <div className="dg-product-detail__heading">
          <div>
            <span>{product.brand}</span>
            <strong>{product.category}</strong>
          </div>
          <StatusBadge status={product.status} />
        </div>

        <dl>
          <div>
            <FiTag aria-hidden="true" />
            <dt>Condición</dt>
            <dd>{product.condition}</dd>
          </div>
          <div>
            <FiCalendar aria-hidden="true" />
            <dt>Año</dt>
            <dd>{product.year}</dd>
          </div>
          <div>
            <FiLayers aria-hidden="true" />
            <dt>Categoría</dt>
            <dd>{product.category}</dd>
          </div>
          <div>
            <FiInfo aria-hidden="true" />
            <dt>Detalle</dt>
            <dd>{product.detail}</dd>
          </div>
        </dl>

        <div className="dg-modal__actions">
          <button className="dg-button dg-button--secondary" type="button" onClick={onClose}>
            Cerrar
          </button>
          <button className="dg-button dg-button--primary" type="button" onClick={() => onEdit(product)}>
            Editar producto
          </button>
        </div>
      </div>
    </div>
  </AdminModal>
);

export default ProductDetailModal;
