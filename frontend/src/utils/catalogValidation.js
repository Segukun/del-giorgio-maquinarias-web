export class CatalogError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "CatalogError";
    this.code = code;
  }
}

export const normalizeCatalogName = (value) =>
  value.trim().replace(/\s+/g, " ").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");

export const validateCatalogValues = ({ name, isActive }) => {
  if (typeof name !== "string" || !name.trim()) {
    throw new CatalogError("invalid-name", "Ingresá un nombre válido.");
  }
  if (typeof isActive !== "boolean") {
    throw new CatalogError("invalid-status", "Seleccioná un estado válido.");
  }
  return { name: name.trim().replace(/\s+/g, " "), isActive };
};

export const isCatalogInUse = (products, field, name) => {
  const key = normalizeCatalogName(name);
  return products.some((product) =>
    typeof product[field] === "string" && normalizeCatalogName(product[field]) === key,
  );
};
