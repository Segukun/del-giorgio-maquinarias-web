export const normalize = (value = "") =>
  value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const HOURS_PRESETS = [
  { key: "0-1500", label: "0 a 1.500 hs", min: 0, max: 1500 },
  { key: "1500-4000", label: "1.500 a 4.000 hs", min: 1500, max: 4000 },
  { key: "4000-8000", label: "4.000 a 8.000 hs", min: 4000, max: 8000 },
  { key: "8000-Infinity", label: "Más de 8.000 hs", min: 8000, max: Infinity },
];

export const EMPTY_FILTERS = {
  q: "",
  label: "", // solo para mostrar en el toolbar, nunca filtra productos
  category: "",
  brands: [],
  conditions: { nuevo: true, usado: true },
  hours: [], // keys de HOURS_PRESETS seleccionados
  extra: {}, // { LABEL: [valores seleccionados] }
};

/**
 * Convierte los searchParams de la URL en un objeto de filtros.
 */
export const parseFiltersFromParams = (searchParams) => {
  const q = searchParams.get("q") ?? "";
  const label = searchParams.get("label") ?? "";
  const category = searchParams.get("categoria") ?? "";
  const brands = (searchParams.get("marca") ?? "").split(",").filter(Boolean);
  const condicion = searchParams.get("condicion");
  const conditions =
    condicion === "nuevo"
      ? { nuevo: true, usado: false }
      : condicion === "usado"
        ? { nuevo: false, usado: true }
        : { nuevo: true, usado: true };
  const hours = (searchParams.get("horas") ?? "").split(",").filter(Boolean);

  let extra = {};
  const extraRaw = searchParams.get("extra");
  if (extraRaw) {
    try {
      extra = JSON.parse(decodeURIComponent(extraRaw));
    } catch {
      extra = {};
    }
  }

  return { q, label, category, brands, conditions, hours, extra };
};

/**
 * Convierte un objeto de filtros de vuelta a searchParams para la URL.
 */
export const filtersToSearchParams = (filters) => {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.label) params.set("label", filters.label);
  if (filters.category) params.set("categoria", filters.category);
  if (filters.brands.length) params.set("marca", filters.brands.join(","));

  if (filters.conditions.nuevo && !filters.conditions.usado) params.set("condicion", "nuevo");
  else if (!filters.conditions.nuevo && filters.conditions.usado) params.set("condicion", "usado");

  if (filters.hours.length) params.set("horas", filters.hours.join(","));
  if (Object.keys(filters.extra).length) {
    params.set("extra", encodeURIComponent(JSON.stringify(filters.extra)));
  }

  return params;
};

/**
 * Busca si el texto ingresado coincide con una categoría o marca conocida.
 * Devuelve { category, brand } con lo que matcheó (o null si no matcheó nada).
 */
export const matchSearchToEntities = (query, categories, brands) => {
  const normalizedQuery = normalize(query.trim());
  if (!normalizedQuery) return { category: null, brand: null };

  const matchedCategory =
    categories.find((c) => normalize(c.name) === normalizedQuery) ??
    categories.find((c) => normalize(c.name).includes(normalizedQuery)) ??
    null;

  const matchedBrand =
    brands.find((b) => normalize(b.name) === normalizedQuery) ??
    brands.find((b) => normalize(b.name).includes(normalizedQuery)) ??
    null;

  return { category: matchedCategory?.name ?? null, brand: matchedBrand?.name ?? null };
};

/**
 * A partir de los productos ya filtrados por categoría, arma las opciones
 * de filtros dinámicos: { LABEL: [valores únicos] }
 */
export const computeExtraFieldOptions = (productsInCategory) => {
  const map = {};
  productsInCategory.forEach((product) => {
    (product.extraFields ?? []).forEach(({ label, value }) => {
      if (!label || !value) return;
      if (!map[label]) map[label] = new Set();
      map[label].add(value);
    });
  });
  return Object.fromEntries(
    Object.entries(map).map(([label, values]) => [label, Array.from(values).sort()]),
  );
};

/**
 * Calcula qué rangos de horas tienen al menos un producto, sobre un set ya
 * filtrado por categoría/condición (pero antes de aplicar el filtro de horas).
 */
export const computeAvailableHourPresets = (productsUsados) =>
  HOURS_PRESETS.filter((preset) =>
    productsUsados.some((p) => {
      const hours = Number(p.hoursValue);
      return !Number.isNaN(hours) && hours >= preset.min && hours < preset.max;
    }),
  );

/**
 * Filtro principal: aplica todos los filtros sobre la lista completa de productos.
 * Nota: `filters.label` nunca se usa acá — es solo para mostrar en la UI.
 */
export const applyFilters = (products, filters) => {
  const normalizedQuery = normalize(filters.q.trim());

  return products.filter((p) => {
    // Condición
    const isUsed = p.condition === "Usado";
    if (isUsed && !filters.conditions.usado) return false;
    if (!isUsed && !filters.conditions.nuevo) return false;

    // Categoría
    if (filters.category && p.category !== filters.category) return false;

    // Marca
    if (filters.brands.length && !filters.brands.includes(p.brand)) return false;

    // Horas (solo aplica si es usado y hay rangos seleccionados)
    if (isUsed && filters.hours.length) {
      const hours = Number(p.hoursValue);
      const matchesAnyRange = filters.hours.some((key) => {
        const preset = HOURS_PRESETS.find((h) => h.key === key);
        return preset && !Number.isNaN(hours) && hours >= preset.min && hours < preset.max;
      });
      if (!matchesAnyRange) return false;
    }

    // Campos dinámicos
    const extraEntries = Object.entries(filters.extra);
    if (extraEntries.length) {
      const matchesAllExtra = extraEntries.every(([label, selectedValues]) => {
        if (!selectedValues.length) return true;
        const productValue = (p.extraFields ?? []).find((f) => f.label === label)?.value;
        return productValue && selectedValues.includes(productValue);
      });
      if (!matchesAllExtra) return false;
    }

    // Búsqueda libre por texto (nombre, marca, categoría, extraFields)
    if (normalizedQuery) {
      const haystack = normalize(
        `${p.name} ${p.brand} ${p.category} ${(p.extraFields ?? [])
          .map((f) => `${f.label} ${f.value}`)
          .join(" ")}`,
      );
      if (!haystack.includes(normalizedQuery)) return false;
    }

    return true;
  });
};