import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./publicDb.js";

export function writeMetric(name, data) {
  return addDoc(collection(db, name), { ...data, createdAt: serverTimestamp() });
}
