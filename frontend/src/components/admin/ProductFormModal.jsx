
import { useEffect, useRef, useState } from "react";

import {
  FiLoader,
  FiPlus,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";

import AdminModal from "./AdminModal.jsx";

import {
  fetchExtraFieldOptionsByCategory,
} from "../../firebase/products.js";

const STATUSES = ["Publicado", "Pendiente"];

const OTHER_LABEL_OPTION = "__OTHER_LABEL__";
const OTHER_VALUE_OPTION = "__OTHER_VALUE__";

/* =========================================================
   IMÁGENES INICIALES
========================================================= */

const buildInitialImageItems = (product) =>
  (product?.images ?? []).map((url) => ({
    id: crypto.randomUUID(),
    kind: "existing",
    url,
  }));

/* =========================================================
   CAMPOS ADICIONALES INICIALES
========================================================= */

const buildInitialExtraFields = (product) => {
  const fields = [];

  // Compatibilidad con el campo workWidth del formulario anterior.
  if (product?.workWidth) {
    fields.push({
      id: crypto.randomUUID(),
      label: "Ancho de trabajo (m)",
      value: String(product.workWidth),
      labelMode: "existing",
      valueMode: "existing",
    });
  }

  if (product?.extraFields?.length) {
    fields.push(
      ...product.extraFields.map((field) => ({
        id: crypto.randomUUID(),
        label: field.label ?? "",
        value: field.value ?? "",
        labelMode: "existing",
        valueMode: "existing",
      })),
    );
  }

  return fields;
};

/* =========================================================
   FORMULARIO VACÍO
========================================================= */

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

/* =========================================================
   COMPONENTE
========================================================= */

const ProductFormModal = ({
  product,
  options,
  onClose,
  onSubmit,
}) => {
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
      : { ...EMPTY_FORM },
  );

  const [imageItems, setImageItems] = useState(
    () => buildInitialImageItems(product),
  );

  const [extraFields, setExtraFields] = useState(
    () => buildInitialExtraFields(product),
  );

  const [existingOptions, setExistingOptions] = useState({});
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

  const isEditing = Boolean(product);
  const isUsed = form.condition === "Usado";

  const dragIndexRef = useRef(null);
  const previewUrlsRef = useRef(new Set());

  const update = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* =======================================================
     LIBERAR PREVISUALIZACIONES TEMPORALES
  ======================================================= */

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      previewUrlsRef.current.clear();
    };
  }, []);

  /* =======================================================
     CARGAR TÍTULOS Y VALORES EXISTENTES
  ======================================================= */

  useEffect(() => {
    if (!form.category) {
      setExistingOptions({});
      setLoadingOptions(false);
      return;
    }

    let isMounted = true;

    setLoadingOptions(true);

    fetchExtraFieldOptionsByCategory(form.category)
      .then((data) => {
        if (isMounted) {
          setExistingOptions(data);
        }
      })
      .catch((error) => {
        console.error(
          "No se pudieron cargar las características existentes:",
          error,
        );

        if (isMounted) {
          setExistingOptions({});
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoadingOptions(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [form.category]);

  const handleCategoryChange = (value) => {
    update("category", value);

    // Las características seleccionadas pertenecían
    // a la categoría anterior.
    setExtraFields([]);
  };

  /* =======================================================
     SELECCIÓN DE IMÁGENES
  ======================================================= */

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files ?? []);

    const newItems = files.map((file) => {
      const previewUrl = URL.createObjectURL(file);

      previewUrlsRef.current.add(previewUrl);

      return {
        id: crypto.randomUUID(),
        kind: "new",
        file,
        previewUrl,
      };
    });

    setImageItems((current) => [
      ...current,
      ...newItems,
    ]);

    event.target.value = "";
  };

  const removeImageItem = (id) => {
    const item = imageItems.find(
      (image) => image.id === id,
    );

    if (item?.kind === "new" && item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
      previewUrlsRef.current.delete(item.previewUrl);
    }

    setImageItems((current) =>
      current.filter((image) => image.id !== id),
    );
  };

  /* =======================================================
     ORDENAR IMÁGENES
  ======================================================= */

  const handleDragStart = (index) => {
    dragIndexRef.current = index;
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (index) => {
    const fromIndex = dragIndexRef.current;

    if (
      fromIndex === null ||
      fromIndex === index
    ) {
      return;
    }

    setImageItems((current) => {
      const updated = [...current];

      const [moved] = updated.splice(fromIndex, 1);

      updated.splice(index, 0, moved);

      return updated;
    });

    dragIndexRef.current = null;
  };

  /* =======================================================
     CAMPOS ADICIONALES
  ======================================================= */

  const addExtraField = () => {
    setExtraFields((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        label: "",
        value: "",
        labelMode: "select",
        valueMode: "select",
      },
    ]);
  };

  const patchExtraField = (id, patch) => {
    setExtraFields((current) =>
      current.map((field) =>
        field.id === id
          ? { ...field, ...patch }
          : field,
      ),
    );
  };

  const handleLabelSelectChange = (
    id,
    selectValue,
  ) => {
    if (selectValue === OTHER_LABEL_OPTION) {
      patchExtraField(id, {
        labelMode: "custom",
        label: "",
        value: "",
        valueMode: "select",
      });
    } else {
      patchExtraField(id, {
        labelMode: "existing",
        label: selectValue,
        value: "",
        valueMode: "select",
      });
    }
  };

  const handleValueSelectChange = (
    id,
    selectValue,
  ) => {
    if (selectValue === OTHER_VALUE_OPTION) {
      patchExtraField(id, {
        valueMode: "custom",
        value: "",
      });
    } else {
      patchExtraField(id, {
        valueMode: "existing",
        value: selectValue,
      });
    }
  };

  const removeExtraField = (id) => {
    setExtraFields((current) =>
      current.filter((field) => field.id !== id),
    );
  };

  /* =======================================================
     PROGRESO DE SUBIDA
  ======================================================= */

  const handleUploadProgress = (progress) => {
    setUploadProgress(progress);
  };

  /* =======================================================
     GUARDAR
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setUploadProgress(null);

    try {
      const payload = {
        name: form.name,
        brand: form.brand,
        category: form.category,
        condition: form.condition,
        status: form.status,
        year: form.year,

        detail: form.detail
          .split(/\n\s*\n/)
          .map((paragraph) => paragraph.trim())
          .filter(Boolean),

        featured: Boolean(form.featured),

        hoursValue: isUsed
          ? form.hoursValue
          : null,

        hoursTag: isUsed
          ? form.hoursTag
          : "NUEVO",

        extraFields: extraFields
          .filter(
            (field) =>
              field.label.trim() &&
              field.value.trim(),
          )
          .map((field) => ({
            label: field.label.trim().toUpperCase(),
            value: field.value.trim().toUpperCase(),
          })),
      };

      await onSubmit(
        payload,
        imageItems,
        isEditing,
        handleUploadProgress,
      );
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  };

  const existingLabels = Object.keys(existingOptions);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <AdminModal
      title={isEditing ? "Editar producto" : "Nuevo producto"}
      onClose={onClose}
      size="large"
      closeDisabled={saving}
    >
      <form
        className="dg-product-form"
        onSubmit={handleSubmit}
      >
        <fieldset
          className="dg-product-form__fieldset"
          disabled={saving}
        >
          <div className="dg-product-form__grid">
            {/* ---------------------------------------------
                IMÁGENES
            --------------------------------------------- */}

            <div className="dg-product-form__field is-wide">
              <span className="dg-product-form__label">
                Imágenes de la máquina
              </span>

              <label className="dg-product-form__upload">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                />

                <FiUploadCloud aria-hidden="true" />

                <strong>
                  Seleccionar varias imágenes
                </strong>

                <span>
                  JPG, PNG o WebP. Arrastrá las miniaturas
                  para cambiar el orden.
                </span>
              </label>

              {imageItems.length ? (
                <div className="dg-product-form__image-strip">
                  {imageItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="dg-product-form__image-thumb"
                      draggable
                      onDragStart={() =>
                        handleDragStart(index)
                      }
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index)}
                    >
                      <img
                        src={
                          item.kind === "existing"
                            ? item.url
                            : item.previewUrl
                        }
                        alt=""
                      />

                      <button
                        type="button"
                        aria-label="Quitar imagen"
                        onClick={() =>
                          removeImageItem(item.id)
                        }
                      >
                        <FiX aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              {saving && uploadProgress !== null ? (
                <div
                  className="dg-product-form__progress"
                  aria-live="polite"
                >
                  <div className="dg-product-form__progress-heading">
                    <span>
                      {uploadProgress >= 100
                        ? "Imágenes subidas"
                        : "Subiendo imágenes"}
                    </span>

                    <strong>{uploadProgress}%</strong>
                  </div>

                  <div
                    className="dg-product-form__progress-track"
                    role="progressbar"
                    aria-label="Progreso de subida de imágenes"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={uploadProgress}
                  >
                    <span
                      style={{
                        width: `${uploadProgress}%`,
                      }}
                    />
                  </div>

                  <p>
                    {uploadProgress >= 100
                      ? "Finalizando el guardado del producto..."
                      : "No cierres esta ventana mientras se suben las imágenes."}
                  </p>
                </div>
              ) : null}
            </div>

            {/* ---------------------------------------------
                NOMBRE
            --------------------------------------------- */}

            <label className="is-wide">
              <span>Modelo o nombre</span>

              <input
                required
                value={form.name}
                onChange={(event) =>
                  update("name", event.target.value)
                }
              />
            </label>

            {/* ---------------------------------------------
                MARCA
            --------------------------------------------- */}

            <label>
              <span>Marca</span>

              <select
                required
                value={form.brand}
                onChange={(event) =>
                  update("brand", event.target.value)
                }
              >
                <option value="">
                  Seleccionar marca
                </option>

                {options.brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </label>

            {/* ---------------------------------------------
                CATEGORÍA
            --------------------------------------------- */}

            <label>
              <span>Categoría</span>

              <select
                required
                value={form.category}
                onChange={(event) =>
                  handleCategoryChange(event.target.value)
                }
              >
                <option value="">
                  Seleccionar categoría
                </option>

                {options.categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </label>

            {/* ---------------------------------------------
                CONDICIÓN
            --------------------------------------------- */}

            <label>
              <span>Condición</span>

              <select
                value={form.condition}
                onChange={(event) =>
                  update("condition", event.target.value)
                }
              >
                <option>Nuevo</option>
                <option>Usado</option>
              </select>
            </label>

            {/* ---------------------------------------------
                ESTADO
            --------------------------------------------- */}

            <label>
              <span>Estado</span>

              <select
                value={form.status}
                onChange={(event) =>
                  update("status", event.target.value)
                }
              >
                {STATUSES.map((status) => (
                  <option key={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            {/* ---------------------------------------------
                AÑO
            --------------------------------------------- */}

            <label>
              <span>Año</span>

              <input
                type="number"
                min="1950"
                max="2100"
                value={form.year}
                onChange={(event) =>
                  update("year", event.target.value)
                }
              />
            </label>

            {/* ---------------------------------------------
                HORAS DE USO
            --------------------------------------------- */}

            {isUsed ? (
              <>
                <label>
                  <span>Horas de uso (valor)</span>

                  <input
                    type="number"
                    value={form.hoursValue}
                    onChange={(event) =>
                      update(
                        "hoursValue",
                        event.target.value,
                      )
                    }
                    placeholder="Ej. 2400"
                  />
                </label>

                <label>
                  <span>Horas de uso (etiqueta)</span>

                  <input
                    value={form.hoursTag}
                    onChange={(event) =>
                      update(
                        "hoursTag",
                        event.target.value,
                      )
                    }
                    placeholder="Ej. Buen estado"
                  />
                </label>
              </>
            ) : null}

            {/* ---------------------------------------------
                DESTACADO
            --------------------------------------------- */}

            <label className="dg-product-form__featured is-wide">
              <input
                type="checkbox"
                checked={Boolean(form.featured)}
                onChange={(event) =>
                  update("featured", event.target.checked)
                }
              />

              <span className="dg-product-form__featured-copy">
                <strong>Destacar producto</strong>

                <small>
                  Activá esta opción para resaltarlo en el
                  catálogo.
                </small>
              </span>
            </label>

            {/* ---------------------------------------------
                DESCRIPCIÓN
            --------------------------------------------- */}

            <label className="is-wide">
              <span>Descripción breve</span>

              <textarea
                rows="3"
                value={form.detail}
                onChange={(event) =>
                  update("detail", event.target.value)
                }
                placeholder="Características principales de la máquina"
              />
            </label>

            {/* ---------------------------------------------
                CAMPOS ADICIONALES
            --------------------------------------------- */}

            <div className="dg-product-form__field is-wide">
              <span className="dg-product-form__label">
                Campos adicionales
              </span>

              {!form.category ? (
                <p className="dg-product-form__extra-hint">
                  Elegí una categoría para poder agregar
                  características.
                </p>
              ) : (
                <>
                  {loadingOptions ? (
                    <p className="dg-product-form__extra-hint">
                      Cargando características existentes...
                    </p>
                  ) : null}

                  {extraFields.length ? (
                    <div className="dg-product-form__extra-fields">
                      {extraFields.map((field) => {
                        const valueOptions =
                          existingOptions[field.label] ?? [];

                        return (
                          <div
                            key={field.id}
                            className="dg-product-form__extra-field-row"
                          >
                            {/* TÍTULO */}

                            {field.labelMode === "custom" ? (
                              <input
                                value={field.label}
                                onChange={(event) =>
                                  patchExtraField(
                                    field.id,
                                    {
                                      label: event.target.value,
                                    },
                                  )
                                }
                                placeholder="Nuevo título (ej. Color)"
                                autoFocus
                              />
                            ) : (
                              <select
                                value={
                                  existingLabels.includes(
                                    field.label,
                                  )
                                    ? field.label
                                    : ""
                                }
                                onChange={(event) =>
                                  handleLabelSelectChange(
                                    field.id,
                                    event.target.value,
                                  )
                                }
                              >
                                <option value="" disabled>
                                  Seleccionar título
                                </option>

                                {existingLabels.map((label) => (
                                  <option
                                    key={label}
                                    value={label}
                                  >
                                    {label}
                                  </option>
                                ))}

                                <option value={OTHER_LABEL_OPTION}>
                                  Otro (especificar)
                                </option>
                              </select>
                            )}

                            {/* VALOR */}

                            {field.valueMode === "custom" ||
                            field.labelMode === "custom" ? (
                              <input
                                value={field.value}
                                onChange={(event) =>
                                  patchExtraField(
                                    field.id,
                                    {
                                      value: event.target.value,
                                    },
                                  )
                                }
                                placeholder="Valor (ej. Verde)"
                              />
                            ) : (
                              <select
                                value={
                                  valueOptions.includes(
                                    field.value,
                                  )
                                    ? field.value
                                    : ""
                                }
                                onChange={(event) =>
                                  handleValueSelectChange(
                                    field.id,
                                    event.target.value,
                                  )
                                }
                                disabled={!field.label}
                              >
                                <option value="" disabled>
                                  Seleccionar valor
                                </option>

                                {valueOptions.map((value) => (
                                  <option
                                    key={value}
                                    value={value}
                                  >
                                    {value}
                                  </option>
                                ))}

                                <option value={OTHER_VALUE_OPTION}>
                                  Otro valor
                                </option>
                              </select>
                            )}

                            <button
                              type="button"
                              aria-label="Quitar campo"
                              onClick={() =>
                                removeExtraField(field.id)
                              }
                            >
                              <FiX aria-hidden="true" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}

                  <button
                    type="button"
                    className="dg-product-form__add-field"
                    onClick={addExtraField}
                  >
                    <FiPlus aria-hidden="true" />
                    Agregar característica
                  </button>
                </>
              )}
            </div>
          </div>
        </fieldset>

        {/* -----------------------------------------------
            ACCIONES
        ----------------------------------------------- */}

        <div className="dg-modal__actions">
          <button
            className="dg-button dg-button--secondary"
            type="button"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>

          <button
            className="dg-button dg-button--primary"
            type="submit"
            disabled={saving}
          >
            {saving ? (
              <>
                <FiLoader className="dg-product-row__loading-icon" />

                {uploadProgress !== null
                  ? uploadProgress >= 100
                    ? "Finalizando..."
                    : `Subiendo imágenes ${uploadProgress}%`
                  : "Guardando..."}
              </>
            ) : isEditing ? (
              "Aplicar cambios"
            ) : (
              "Crear producto"
            )}
          </button>
        </div>
      </form>
    </AdminModal>
  );
};

export default ProductFormModal;
