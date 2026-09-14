import { FiAlertTriangle } from "react-icons/fi";
import AdminModal from "./AdminModal.jsx";

const DeleteProductModal = ({ product, onClose, onConfirm }) => (
  <AdminModal title="Eliminar producto" onClose={onClose}>
    <div className="dg-delete-confirmation">
      <span className="dg-delete-confirmation__icon" aria-hidden="true">
        <FiAlertTriangle />
      </span>
      <div>
        <p>
          ¿Querés eliminar <strong>{product.name}</strong> de forma permanente?
        </p>
        <span>Esta acción no se puede deshacer.</span>
      </div>
    </div>

    <div className="dg-modal__actions">
      <button className="dg-button dg-button--secondary" type="button" onClick={onClose}>
        Cancelar
      </button>
      <button className="dg-button dg-button--danger" type="button" onClick={() => onConfirm(product.id)}>
        Eliminar producto
      </button>
    </div>
  </AdminModal>
);

export default DeleteProductModal;