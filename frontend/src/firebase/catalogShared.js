import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "./config.js";
import { CatalogError, isCatalogInUse, normalizeCatalogName } from "../utils/catalogValidation.js";

export { CatalogError, normalizeCatalogName, validateCatalogValues } from "../utils/catalogValidation.js";

export const requireCatalogSession = () => {
  if (!auth.currentUser) {
    throw new CatalogError("unauthenticated", "La sesión venció. Volvé a iniciar sesión.");
  }
};

export const fetchCatalog = async (collectionName) => {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
};

export const assertUniqueName = async (collectionName, name, exceptId) => {
  const items = await fetchCatalog(collectionName);
  const key = normalizeCatalogName(name);
  if (items.some((item) => item.id !== exceptId && normalizeCatalogName(item.name) === key)) {
    throw new CatalogError("duplicate", "Ya existe un registro con ese nombre.");
  }
};

export const assertNotUsedByProducts = async (field, name, entityLabel) => {
  const snapshot = await getDocs(collection(db, "products"));
  const inUse = isCatalogInUse(snapshot.docs.map((item) => item.data()), field, name);
  if (inUse) {
    throw new CatalogError(
      "in-use",
      `No se puede modificar el nombre ni eliminar la ${entityLabel} porque está asociada a maquinaria. Podés desactivarla.`,
    );
  }
};

export const catalogErrorMessage = (error, fallback) => {
  if (error instanceof CatalogError) return error.message;
  if (error?.code === "permission-denied" || error?.code === "storage/unauthorized") {
    return "Firebase rechazó la operación. Revisá los permisos de Firestore y Storage para tu usuario.";
  }
  if (error?.code === "unavailable" || error?.code === "storage/retry-limit-exceeded") {
    return "No se pudo conectar con Firebase. Revisá tu conexión e intentá de nuevo.";
  }
  return fallback;
};
