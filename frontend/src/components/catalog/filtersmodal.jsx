import { useState } from "react";
import "../../styles/catalog/filtersmodal.css";
import CheckboxGroup from "./checkboxgroup";
import {
  CATEGORY_OPTIONS,
  BRAND_OPTIONS,
  POWER_OPTIONS,
  TRACTION_OPTIONS,
  WORK_WIDTH_RANGE,
  HOURS_RANGE,
} from "./filtersdata";

const ACCORDION_SECTIONS = ["categoria", "marca", "horas", "potencia", "traccion", "ancho"];

const FiltersModal = ({ open, filters, onChange, onApply, onReset, onClose }) => {
  const [openSection, setOpenSection] = useState(null);

  if (!open) return null;

  const set = (patch) => onChange({ ...filters, ...patch });
  const toggleCondition = (key) =>
    set({ conditions: { ...filters.conditions, [key]: !filters.conditions[key] } });

  const toggleInList = (field, value) => {
    const current = filters[field];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    set({ [field]: next });
  };

  const toggleSection = (key) => setOpenSection((s) => (s === key ? null : key));

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
              options={CATEGORY_OPTIONS}
              selected={filters.categories}
              onToggle={(v) => toggleInList("categories", v)}
            />
          </AccordionRow>

          <AccordionRow
            title="Marca"
            isOpen={openSection === "marca"}
            onToggle={() => toggleSection("marca")}
          >
            <CheckboxGroup
              options={BRAND_OPTIONS}
              selected={filters.brands}
              onToggle={(v) => toggleInList("brands", v)}
            />
          </AccordionRow>

          <AccordionRow
            title="Horas de uso"
            isOpen={openSection === "horas"}
            onToggle={() => toggleSection("horas")}
          >
            <div className="dg-filtermodal__range-inline">
              <input
                type="number"
                min={HOURS_RANGE.min}
                max={filters.hours[1]}
                step={100}
                value={filters.hours[0]}
                onChange={(e) => set({ hours: [Number(e.target.value), filters.hours[1]] })}
              />
              <span>a</span>
              <input
                type="number"
                min={filters.hours[0]}
                max={HOURS_RANGE.max}
                step={100}
                value={filters.hours[1]}
                onChange={(e) => set({ hours: [filters.hours[0], Number(e.target.value)] })}
              />
              <span>hs</span>
            </div>
          </AccordionRow>

          <AccordionRow
            title="Potencia"
            isOpen={openSection === "potencia"}
            onToggle={() => toggleSection("potencia")}
          >
            <CheckboxGroup
              options={POWER_OPTIONS}
              selected={filters.power}
              onToggle={(v) => toggleInList("power", v)}
            />
          </AccordionRow>

          <AccordionRow
            title="Tracción"
            isOpen={openSection === "traccion"}
            onToggle={() => toggleSection("traccion")}
          >
            <CheckboxGroup
              options={TRACTION_OPTIONS}
              selected={filters.traction}
              onToggle={(v) => toggleInList("traction", v)}
            />
          </AccordionRow>

          <AccordionRow
            title="Ancho de trabajo"
            isOpen={openSection === "ancho"}
            onToggle={() => toggleSection("ancho")}
          >
            <div className="dg-filtermodal__range-inline">
              <input
                type="number"
                min={WORK_WIDTH_RANGE.min}
                max={filters.workWidth[1]}
                step={0.1}
                value={filters.workWidth[0]}
                onChange={(e) =>
                  set({ workWidth: [Number(e.target.value), filters.workWidth[1]] })
                }
              />
              <span>a</span>
              <input
                type="number"
                min={filters.workWidth[0]}
                max={WORK_WIDTH_RANGE.max}
                step={0.1}
                value={filters.workWidth[1]}
                onChange={(e) =>
                  set({ workWidth: [filters.workWidth[0], Number(e.target.value)] })
                }
              />
              <span>m</span>
            </div>
          </AccordionRow>
        </div>

        <div className="dg-filtermodal__footer">
          <button
            type="button"
            className="dg-filtermodal__apply"
            onClick={() => {
              onApply();
              onClose();
            }}
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );
}

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
