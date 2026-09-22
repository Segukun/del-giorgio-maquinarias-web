import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export const ROLES = {
  owner: "Propietario",
  staff: "Personal",
};

export const fetchUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

export const createUserProfile = async (uid, { name, email, role = "staff" }) => {
  await setDoc(doc(db, "users", uid), {
    name,
    email,
    role,
    status: "active",
    createdAt: serverTimestamp(),
  });
};