import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";
import { getOrCreateSessionId } from "../hooks/useVisitorTracking";

export const trackProductView = async (productId, productName) => {
  await addDoc(collection(db, "events"), {
    sessionId: getOrCreateSessionId(),
    type: "product_view",
    productId,
    productName,
    createdAt: serverTimestamp(),
  });
};

export const trackWhatsappClick = async () => {
  await addDoc(collection(db, "events"), {
    sessionId: getOrCreateSessionId(),
    type: "whatsapp_click",
    productId: null,
    productName: null,
    createdAt: serverTimestamp(),
  });
};
