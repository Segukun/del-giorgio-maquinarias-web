import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const root = createRoot(document.getElementById("root"));
const firebaseEnv = {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
};

function showStartupError(title, detail) {
  root.render(
    <main style={{ maxWidth: 640, margin: "10vh auto", padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>{title}</h1>
      <p>{detail}</p>
    </main>,
  );
}

async function startApp() {
  const missing = Object.entries(firebaseEnv)
    .filter(([, value]) => !value?.trim())
    .map(([name]) => name);

  if (missing.length > 0) {
    showStartupError(
      "Falta configurar Firebase",
      `Completá ${missing.join(", ")} en frontend/.env y reiniciá el servidor de Vite.`,
    );
    return;
  }

  try {
    const [{ default: App }, { default: AdminSessionProvider }] = await Promise.all([
      import("./App.jsx"),
      import("./providers/AdminSessionProvider.jsx"),
    ]);

    root.render(
      <StrictMode>
        <AdminSessionProvider>
          <App />
        </AdminSessionProvider>
      </StrictMode>,
    );
  } catch (error) {
    console.error("No se pudo iniciar la aplicación:", error);
    const invalidApiKey = error?.code === "auth/invalid-api-key";
    showStartupError(
      invalidApiKey ? "Clave de Firebase inválida" : "No se pudo iniciar la aplicación",
      invalidApiKey
        ? "Revisá VITE_FIREBASE_API_KEY en frontend/.env: debe ser el apiKey de la aplicación web de tu proyecto Firebase. Después reiniciá Vite."
        : "Revisá la consola del navegador para ver el error y corregir la configuración.",
    );
  }
}

startApp();
