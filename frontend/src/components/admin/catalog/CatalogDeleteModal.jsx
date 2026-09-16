import { FiAlertTriangle } from "react-icons/fi";
import AdminModal from "../AdminModal.jsx";

const CatalogDeleteModal = ({ entityLabel, item, onClose, onConfirm }) => (
  <AdminModal title={`Eliminar ${entityLabel}`} eyebrow="Confirmación" onClose={onClose}>
    <div className="dg-delete-confirmation">
      <span className="dg-delete-confirmation__icon" aria-hidden="true">
        <FiAlertTriangle />
      </span>
      <div>
        <p>
          ¿Seguro que querés eliminar <strong>{item.name}</strong>?
        </p>
        <span>El cambio es temporal y se restablece al recargar la página.</span>
      </div>
    </div>

    <div className="dg-modal__actions">
      <button className="dg-button dg-button--secondary" type="button" onClick={onClose}>
        Cancelar
      </button>
      <button className="dg-button dg-button--danger" type="button" onClick={() => onConfirm(item.id)}>
        Eliminar
      </button>
    </div>
  </AdminModal>
);

export default CatalogDeleteModal;
