import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import app from "./app.js";

// Administrative services: imported only inside the lazy Admin route tree.
export const auth = getAuth(app);
export { db } from "./publicDb.js";
export const storage = getStorage(app);
export const functions = getFunctions(app, "southamerica-east1"); // misma región que las functions

export default app;
