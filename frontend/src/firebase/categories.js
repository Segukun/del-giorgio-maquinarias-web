import { collection, deleteDoc, doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config.js";
import { logAdminActivity } from "./adminActivity.js";
import {
  CatalogError,
  assertNotUsedByProducts,
  assertUniqueName,
  fetchCatalog,
  normalizeCatalogName,
  requireCatalogSession,
  validateCatalogValues,
} from "./catalogShared.js";

const COLLECTION = "categories";

export const fetchCategories = () => fetchCatalog(COLLECTION);

const logActivity = async (action, name) => {
  try {
    await logAdminActivity(action, name);
  } catch (error) {
    console.warn("No se pudo registrar la actividad de categoría:", error);
  }
};

export const createCategory = async (values) => {
  requireCatalogSession();
  const data = validateCatalogValues(values);
  await assertUniqueName(COLLECTION, data.name);
  const ref = doc(collection(db, COLLECTION));
  await setDoc(ref, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  await logActivity("create_category", data.name);
  return ref.id;
};

export const updateCategory = async (id, values) => {
  requireCatalogSession();
  const data = validateCatalogValues(values);
  const ref = doc(db, COLLECTION, id);
  const current = await getDoc(ref);
  if (!current.exists()) throw new CatalogError("not-found", "La categoría ya no existe.");
  if (normalizeCatalogName(current.data().name) !== normalizeCatalogName(data.name)) {
    await assertNotUsedByProducts("category", current.data().name, "categoría");
  }
  await assertUniqueName(COLLECTION, data.name, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  await logActivity("update_category", data.name);
};

export const deleteCategory = async (id) => {
  requireCatalogSession();
  const ref = doc(db, COLLECTION, id);
  const current = await getDoc(ref);
  if (!current.exists()) throw new CatalogError("not-found", "La categoría ya no existe.");
  await assertNotUsedByProducts("category", current.data().name, "categoría");
  await deleteDoc(ref);
  await logActivity("delete_category", current.data().name);
};
