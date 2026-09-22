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
import { logAdminActivity } from "./adminActivity";

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
    console.warn("No se pudo borrar la imagen de Storage:", err);
  }
};

/**
 * Recibe una lista ordenada de items de imagen (mezcla de existentes y nuevas)
 * y devuelve el array final de URLs, respetando el orden dado.
 *
 * imageItems: [{ id, kind: "existing", url } | { id, kind: "new", file }]
 */
export const buildOrderedImages = async (imageItems, productId) => {
  const newItems = imageItems.filter((item) => item.kind === "new");

  let uploadedMap = {};
  if (newItems.length) {
    const uploads = await uploadProductImages(
      newItems.map((item) => item.file),
      productId,
    );
    newItems.forEach((item, index) => {
      uploadedMap[item.id] = uploads[index].url;
    });
  }

  return imageItems.map((item) => (item.kind === "existing" ? item.url : uploadedMap[item.id]));
};

/* =========================================================
   ESCRITURA
========================================================= */

export const createProduct = async (data, imageItems) => {
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...data,
    images: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const images = await buildOrderedImages(imageItems, docRef.id);
  await updateDoc(docRef, { images });

  await logAdminActivity("create_product", data.name);

  return docRef.id;
};

export const updateProduct = async (productId, data, imageItems) => {
  const images = await buildOrderedImages(imageItems, productId);

  await updateDoc(doc(db, PRODUCTS_COLLECTION, productId), {
    ...data,
    images,
    updatedAt: serverTimestamp(),
  });

  await logAdminActivity("update_product", data.name);
};

export const deleteProduct = async (productId, productName) => {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
  await logAdminActivity("delete_product", productName);
};

export const toggleProductFeatured = async (productId, featured) => {
  await updateDoc(doc(db, PRODUCTS_COLLECTION, productId), {
    featured,
    updatedAt: serverTimestamp(),
  });
};