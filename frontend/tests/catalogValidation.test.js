import test from "node:test";
import assert from "node:assert/strict";
import { CatalogError, isCatalogInUse, normalizeCatalogName, validateCatalogValues } from "../src/utils/catalogValidation.js";

test("normaliza mayúsculas, tildes y espacios para comparar nombres", () => {
  assert.equal(normalizeCatalogName("  PULVERIZACIÓN  "), normalizeCatalogName("pulverizacion"));
  assert.equal(normalizeCatalogName("John   Deere"), normalizeCatalogName("john deere"));
});

test("valida y limpia nombre y estado", () => {
  assert.deepEqual(validateCatalogValues({ name: "  John   Deere  ", isActive: false }), {
    name: "John Deere",
    isActive: false,
  });
  assert.throws(() => validateCatalogValues({ name: "  ", isActive: true }), CatalogError);
  assert.throws(() => validateCatalogValues({ name: "Mainero", isActive: "true" }), CatalogError);
});

test("detecta maquinaria asociada por nombre aunque cambien tildes o mayúsculas", () => {
  const products = [{ brand: "John Deere", category: "Pulverización" }];
  assert.equal(isCatalogInUse(products, "brand", "john deere"), true);
  assert.equal(isCatalogInUse(products, "category", "PULVERIZACION"), true);
  assert.equal(isCatalogInUse(products, "brand", "Mainero"), false);
});
