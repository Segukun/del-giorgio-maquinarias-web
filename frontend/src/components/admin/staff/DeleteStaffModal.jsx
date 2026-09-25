import { FiAlertTriangle } from "react-icons/fi";
import AdminModal from "../AdminModal.jsx";

const DeleteStaffModal = ({ user, onClose, onConfirm }) => (
  <AdminModal title="Eliminar cuenta" eyebrow="Acción temporal" onClose={onClose}>
    <div className="dg-delete-confirmation">
      <span className="dg-delete-confirmation__icon" aria-hidden="true">
        <FiAlertTriangle />
      </span>
      <div>
        <p>
          ¿Eliminar la cuenta de <strong>{user.name}</strong>?
        </p>
        <span>Esta accion no podra revertirse.</span>
      </div>
    </div>

    <div className="dg-modal__actions">
      <button className="dg-button dg-button--secondary" type="button" onClick={onClose}>
        Cancelar
      </button>
      <button className="dg-button dg-button--danger" type="button" onClick={() => onConfirm(user.id)}>
        Eliminar cuenta
      </button>
    </div>
  </AdminModal>
);

export default DeleteStaffModal;
