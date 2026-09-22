import { collection, addDoc, doc, getDoc, getDocs, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./config";

const ADMIN_ACTIVITY_COLLECTION = "adminActivity";

export const logAdminActivity = async (action, targetName) => {
  const user = auth.currentUser;
  let userName = user?.email ?? "Desconocido";

  if (user) {
    try {
      const profileSnap = await getDoc(doc(db, "users", user.uid));
      if (profileSnap.exists() && profileSnap.data().name) {
        userName = profileSnap.data().name;
      }
    } catch (err) {
      console.warn("No se pudo obtener el nombre del usuario para el log de actividad:", err);
    }
  }

  await addDoc(collection(db, ADMIN_ACTIVITY_COLLECTION), {
    userEmail: user?.email ?? "Desconocido",
    userName,
    action,
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