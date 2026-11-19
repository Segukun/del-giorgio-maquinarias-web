
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { db, storage } from "./config";
import { logAdminActivity } from "./adminActivity";

const PRODUCTS_COLLECTION = "products";
const BRANDS_COLLECTION = "brands";
const CATEGORIES_COLLECTION = "categories";

const getCollectionItems = (snapshot) =>
  snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));

const sortByName = (items) =>
  [...items].sort((a, b) =>
    (a.name ?? "").localeCompare(b.name ?? "", "es"),
  );

/* =========================================================
   LECTURA TRADICIONAL
   Se conserva para otros componentes que todavía la utilizan.
========================================================= */

export const fetchProducts = async () => {
  const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
  return getCollectionItems(snapshot);
};

export const fetchActiveBrands = async () => {
  const snapshot = await getDocs(collection(db, BRANDS_COLLECTION));

  return sortByName(
    getCollectionItems(snapshot).filter((brand) => brand.isActive),
  );
};

export const fetchActiveCategories = async () => {
  const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));

  return sortByName(
    getCollectionItems(snapshot).filter((category) => category.isActive),
  );
};

/* =========================================================
   SUSCRIPCIONES EN TIEMPO REAL
========================================================= */

export const subscribeProducts = (onData, onError) => {
  return onSnapshot(
    collection(db, PRODUCTS_COLLECTION),
    (snapshot) => {
      onData(getCollectionItems(snapshot));
    },
    onError,
  );
};

export const subscribeActiveBrands = (onData, onError) => {
  return onSnapshot(
    collection(db, BRANDS_COLLECTION),
    (snapshot) => {
      const brands = getCollectionItems(snapshot).filter(
        (brand) => brand.isActive,
      );

      onData(sortByName(brands));
    },
    onError,
  );
};

export const subscribeActiveCategories = (onData, onError) => {
  return onSnapshot(
    collection(db, CATEGORIES_COLLECTION),
    (snapshot) => {
      const categories = getCollectionItems(snapshot).filter(
        (category) => category.isActive,
      );

      onData(sortByName(categories));
    },
    onError,
  );
};

/* =========================================================
   REGISTRO DE ACTIVIDAD
   Es secundario respecto de la operación principal.
========================================================= */

const logProductActivitySafely = async (action, productName) => {
  try {
    await logAdminActivity(action, productName);
  } catch (error) {
    console.error(
      "La operación del producto se completó, pero no se pudo registrar la actividad:",
      error,
    );
  }
};

/* =========================================================
   IMÁGENES (STORAGE)
========================================================= */

/**
 * Sube varias imágenes y notifica el progreso global.
 *
 * onProgress recibe un porcentaje entre 0 y 100.
 * El progreso contempla todas las imágenes, no solamente una.
 */
export const uploadProductImages = async (
  files,
  productId,
  onProgress,
) => {
  if (!files?.length) return [];

  const totalBytes = files.reduce(
    (total, file) => total + file.size,
    0,
  );

  const transferredBytes = files.map(() => 0);
  const uploadTasks = [];

  const calculateProgress = () => {
    if (!totalBytes) return 99;

    const transferred = transferredBytes.reduce(
      (total, bytes) => total + bytes,
      0,
    );

    return Math.min(99, Math.floor((transferred / totalBytes) * 100));
  };

  onProgress?.(0);

  try {
    const uploads = files.map((file, index) => {
      return new Promise((resolve, reject) => {
        const path = `products/${productId}/${Date.now()}-${crypto.randomUUID()}-${file.name}`;

        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTasks.push(uploadTask);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            transferredBytes[index] = snapshot.bytesTransferred;
            onProgress?.(calculateProgress());
          },
          reject,
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);

              transferredBytes[index] = file.size;
              onProgress?.(calculateProgress());

              resolve({ url, path });
            } catch (error) {
              reject(error);
            }
          },
        );
      });
    });

    const uploadedImages = await Promise.all(uploads);

    onProgress?.(100);

    return uploadedImages;
  } catch (error) {
    // Si una imagen falla, cancelamos las demás subidas pendientes.
    uploadTasks.forEach((task) => task.cancel());

    throw error;
  }
};

export const deleteProductImage = async (path) => {
  if (!path) return;

  try {
    await deleteObject(ref(storage, path));
  } catch (error) {
    console.warn(
      "No se pudo borrar la imagen de Storage:",
      error,
    );
  }
};

/**
 * Recibe una lista ordenada de imágenes existentes y nuevas.
 *
 * imageItems:
 * [
 *   { id, kind: "existing", url },
 *   { id, kind: "new", file }
 * ]
 *
 * Devuelve las URLs respetando el orden seleccionado.
 */
export const buildOrderedImages = async (
  imageItems,
  productId,
  onProgress,
) => {
  const newItems = imageItems.filter(
    (item) => item.kind === "new",
  );

  const uploadedMap = {};

  if (newItems.length) {
    const uploads = await uploadProductImages(
      newItems.map((item) => item.file),
      productId,
      onProgress,
    );

    newItems.forEach((item, index) => {
      uploadedMap[item.id] = uploads[index].url;
    });
  }

  return imageItems.map((item) =>
    item.kind === "existing"
      ? item.url
      : uploadedMap[item.id],
  );
};

/* =========================================================
   ESCRITURA
========================================================= */

export const createProduct = async (
  data,
  imageItems,
  onProgress,
) => {
  const docRef = await addDoc(
    collection(db, PRODUCTS_COLLECTION),
    {
      ...data,
      images: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );

  const images = await buildOrderedImages(
    imageItems,
    docRef.id,
    onProgress,
  );

  await updateDoc(docRef, { images });

  await logProductActivitySafely(
    "create_product",
    data.name,
  );

  return docRef.id;
};

export const updateProduct = async (
  productId,
  data,
  imageItems,
  onProgress,
) => {
  const images = await buildOrderedImages(
    imageItems,
    productId,
    onProgress,
  );

  await updateDoc(
    doc(db, PRODUCTS_COLLECTION, productId),
    {
      ...data,
      images,
      updatedAt: serverTimestamp(),
    },
  );

  await logProductActivitySafely(
    "update_product",
    data.name,
  );
};

export const deleteProduct = async (
  productId,
  productName,
) => {
  await deleteDoc(
    doc(db, PRODUCTS_COLLECTION, productId),
  );

  await logProductActivitySafely(
    "delete_product",
    productName || "Producto sin nombre",
  );
};

export const toggleProductFeatured = async (
  productId,
  featured,
) => {
  await updateDoc(
    doc(db, PRODUCTS_COLLECTION, productId),
    {
      featured,
      updatedAt: serverTimestamp(),
    },
  );
};

/* =========================================================
   CARACTERÍSTICAS ADICIONALES
========================================================= */

/**
 * Devuelve los títulos y valores existentes para una categoría.
 *
 * Resultado:
 * {
 *   COLOR: ["VERDE", "ROJO"],
 *   TRACCIÓN: ["4X2", "4X4"]
 * }
 */
export const fetchExtraFieldOptionsByCategory = async (
  category,
) => {
  if (!category) return {};

  const products = await fetchProducts();
  const map = {};

  products
    .filter((product) => product.category === category)
    .forEach((product) => {
      (product.extraFields ?? []).forEach(({ label, value }) => {
        if (!label || !value) return;

        if (!map[label]) {
          map[label] = new Set();
        }

        map[label].add(value);
      });
    });

  return Object.fromEntries(
    Object.entries(map).map(([label, values]) => [
      label,
      Array.from(values).sort(),
    ]),
  );
};
