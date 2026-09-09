import { useState } from "react";
import { FiImage, FiUploadCloud } from "react-icons/fi";
import AdminModal from "./AdminModal.jsx";

const EMPTY_PRODUCT = {
  name: "",
  brand: "",
  category: "",
  condition: "Nuevo",
  status: "Borrador",
  year: new Date().getFullYear(),
  detail: "",
  images: [],
};

const ProductFormModal = ({ product, options, onClose, onSubmit }) => {
  const [form, setForm] = useState(product ?? EMPTY_PRODUCT);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const isEditing = Boolean(product);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form, isEditing);
  };

  return (
    <AdminModal
      title={isEditing ? "Editar producto" : "Nuevo producto"}
      eyebrow="Vista de demostración"
      onClose={onClose}
      size="large"
    >
      <form className="dg-product-form" onSubmit={handleSubmit}>
        <div className="dg-product-form__notice">
          Esta vista deja preparado el flujo. Los cambios no se guardarán fuera de esta sesión.
        </div>

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
              <span>JPG, PNG o WebP. La carga definitiva se conectará con Firebase Storage.</span>
            </label>

            {selectedFiles.length ? (
              <div className="dg-product-form__selected-images" aria-live="polite">
                <FiImage aria-hidden="true" />
                <span>
                  {selectedFiles.length} {selectedFiles.length === 1 ? "imagen seleccionada" : "imágenes seleccionadas"}
                </span>
              </div>
            ) : product?.images?.length ? (
              <div className="dg-product-form__selected-images">
                <FiImage aria-hidden="true" />
                <span>{product.images.length} imágenes cargadas actualmente</span>
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
            <input
              required
              list="dg-brands"
              value={form.brand}
              onChange={(event) => update("brand", event.target.value)}
              placeholder="Seleccionar marca"
            />
            <datalist id="dg-brands">
              {options.brands.map((brand) => (
                <option key={brand} value={brand} />
              ))}
            </datalist>
          </label>

          <label>
            <span>Categoría</span>
            <input
              required
              list="dg-categories"
              value={form.category}
              onChange={(event) => update("category", event.target.value)}
              placeholder="Seleccionar categoría"
            />
            <datalist id="dg-categories">
              {options.categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
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
          <button className="dg-button dg-button--secondary" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="dg-button dg-button--primary" type="submit">
            {isEditing ? "Aplicar cambios" : "Crear producto"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
};

export default ProductFormModal;
