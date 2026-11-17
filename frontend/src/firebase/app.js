
import { initializeApp } from "firebase/app";

import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";

/* =========================================================
   CONFIGURACIÓN FIREBASE
========================================================= */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

/* =========================================================
   APP CHECK - RECAPTCHA ENTERPRISE
========================================================= */

// Clave pública creada en Google Cloud Fraud Defense.
const siteKey =
  import.meta.env.VITE_FIREBASE_APP_CHECK_SITE_KEY;

if (!siteKey) {
  throw new Error(
    "Falta configurar VITE_FIREBASE_APP_CHECK_SITE_KEY.",
  );
}

/* =========================================================
   TOKEN DE DEPURACIÓN
========================================================= */

if (import.meta.env.DEV) {
  const debugToken =
    import.meta.env.VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN;

  if (!debugToken) {
    throw new Error(
      "Falta configurar VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN en .env.development.local.",
    );
  }

  self.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;
}

/* =========================================================
   INICIALIZACIÓN APP CHECK
========================================================= */

initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(siteKey),
  isTokenAutoRefreshEnabled: true,
});

export default app;
