import { FiAlertTriangle } from "react-icons/fi";
import AdminModal from "./AdminModal.jsx";

const DeleteProductModal = ({ product, onClose, onConfirm }) => (
  <AdminModal title="Quitar producto" eyebrow="Acción temporal" onClose={onClose}>
    <div className="dg-delete-confirmation">
      <span className="dg-delete-confirmation__icon" aria-hidden="true">
        <FiAlertTriangle />
      </span>
      <div>
        <p>
          ¿Querés quitar <strong>{product.name}</strong> de la tabla?
        </p>
        <span>Solo se removerá del estado local y volverá a aparecer al recargar la página.</span>
      </div>
    </div>

    <div className="dg-modal__actions">
      <button className="dg-button dg-button--secondary" type="button" onClick={onClose}>
        Cancelar
      </button>
      <button className="dg-button dg-button--danger" type="button" onClick={() => onConfirm(product.id)}>
        Quitar producto
      </button>
    </div>
  </AdminModal>
);

export default DeleteProductModal;
