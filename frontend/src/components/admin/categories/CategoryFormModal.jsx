import { useState } from "react";
import AdminModal from "../AdminModal.jsx";

const CategoryFormModal = ({ category, categories, onClose, onSubmit }) => {
  const isEditing = Boolean(category);
  const [name, setName] = useState(category?.name ?? "");
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanName = name.trim();

    if (!cleanName) {
      setError("Ingresá el nombre de la categoría.");
      return;
    }

    const alreadyExists = categories.some(
      (item) => item.id !== category?.id && item.name.toLocaleLowerCase("es") === cleanName.toLocaleLowerCase("es"),
    );

    if (alreadyExists) {
      setError("Ya existe una categoría con este nombre.");
      return;
    }

    onSubmit({ name: cleanName, isActive }, isEditing);
  };

  return (
    <AdminModal
      title={isEditing ? "Editar categoría" : "Nueva categoría"}
      eyebrow="Gestión de categorías"
      onClose={onClose}
    >
      <form className="dg-catalog-form" onSubmit={handleSubmit} noValidate>
        <label>
          <span>Nombre de categoría</span>
          <input
            autoFocus
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError("");
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "category-name-error" : undefined}
            placeholder="Ej. Tractores"
          />
          {error ? <small id="category-name-error">{error}</small> : null}
        </label>

        <label>
          <span>Estado</span>
          <select value={isActive ? "active" : "inactive"} onChange={(event) => setIsActive(event.target.value === "active")}>
            <option value="active">Activa</option>
            <option value="inactive">Inactiva</option>
          </select>
        </label>

        <div className="dg-modal__actions">
          <button className="dg-button dg-button--secondary" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="dg-button dg-button--primary" type="submit">
            {isEditing ? "Guardar cambios" : "Guardar categoría"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
};

export default CategoryFormModal;
