import { getFirestore } from "firebase/firestore";
import app from "./app.js";

// Default in-memory Firestore cache; no Auth/persistence or Storage initialization.
export const db = getFirestore(app);
