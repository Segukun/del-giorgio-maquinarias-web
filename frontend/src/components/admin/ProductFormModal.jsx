import { useState } from "react";
import { FiImage, FiUploadCloud, FiX } from "react-icons/fi";
import AdminModal from "./AdminModal.jsx";

const EMPTY_PRODUCT = {
  name: "",
  brand: "",
  category: "",
  condition: "Nuevo",
  status: "Borrador",
  year: new Date().getFullYear(),
  detail: "",
  workWidth: "",
  hoursTag: "",
  hoursValue: "",
  featured: false,
  images: [],
};

const ProductFormModal = ({ product, options, onClose, onSubmit }) => {
  const [form, setForm] = useState(product ?? EMPTY_PRODUCT);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(product?.images ?? []);
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(product);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const removeExistingImage = (url) => {
    setExistingImages((current) => current.filter((image) => image !== url));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ ...form, images: existingImages }, selectedFiles, isEditing);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminModal
      title={isEditing ? "Editar producto" : "Nuevo producto"}
      onClose={onClose}
      size="large"
    >
      <form className="dg-product-form" onSubmit={handleSubmit}>
        <div className="dg-product-form__grid">
          <div className="dg-product-form__field is-wide">
            <span className="dg-product-form__label">Imágenes de la máquina</span>
            <label className="dg-product-form__upload">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => setSelectedFiles(Array.from(event.target.files ?? []))}
              />
              <FiUploadCloud aria-hidden="true" />
              <strong>Seleccionar varias imágenes</strong>
              <span>JPG, PNG o WebP.</span>
            </label>

            {selectedFiles.length ? (
              <div className="dg-product-form__selected-images" aria-live="polite">
                <FiImage aria-hidden="true" />
                <span>
                  {selectedFiles.length} {selectedFiles.length === 1 ? "imagen nueva seleccionada" : "imágenes nuevas seleccionadas"}
                </span>
              </div>
            ) : null}

            {existingImages.length ? (
              <div className="dg-product-form__existing-images">
                {existingImages.map((url) => (
                  <div key={url} className="dg-product-form__existing-image">
                    <img src={url} alt="" />
                    <button
                      type="button"
                      aria-label="Quitar imagen"
                      onClick={() => removeExistingImage(url)}
                    >
                      <FiX aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <label className="is-wide">
            <span>Modelo o nombre</span>
            <input
              required
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="Ej. John Deere 6155J"
            />
          </label>

          <label>
            <span>Marca</span>
            <select required value={form.brand} onChange={(event) => update("brand", event.target.value)}>
              <option value="">Seleccionar marca</option>
              {options.brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Categoría</span>
            <select required value={form.category} onChange={(event) => update("category", event.target.value)}>
              <option value="">Seleccionar categoría</option>
              {options.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Condición</span>
            <select value={form.condition} onChange={(event) => update("condition", event.target.value)}>
              <option>Nuevo</option>
              <option>Usado</option>
            </select>
          </label>

          <label>
            <span>Estado</span>
            <select value={form.status} onChange={(event) => update("status", event.target.value)}>
              {options.statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Año</span>
            <input
              type="number"
              min="1950"
              max="2100"
              value={form.year}
              onChange={(event) => update("year", event.target.value)}
            />
          </label>

          <label>
            <span>Ancho de trabajo (m)</span>
            <input
              type="number"
              step="0.1"
              value={form.workWidth}
              onChange={(event) => update("workWidth", event.target.value)}
              placeholder="Ej. 6.5"
            />
          </label>

          <label>
            <span>Horas de uso (valor)</span>
            <input
              type="number"
              value={form.hoursValue}
              onChange={(event) => update("hoursValue", event.target.value)}
              placeholder="Ej. 2400"
            />
          </label>

          <label>
            <span>Horas de uso (etiqueta)</span>
            <input
              value={form.hoursTag}
              onChange={(event) => update("hoursTag", event.target.value)}
              placeholder="Ej. Buen estado"
            />
          </label>

          <label className="dg-product-form__checkbox">
            <input
              type="checkbox"
              checked={Boolean(form.featured)}
              onChange={(event) => update("featured", event.target.checked)}
            />
            <span>Destacar producto</span>
          </label>

          <label className="is-wide">
            <span>Descripción breve</span>
            <textarea
              rows="3"
              value={form.detail}
              onChange={(event) => update("detail", event.target.value)}
              placeholder="Características principales de la máquina"
            />
          </label>
        </div>

        <div className="dg-modal__actions">
          <button className="dg-button dg-button--secondary" type="button" onClick={onClose} disabled={saving}>
            Cancelar
          </button>
          <button className="dg-button dg-button--primary" type="submit" disabled={saving}>
            {saving ? "Guardando..." : isEditing ? "Aplicar cambios" : "Crear producto"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
};

export default ProductFormModal;