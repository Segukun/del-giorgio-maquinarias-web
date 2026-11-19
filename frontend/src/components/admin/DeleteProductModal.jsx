
import {
  FiAlertTriangle,
  FiLoader,
} from "react-icons/fi";

import AdminModal from "./AdminModal.jsx";

const DeleteProductModal = ({
  product,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!product) return null;

  return (
    <AdminModal
      title="Eliminar producto"
      onClose={onClose}
      closeDisabled={isDeleting}
    >
      <div className="dg-delete-confirmation">
        <span className="dg-delete-confirmation__icon">
          {isDeleting ? (
            <FiLoader className="dg-product-row__loading-icon" />
          ) : (
            <FiAlertTriangle aria-hidden="true" />
          )}
        </span>

        <div>
          <p>
            ¿Estás seguro de que querés eliminar{" "}
            <strong>{product.name}</strong>?
          </p>

          <span>
            Esta acción eliminará el producto del catálogo
            y no se puede deshacer.
          </span>
        </div>
      </div>

      <div className="dg-modal__actions">
        <button
          className="dg-button dg-button--secondary"
          type="button"
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancelar
        </button>

        <button
          className="dg-button dg-button--danger"
          type="button"
          onClick={() => onConfirm(product.id)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <>
              <FiLoader className="dg-product-row__loading-icon" />
              Eliminando...
            </>
          ) : (
            "Eliminar producto"
          )}
        </button>
      </div>
    </AdminModal>
  );
};

export default DeleteProductModal;
