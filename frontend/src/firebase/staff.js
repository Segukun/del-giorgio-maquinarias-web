import { collection, getDocs } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "./config";

export const fetchAllUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
};

export const createStaffUser = async ({ name, email, password }) => {
  const callable = httpsCallable(functions, "createStaffUser");
  return callable({ name, email, password });
};

export const updateStaffUser = async ({ uid, name, email, password }) => {
  const callable = httpsCallable(functions, "updateStaffUser");
  return callable({ uid, name, email, password });
};

export const deleteStaffUser = async (uid) => {
  const callable = httpsCallable(functions, "deleteStaffUser");
  return callable({ uid });
};

export const toggleStaffStatus = async (uid, status) => {
  const callable = httpsCallable(functions, "toggleStaffStatus");
  return callable({ uid, status });
};