import { useEffect, useRef, useState } from "react";
import { FiImage, FiUploadCloud } from "react-icons/fi";
import AdminModal from "../AdminModal.jsx";

const BrandFormModal = ({ brand, brands, onClose, onSubmit }) => {
  const isEditing = Boolean(brand);
  const [name, setName] = useState(brand?.name ?? "");
  const [isActive, setIsActive] = useState(brand?.isActive ?? true);
  const [preview, setPreview] = useState(brand?.image ?? "");
  const [errors, setErrors] = useState({});
  const generatedUrlRef = useRef(null);
  const submittedRef = useRef(false);

  useEffect(
    () => () => {
      if (generatedUrlRef.current && !submittedRef.current) {
        URL.revokeObjectURL(generatedUrlRef.current);
      }
    },
    [],
  );

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((current) => ({ ...current, image: "Seleccioná un archivo de imagen válido." }));
      event.target.value = "";
      return;
    }

    if (generatedUrlRef.current) URL.revokeObjectURL(generatedUrlRef.current);
    const nextPreview = URL.createObjectURL(file);
    generatedUrlRef.current = nextPreview;
    setPreview(nextPreview);
    setErrors((current) => ({ ...current, image: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanName = name.trim();
    const nextErrors = {};

    if (!cleanName) nextErrors.name = "Ingresá el nombre de la marca.";

    const alreadyExists = brands.some(
      (item) => item.id !== brand?.id && item.name.toLocaleLowerCase("es") === cleanName.toLocaleLowerCase("es"),
    );
    if (cleanName && alreadyExists) nextErrors.name = "Ya existe una marca con este nombre.";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    submittedRef.current = true;
    onSubmit({ name: cleanName, image: preview, isActive }, isEditing);
  };

  return (
    <AdminModal
      title={isEditing ? "Editar marca" : "Nueva marca"}
      eyebrow="Gestión de marcas"
      onClose={onClose}
    >
      <form className="dg-catalog-form" onSubmit={handleSubmit} noValidate>
        <div className="dg-brand-image-field">
          <span>Imagen de marca</span>
          <div className="dg-brand-image-field__content">
            <div className="dg-brand-image-field__preview">
              {preview ? <img src={preview} alt={`Vista previa de ${name || "la marca"}`} /> : <FiImage aria-hidden="true" />}
            </div>
            <label className="dg-brand-image-field__upload">
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <FiUploadCloud aria-hidden="true" />
              <span>{preview ? "Cambiar imagen" : "Seleccionar imagen"}</span>
            </label>
          </div>
          {errors.image ? <small>{errors.image}</small> : <em>La imagen se conserva solo durante esta sesión.</em>}
        </div>

        <label>
          <span>Nombre de marca</span>
          <input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setErrors((current) => ({ ...current, name: "" }));
            }}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "brand-name-error" : undefined}
            placeholder="Ej. Mainero"
          />
          {errors.name ? <small id="brand-name-error">{errors.name}</small> : null}
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
            {isEditing ? "Guardar cambios" : "Guardar marca"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
};

export default BrandFormModal;
