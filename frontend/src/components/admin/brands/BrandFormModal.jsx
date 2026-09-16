import { useEffect, useRef, useState } from "react";
import { FiImage, FiUploadCloud } from "react-icons/fi";
import AdminModal from "../AdminModal.jsx";
import { catalogErrorMessage, normalizeCatalogName } from "../../../firebase/catalogShared.js";

const BrandFormModal = ({ brand, brands, onClose, onSubmit }) => {
  const isEditing = Boolean(brand);
  const [name, setName] = useState(brand?.name ?? "");
  const [isActive, setIsActive] = useState(brand?.isActive ?? true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(brand?.image?.url ?? brand?.image ?? "");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const previewUrlRef = useRef(null);

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
  }, []);

  const handleImageChange = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setErrors((current) => ({ ...current, image: "Seleccioná un archivo de imagen válido." }));
      event.target.value = "";
      return;
    }
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = URL.createObjectURL(selected);
    setPreview(previewUrlRef.current);
    setFile(selected);
    setErrors((current) => ({ ...current, image: "", submit: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (savingRef.current) return;
    const cleanName = name.trim();
    const nextErrors = {};
    if (!cleanName) nextErrors.name = "Ingresá el nombre de la marca.";
    if (cleanName && brands.some((item) => item.id !== brand?.id && normalizeCatalogName(item.name) === normalizeCatalogName(cleanName))) {
      nextErrors.name = "Ya existe una marca con este nombre.";
    }
    if (!isEditing && !file) nextErrors.image = "Seleccioná una imagen para la marca.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    savingRef.current = true;
    setSaving(true);
    setErrors({});
    try {
      await onSubmit({ name: cleanName, isActive }, file, isEditing);
    } catch (submitError) {
      setErrors({ submit: catalogErrorMessage(submitError, "No se pudo guardar la marca. Intentá de nuevo.") });
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <AdminModal title={isEditing ? "Editar marca" : "Nueva marca"} eyebrow="Gestión de marcas" onClose={saving ? () => {} : onClose}>
      <form className="dg-catalog-form" onSubmit={handleSubmit} noValidate>
        <div className="dg-brand-image-field">
          <span>Imagen de marca</span>
          <div className="dg-brand-image-field__content">
            <div className="dg-brand-image-field__preview">
              {preview ? <img src={preview} alt={`Vista previa de ${name || "la marca"}`} /> : <FiImage aria-hidden="true" />}
            </div>
            <label className="dg-brand-image-field__upload">
              <input type="file" accept="image/*" onChange={handleImageChange} disabled={saving} />
              <FiUploadCloud aria-hidden="true" />
              <span>{preview ? "Cambiar imagen" : "Seleccionar imagen"}</span>
            </label>
          </div>
          {errors.image ? <small role="alert">{errors.image}</small> : <em>La imagen se guardará en Firebase Storage.</em>}
        </div>

        <label>
          <span>Nombre de marca</span>
          <input value={name} onChange={(event) => { setName(event.target.value); setErrors((current) => ({ ...current, name: "", submit: "" })); }}
            aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "brand-name-error" : undefined} placeholder="Ej. Mainero" />
          {errors.name ? <small id="brand-name-error" role="alert">{errors.name}</small> : null}
        </label>

        <label>
          <span>Estado</span>
          <select value={isActive ? "active" : "inactive"} onChange={(event) => setIsActive(event.target.value === "active")}>
            <option value="active">Activa</option><option value="inactive">Inactiva</option>
          </select>
        </label>

        {errors.submit ? <small className="dg-catalog-form__error" role="alert">{errors.submit}</small> : null}
        <div className="dg-modal__actions">
          <button className="dg-button dg-button--secondary" type="button" onClick={onClose} disabled={saving}>Cancelar</button>
          <button className="dg-button dg-button--primary" type="submit" disabled={saving}>
            {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Guardar marca"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
};

export default BrandFormModal;
