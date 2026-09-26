import "../../styles/catalog/filterssidebar.css";
import CheckboxGroup from "./checkboxgroup";

const FiltersSidebar = ({
  filters,
  onChange,
  onReset,
  categories,
  brands,
  extraFieldOptions,
  availableHourPresets,
}) => {
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
    // Al cambiar de categoría, los filtros dinámicos y de horas dejan de tener sentido
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

  const showHours = filters.conditions.usado && availableHourPresets.length > 0;
  const extraLabels = Object.keys(extraFieldOptions);

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
          options={categories.map((c) => c.name)}
          selected={filters.category ? [filters.category] : []}
          onToggle={selectCategory}
        />
      </div>

      <div className="dg-sidebar__field">
        <label>Marca</label>
        <CheckboxGroup
          options={brands.map((b) => b.name)}
          selected={filters.brands}
          onToggle={toggleBrand}
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

      {showHours ? (
        <div className="dg-sidebar__field">
          <label>Horas de uso</label>
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
        </div>
      ) : null}

      {filters.category && extraLabels.length ? (
        <>
          {extraLabels.map((label) => (
            <div className="dg-sidebar__field" key={label}>
              <label>{label}</label>
              <CheckboxGroup
                options={extraFieldOptions[label]}
                selected={filters.extra[label] ?? []}
                onToggle={(value) => toggleExtraValue(label, value)}
              />
            </div>
          ))}
        </>
      ) : null}

      {!filters.category ? (
        <p className="dg-sidebar__hint">Elegí una categoría para ver más filtros específicos.</p>
      ) : null}
    </aside>
  );
};

export default FiltersSidebar;