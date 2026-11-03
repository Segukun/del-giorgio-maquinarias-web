// Public reads don't import administrative writes, Auth, Storage or Functions.
async function readCollection(name) {
  const [{ db }, { collection, getDocs }] = await Promise.all([
    import("./publicDb.js"), import("firebase/firestore"),
  ]);
  const snapshot = await getDocs(collection(db, name));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export const fetchProducts = () => readCollection("products");
export const fetchBrands = async () => (await readCollection("brands")).sort((a, b) => a.name.localeCompare(b.name, "es"));
export const fetchActiveBrands = async () => (await fetchBrands()).filter((brand) => brand.isActive);
export const fetchActiveCategories = async () => (await readCollection("categories")).filter((category) => category.isActive).sort((a, b) => a.name.localeCompare(b.name));

export async function fetchProduct(id) {
  const [{ db }, { doc, getDoc }] = await Promise.all([
    import("./publicDb.js"), import("firebase/firestore"),
  ]);
  const snapshot = await getDoc(doc(db, "products", id));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}
