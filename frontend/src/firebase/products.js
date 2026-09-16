
import { logAdminActivity } from "./adminActivity";

import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "./config";

const PRODUCTS_COLLECTION = "products";
const BRANDS_COLLECTION = "brands";
const CATEGORIES_COLLECTION = "categories";

/* =========================================================
   LECTURA
========================================================= */

export const fetchProducts = async () => {
  const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
};

export const fetchActiveBrands = async () => {
  const snapshot = await getDocs(collection(db, BRANDS_COLLECTION));
  return snapshot.docs
    .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
    .filter((brand) => brand.isActive)
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const fetchActiveCategories = async () => {
  const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
  return snapshot.docs
    .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
    .filter((category) => category.isActive)
    .sort((a, b) => a.name.localeCompare(b.name));
};

/* =========================================================
   IMÁGENES (Storage)
========================================================= */

export const uploadProductImages = async (files, productId) => {
  const uploads = files.map(async (file) => {
    const path = `products/${productId}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, path };
  });

  return Promise.all(uploads);
};

export const deleteProductImage = async (path) => {
  if (!path) return;
  try {
    await deleteObject(ref(storage, path));
  } catch (err) {
    // Si ya no existe en Storage, no rompemos el flujo de borrado del producto
    console.warn("No se pudo borrar la imagen de Storage:", err);
  }
};

/* =========================================================
   ESCRITURA
========================================================= */

export const createProduct = async (data, files) => {
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...data,
    images: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  if (files?.length) {
    const uploaded = await uploadProductImages(files, docRef.id);
    await updateDoc(docRef, { images: uploaded.map((img) => img.url) });
  }

  await logAdminActivity("create_product", data.name);

  return docRef.id;
};

export const updateProduct = async (productId, data, newFiles, existingImages) => {
  let images = existingImages ?? [];

  if (newFiles?.length) {
    const uploaded = await uploadProductImages(newFiles, productId);
    images = [...images, ...uploaded.map((img) => img.url)];
  }

  await updateDoc(doc(db, PRODUCTS_COLLECTION, productId), {
    ...data,
    images,
    updatedAt: serverTimestamp(),
  });

  await logAdminActivity("update_product", data.name);
};

export const deleteProduct = async (productId) => {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
  // Nota: esto borra el documento de Firestore. Las imágenes en Storage bajo
  // products/{productId}/ quedan huérfanas :(

  await logAdminActivity("delete_product", productId);
};

export const toggleProductFeatured = async (productId, featured) => {
  await updateDoc(doc(db, PRODUCTS_COLLECTION, productId), {
    featured,
    updatedAt: serverTimestamp(),
  });
};
