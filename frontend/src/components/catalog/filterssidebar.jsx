import "../../styles/catalog/filterssidebar.css";
import CheckboxGroup from "./checkboxgroup";
import {
  CATEGORY_OPTIONS,
  BRAND_OPTIONS,
  POWER_OPTIONS,
  TRACTION_OPTIONS,
  WORK_WIDTH_RANGE,
  HOURS_RANGE,
} from "./filtersdata";

export default function FiltersSidebar({ filters, onChange, onApply, onReset }) {
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

  return (
    <aside className="dg-sidebar">
      <div className="dg-sidebar__header">
        <h3>Filtros</h3>
        <button type="button" className="dg-sidebar__reset" onClick={onReset}>
          Limpiar filtros
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />
          </svg>
        </button>
      </div>

      <div className="dg-sidebar__field">
        <label>Categoría</label>
        <CheckboxGroup
          options={CATEGORY_OPTIONS}
          selected={filters.categories}
          onToggle={(v) => toggleInList("categories", v)}
        />
      </div>

      <div className="dg-sidebar__field">
        <label>Marca</label>
        <CheckboxGroup
          options={BRAND_OPTIONS}
          selected={filters.brands}
          onToggle={(v) => toggleInList("brands", v)}
        />
      </div>

      <div className="dg-sidebar__field">
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

      <div className="dg-sidebar__field">
        <label>Horas de uso</label>
        <DualRange
          min={HOURS_RANGE.min}
          max={HOURS_RANGE.max}
          step={100}
          value={filters.hours}
          onChange={(hours) => set({ hours })}
          unit="hs"
        />
      </div>

      <div className="dg-sidebar__field">
        <label>Potencia</label>
        <CheckboxGroup
          options={POWER_OPTIONS}
          selected={filters.power}
          onToggle={(v) => toggleInList("power", v)}
        />
      </div>

      <div className="dg-sidebar__field">
        <label>Tracción</label>
        <CheckboxGroup
          options={TRACTION_OPTIONS}
          selected={filters.traction}
          onToggle={(v) => toggleInList("traction", v)}
        />
      </div>

      <div className="dg-sidebar__field">
        <label>Ancho de trabajo</label>
        <DualRange
          min={WORK_WIDTH_RANGE.min}
          max={WORK_WIDTH_RANGE.max}
          step={0.1}
          value={filters.workWidth}
          onChange={(workWidth) => set({ workWidth })}
          unit="m"
        />
      </div>

      <button type="button" className="dg-sidebar__apply" onClick={onApply}>
        Aplicar filtros
      </button>
    </aside>
  );
}

function DualRange({ min, max, step = 1, value, onChange, unit = "" }) {
  const [low, high] = value;
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  const handleLow = (e) => {
    const next = Math.min(Number(e.target.value), high - step);
    onChange([next, high]);
  };

  const handleHigh = (e) => {
    const next = Math.max(Number(e.target.value), low + step);
    onChange([low, next]);
  };

  const handleLowInput = (e) => {
    const raw = Number(e.target.value);
    if (Number.isNaN(raw)) return;
    onChange([clamp(raw, min, high - step), high]);
  };

  const handleHighInput = (e) => {
    const raw = Number(e.target.value);
    if (Number.isNaN(raw)) return;
    onChange([low, clamp(raw, low + step, max)]);
  };

  const pctLow = ((low - min) / (max - min)) * 100;
  const pctHigh = ((high - min) / (max - min)) * 100;

  return (
    <div className="dg-dualrange">
      <div className="dg-dualrange__track">
        <div
          className="dg-dualrange__fill"
          style={{ left: `${pctLow}%`, width: `${pctHigh - pctLow}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={low}
        onChange={handleLow}
        className="dg-dualrange__input"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={high}
        onChange={handleHigh}
        className="dg-dualrange__input"
      />

      <div className="dg-dualrange__inputs">
        <div className="dg-dualrange__inputbox">
          <input
            type="number"
            min={min}
            max={high - step}
            step={step}
            value={low}
            onChange={handleLowInput}
          />
          {unit && <span>{unit}</span>}
        </div>
        <span className="dg-dualrange__sep">—</span>
        <div className="dg-dualrange__inputbox">
          <input
            type="number"
            min={low + step}
            max={max}
            step={step}
            value={high}
            onChange={handleHighInput}
          />
          {unit && <span>{unit}</span>}
        </div>
      </div>
    </div>
  );
}