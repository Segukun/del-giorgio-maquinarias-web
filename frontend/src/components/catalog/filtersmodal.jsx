import { useState } from "react";
import "../../styles/catalog/filtersmodal.css";
import CheckboxGroup from "./checkboxgroup";

const FiltersModal = ({
  open,
  filters,
  onChange,
  onReset,
  onClose,
  categories,
  brands,
  extraFieldOptions,
  availableHourPresets,
  resultCount,
}) => {
  const [openSection, setOpenSection] = useState(null);

  if (!open) return null;

  const set = (patch) => onChange({ ...filters, ...patch });
  const toggleCondition = (key) =>
    set({ conditions: { ...filters.conditions, [key]: !filters.conditions[key] } });

  const toggleBrand = (value) => {
    const next = filters.brands.includes(value)
      ? filters.brands.filter((v) => v !== value)
      : [...filters.brands, value];
    set({ brands: next });
  };

  const selectCategory = (value) => {
    set({ category: filters.category === value ? "" : value, hours: [], extra: {} });
  };

  const toggleHours = (key) => {
    const next = filters.hours.includes(key)
      ? filters.hours.filter((v) => v !== key)
      : [...filters.hours, key];
    set({ hours: next });
  };

  const toggleExtraValue = (label, value) => {
    const current = filters.extra[label] ?? [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    set({ extra: { ...filters.extra, [label]: next } });
  };

  const toggleSection = (key) => setOpenSection((s) => (s === key ? null : key));
  const showHours = filters.conditions.usado && availableHourPresets.length > 0;
  const extraLabels = Object.keys(extraFieldOptions);

  return (
    <div className="dg-filtermodal">
      <button className="dg-filtermodal__backdrop" aria-label="Cerrar filtros" onClick={onClose} />

      <div className="dg-filtermodal__sheet">
        <div className="dg-filtermodal__handle" />

        <div className="dg-filtermodal__header">
          <h3>Filtros</h3>
          <button type="button" className="dg-filtermodal__clear" onClick={onReset}>
            Limpiar
          </button>
        </div>

        <div className="dg-filtermodal__body">
          <div className="dg-filtermodal__field">
            <label>Condición</label>
            <div className="dg-sidebar__checkboxes">
              <label className="dg-checkbox">
                <input
                  type="checkbox"
                  checked={filters.conditions.nuevo}
                  onChange={() => toggleCondition("nuevo")}
                />
                Nuevos
              </label>
              <label className="dg-checkbox">
                <input
                  type="checkbox"
                  checked={filters.conditions.usado}
                  onChange={() => toggleCondition("usado")}
                />
                Usados
              </label>
            </div>
          </div>

          <AccordionRow
            title="Categoría"
            isOpen={openSection === "categoria"}
            onToggle={() => toggleSection("categoria")}
          >
            <CheckboxGroup
              options={categories.map((c) => c.name)}
              selected={filters.category ? [filters.category] : []}
              onToggle={selectCategory}
            />
          </AccordionRow>

          <AccordionRow
            title="Marca"
            isOpen={openSection === "marca"}
            onToggle={() => toggleSection("marca")}
          >
            <CheckboxGroup
              options={brands.map((b) => b.name)}
              selected={filters.brands}
              onToggle={toggleBrand}
            />
          </AccordionRow>

          {showHours ? (
            <AccordionRow
              title="Horas de uso"
              isOpen={openSection === "horas"}
              onToggle={() => toggleSection("horas")}
            >
              <CheckboxGroup
                options={availableHourPresets.map((p) => p.label)}
                selected={filters.hours
                  .map((key) => availableHourPresets.find((p) => p.key === key)?.label)
                  .filter(Boolean)}
                onToggle={(label) => {
                  const preset = availableHourPresets.find((p) => p.label === label);
                  if (preset) toggleHours(preset.key);
                }}
              />
            </AccordionRow>
          ) : null}

          {filters.category
            ? extraLabels.map((label) => (
                <AccordionRow
                  key={label}
                  title={label}
                  isOpen={openSection === label}
                  onToggle={() => toggleSection(label)}
                >
                  <CheckboxGroup
                    options={extraFieldOptions[label]}
                    selected={filters.extra[label] ?? []}
                    onToggle={(value) => toggleExtraValue(label, value)}
                  />
                </AccordionRow>
              ))
            : null}

          {!filters.category ? (
            <p className="dg-sidebar__hint">Elegí una categoría para ver más filtros específicos.</p>
          ) : null}
        </div>

        <div className="dg-filtermodal__footer">
          <button type="button" className="dg-filtermodal__apply" onClick={onClose}>
            Ver {resultCount} resultados
          </button>
        </div>
      </div>
    </div>
  );
};

function AccordionRow({ title, isOpen, onToggle, children }) {
  return (
    <div className={`dg-accordion ${isOpen ? "is-open" : ""}`}>
      <button type="button" className="dg-accordion__trigger" onClick={onToggle}>
        {title}
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="dg-accordion__chevron"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
      <div className="dg-accordion__content">
        <div className="dg-accordion__inner">{children}</div>
      </div>
    </div>
  );
}

export default FiltersModal;