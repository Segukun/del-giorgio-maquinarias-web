import { collection, deleteDoc, doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./config.js";
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

const COLLECTION = "brands";

export const fetchBrands = () => fetchCatalog(COLLECTION);

const validateImage = (file, required) => {
  if (!file) {
    if (required) throw new CatalogError("invalid-image", "Seleccioná una imagen para la marca.");
    return;
  }
  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    throw new CatalogError("invalid-image", "Seleccioná un archivo de imagen válido.");
  }
};

const uploadBrandImage = async (file, id) => {
  const path = `brands/${id}/${Date.now()}-${file.name}`;
  const imageRef = ref(storage, path);
  await uploadBytes(imageRef, file);
  try {
    return { url: await getDownloadURL(imageRef), path };
  } catch (error) {
    await deleteObject(imageRef).catch(() => {});
    throw error;
  }
};

const deleteOwnedImage = async (image, id) => {
  if (!image?.path?.startsWith(`brands/${id}/`)) return;
  try {
    await deleteObject(ref(storage, image.path));
  } catch (error) {
    if (error.code !== "storage/object-not-found") {
      console.warn("No se pudo borrar la imagen de marca de Storage:", error);
    }
  }
};

const logActivity = async (action, name) => {
  try {
    await logAdminActivity(action, name);
  } catch (error) {
    console.warn("No se pudo registrar la actividad de marca:", error);
  }
};

export const createBrand = async (values, file) => {
  requireCatalogSession();
  const data = validateCatalogValues(values);
  validateImage(file, true);
  await assertUniqueName(COLLECTION, data.name);
  const brandRef = doc(collection(db, COLLECTION));
  const image = await uploadBrandImage(file, brandRef.id);
  try {
    await setDoc(brandRef, {
      ...data,
      image,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    await deleteOwnedImage(image, brandRef.id);
    throw error;
  }
  await logActivity("create_brand", data.name);
  return { id: brandRef.id, ...data, image };
};

export const updateBrand = async (id, values, file) => {
  requireCatalogSession();
  const data = validateCatalogValues(values);
  validateImage(file, false);
  const brandRef = doc(db, COLLECTION, id);
  const current = await getDoc(brandRef);
  if (!current.exists()) throw new CatalogError("not-found", "La marca ya no existe.");
  if (normalizeCatalogName(current.data().name) !== normalizeCatalogName(data.name)) {
    await assertNotUsedByProducts("brand", current.data().name, "marca");
  }
  await assertUniqueName(COLLECTION, data.name, id);

  const newImage = file ? await uploadBrandImage(file, id) : null;
  try {
    await updateDoc(brandRef, {
      ...data,
      ...(newImage ? { image: newImage } : {}),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    if (newImage) await deleteOwnedImage(newImage, id);
    throw error;
  }
  if (newImage) await deleteOwnedImage(current.data().image, id);
  await logActivity("update_brand", data.name);
  return { id, ...current.data(), ...data, image: newImage ?? current.data().image };
};

export const deleteBrand = async (id) => {
  requireCatalogSession();
  const brandRef = doc(db, COLLECTION, id);
  const current = await getDoc(brandRef);
  if (!current.exists()) throw new CatalogError("not-found", "La marca ya no existe.");
  await assertNotUsedByProducts("brand", current.data().name, "marca");
  await deleteDoc(brandRef);
  await deleteOwnedImage(current.data().image, id);
  await logActivity("delete_brand", current.data().name);
};
