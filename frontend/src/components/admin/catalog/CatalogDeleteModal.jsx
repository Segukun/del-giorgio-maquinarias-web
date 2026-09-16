import { useRef, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import AdminModal from "../AdminModal.jsx";
import { catalogErrorMessage } from "../../../firebase/catalogShared.js";

const CatalogDeleteModal = ({ entityLabel, item, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const deletingRef = useRef(false);

  const handleConfirm = async () => {
    if (deletingRef.current) return;
    deletingRef.current = true;
    setDeleting(true);
    setError("");
    try {
      await onConfirm(item.id);
    } catch (deleteError) {
      setError(catalogErrorMessage(deleteError, `No se pudo eliminar la ${entityLabel}. Intentá de nuevo.`));
    } finally {
      deletingRef.current = false;
      setDeleting(false);
    }
  };

  return (
    <AdminModal title={`Eliminar ${entityLabel}`} eyebrow="Confirmación" onClose={deleting ? () => {} : onClose}>
      <div className="dg-delete-confirmation">
        <span className="dg-delete-confirmation__icon" aria-hidden="true"><FiAlertTriangle /></span>
        <div>
          <p>¿Seguro que querés eliminar <strong>{item.name}</strong>?</p>
          <span>Esta acción es permanente. Si tiene maquinaria asociada, no se eliminará.</span>
        </div>
      </div>
      {error ? <p className="dg-catalog-form__error" role="alert">{error}</p> : null}
      <div className="dg-modal__actions">
        <button className="dg-button dg-button--secondary" type="button" onClick={onClose} disabled={deleting}>Cancelar</button>
        <button className="dg-button dg-button--danger" type="button" onClick={handleConfirm} disabled={deleting}>
          {deleting ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </AdminModal>
  );
};

export default CatalogDeleteModal;
