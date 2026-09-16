import { useRef, useState } from "react";
import AdminModal from "../AdminModal.jsx";
import { catalogErrorMessage, normalizeCatalogName } from "../../../firebase/catalogShared.js";

const CategoryFormModal = ({ category, categories, onClose, onSubmit }) => {
  const isEditing = Boolean(category);
  const [name, setName] = useState(category?.name ?? "");
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (savingRef.current) return;
    const cleanName = name.trim();
    if (!cleanName) {
      setError("Ingresá el nombre de la categoría.");
      return;
    }
    if (categories.some((item) => item.id !== category?.id && normalizeCatalogName(item.name) === normalizeCatalogName(cleanName))) {
      setError("Ya existe una categoría con este nombre.");
      return;
    }

    savingRef.current = true;
    setSaving(true);
    setError("");
    try {
      await onSubmit({ name: cleanName, isActive }, isEditing);
    } catch (submitError) {
      setError(catalogErrorMessage(submitError, "No se pudo guardar la categoría. Intentá de nuevo."));
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <AdminModal title={isEditing ? "Editar categoría" : "Nueva categoría"} eyebrow="Gestión de categorías" onClose={saving ? () => {} : onClose}>
      <form className="dg-catalog-form" onSubmit={handleSubmit} noValidate>
        <label>
          <span>Nombre de categoría</span>
          <input autoFocus value={name} onChange={(event) => { setName(event.target.value); setError(""); }}
            aria-invalid={Boolean(error)} aria-describedby={error ? "category-name-error" : undefined} placeholder="Ej. Tractores" />
          {error ? <small id="category-name-error" role="alert">{error}</small> : null}
        </label>
        <label>
          <span>Estado</span>
          <select value={isActive ? "active" : "inactive"} onChange={(event) => setIsActive(event.target.value === "active")}>
            <option value="active">Activa</option><option value="inactive">Inactiva</option>
          </select>
        </label>
        <div className="dg-modal__actions">
          <button className="dg-button dg-button--secondary" type="button" onClick={onClose} disabled={saving}>Cancelar</button>
          <button className="dg-button dg-button--primary" type="submit" disabled={saving}>
            {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Guardar categoría"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
};

export default CategoryFormModal;
