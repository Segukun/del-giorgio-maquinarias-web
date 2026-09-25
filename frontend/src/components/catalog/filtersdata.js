export const CATEGORY_OPTIONS = [
  "Rastrillos",
  "Tractores",
  "Sembradoras",
  "Cosechadoras",
  "Pulverizadoras",
];

export const BRAND_OPTIONS = [
  "Case IH",
  "New Holland",
  "John Deere",
  "AGCO",
  "Claas",
  "Kuhn",
  "Metalfor",
  "Jacto",
];

export const POWER_OPTIONS = [
  "Hasta 100 HP",
  "100 a 150 HP",
  "150 a 200 HP",
  "200 a 300 HP",
  "Más de 300 HP",
];

export const TRACTION_OPTIONS = ["Simple (2x4)", "Doble tracción (4x4)"];

export const WORK_WIDTH_RANGE = { min: 2, max: 12 };
export const HOURS_RANGE = { min: 0, max: 10000 };

export const DEFAULT_FILTERS = {
  categories: [],
  brands: [],
  conditions: { nuevo: true, usado: true },
  hours: [HOURS_RANGE.min, HOURS_RANGE.max],
  power: [],
  traction: [],
  workWidth: [WORK_WIDTH_RANGE.min, WORK_WIDTH_RANGE.max],
};
