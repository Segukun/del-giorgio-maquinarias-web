import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./config";

const ADMIN_ACTIVITY_COLLECTION = "adminActivity";

export const logAdminActivity = async (action, targetName) => {
  const user = auth.currentUser;
  await addDoc(collection(db, ADMIN_ACTIVITY_COLLECTION), {
    userEmail: user?.email ?? "Desconocido",
    action, // "create_product" | "update_product" | "delete_product" | "create_brand" | "create_category"
    targetName,
    createdAt: serverTimestamp(),
  });
};

export const fetchRecentActivity = async (topN = 5) => {
  const q = query(
    collection(db, ADMIN_ACTIVITY_COLLECTION),
    orderBy("createdAt", "desc"),
    limit(topN),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
};

export const ACTION_LABELS = {
  create_product: "creó la máquina",
  update_product: "editó la máquina",
  delete_product: "eliminó la máquina",
  create_brand: "agregó la marca",
  update_brand: "editó la marca",
  delete_brand: "eliminó la marca",
  create_category: "agregó la categoría",
  update_category: "editó la categoría",
  delete_category: "eliminó la categoría",
};
