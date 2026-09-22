import { useState } from "react";
import { FiPlus, FiUploadCloud, FiX } from "react-icons/fi";
import AdminModal from "./AdminModal.jsx";

const STATUSES = ["Publicado", "Pendiente"];

const buildInitialImageItems = (product) =>
  (product?.images ?? []).map((url) => ({
    id: crypto.randomUUID(),
    kind: "existing",
    url,
  }));

const buildInitialExtraFields = (product) => {
  const fields = [];

  // Migración suave: si el producto tenía "workWidth" del formulario viejo,
  // lo mostramos como un campo adicional más para no perder el dato.
  if (product?.workWidth) {
    fields.push({
      id: crypto.randomUUID(),
      label: "Ancho de trabajo (m)",
      value: String(product.workWidth),
    });
  }

  if (product?.extraFields?.length) {
    fields.push(
      ...product.extraFields.map((field) => ({
        id: crypto.randomUUID(),
        label: field.label ?? "",
        value: field.value ?? "",
      })),
    );
  }

  return fields;
};

const EMPTY_FORM = {
  name: "",
  brand: "",
  category: "",
  condition: "Nuevo",
  status: "Publicado",
  year: new Date().getFullYear(),
  detail: "",
  hoursTag: "",
  hoursValue: "",
  featured: false,
};

const ProductFormModal = ({ product, options, onClose, onSubmit }) => {
  const [form, setForm] = useState(
    product
      ? {
          name: product.name ?? "",
          brand: product.brand ?? "",
          category: product.category ?? "",
          condition: product.condition ?? "Nuevo",
          status: product.status ?? "Publicado",
          year: product.year ?? new Date().getFullYear(),
          detail: product.detail ?? "",
          hoursTag: product.hoursTag ?? "",
          hoursValue: product.hoursValue ?? "",
          featured: Boolean(product.featured),
        }
      : EMPTY_FORM,
  );
  const [imageItems, setImageItems] = useState(() => buildInitialImageItems(product));
  const [extraFields, setExtraFields] = useState(() => buildInitialExtraFields(product));
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(product);
  const isUsed = form.condition === "Usado";

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  /* ---------- Imágenes ---------- */

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files ?? []);
    const newItems = files.map((file) => ({
      id: crypto.randomUUID(),
      kind: "new",
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImageItems((current) => [...current, ...newItems]);
    event.target.value = "";
  };

  const removeImageItem = (id) => {
    setImageItems((current) => {
      const item = current.find((i) => i.id === id);
      if (item?.kind === "new" && item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return current.filter((i) => i.id !== id);
    });
  };

  const dragIndexRef = useState({ current: null })[0];

  const handleDragStart = (index) => {
    dragIndexRef.current = index;
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (index) => {
    const fromIndex = dragIndexRef.current;
    if (fromIndex === null || fromIndex === index) return;
    setImageItems((current) => {
      const updated = [...current];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(index, 0, moved);
      return updated;
    });
    dragIndexRef.current = null;
  };

  /* ---------- Campos adicionales ---------- */

  const addExtraField = () => {
    setExtraFields((current) => [...current, { id: crypto.randomUUID(), label: "", value: "" }]);
  };

  const updateExtraField = (id, key, value) => {
    setExtraFields((current) => current.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  };

  const removeExtraField = (id) => {
    setExtraFields((current) => current.filter((f) => f.id !== id));
  };

  /* ---------- Submit ---------- */

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: form.name,
        brand: form.brand,
        category: form.category,
        condition: form.condition,
        status: form.status,
        year: form.year,
        detail: form.detail,
        featured: Boolean(form.featured),
        hoursValue: isUsed ? form.hoursValue : null,
        hoursTag: isUsed ? form.hoursTag : "NUEVO",
        extraFields: extraFields
          .filter((field) => field.label.trim() && field.value.trim())
          .map((field) => ({
            label: field.label.trim().toUpperCase(),
            value: field.value.trim().toUpperCase(),
          })),
      };

      await onSubmit(payload, imageItems, isEditing);
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
          {/* ---------- Imágenes ---------- */}
          <div className="dg-product-form__field is-wide">
            <span className="dg-product-form__label">Imágenes de la máquina</span>
            <label className="dg-product-form__upload">
              <input type="file" accept="image/*" multiple onChange={handleFileSelect} />
              <FiUploadCloud aria-hidden="true" />
              <strong>Seleccionar varias imágenes</strong>
              <span>JPG, PNG o WebP. Arrastrá las miniaturas para cambiar el orden.</span>
            </label>

            {imageItems.length ? (
              <div className="dg-product-form__image-strip">
                {imageItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="dg-product-form__image-thumb"
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                  >
                    <img src={item.kind === "existing" ? item.url : item.previewUrl} alt="" />
                    <button
                      type="button"
                      aria-label="Quitar imagen"
                      onClick={() => removeImageItem(item.id)}
                    >
                      <FiX aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* ---------- Campos obligatorios ---------- */}
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
            <select
              required
              value={form.category}
              onChange={(event) => update("category", event.target.value)}
            >
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
              {STATUSES.map((status) => (
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

          {isUsed ? (
            <>
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
            </>
          ) : null}

          <label className="dg-product-form__featured is-wide">
            <input
              type="checkbox"
              checked={Boolean(form.featured)}
              onChange={(event) => update("featured", event.target.checked)}
            />
            <span className="dg-product-form__featured-copy">
              <strong>Destacar producto</strong>
              <small>Activá esta opción para resaltarlo en el catálogo.</small>
            </span>
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

          {/* ---------- Campos adicionales ---------- */}
          <div className="dg-product-form__field is-wide">
            <span className="dg-product-form__label">Campos adicionales</span>

            {extraFields.length ? (
              <div className="dg-product-form__extra-fields">
                {extraFields.map((field) => (
                  <div key={field.id} className="dg-product-form__extra-field-row">
                    <input
                      value={field.label}
                      onChange={(event) => updateExtraField(field.id, "label", event.target.value)}
                      placeholder="Título (ej. Color)"
                    />
                    <input
                      value={field.value}
                      onChange={(event) => updateExtraField(field.id, "value", event.target.value)}
                      placeholder="Valor (ej. Verde)"
                    />
                    <button
                      type="button"
                      aria-label="Quitar campo"
                      onClick={() => removeExtraField(field.id)}
                    >
                      <FiX aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            <button type="button" className="dg-product-form__add-field" onClick={addExtraField}>
              <FiPlus aria-hidden="true" /> Agregar característica
            </button>
          </div>
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