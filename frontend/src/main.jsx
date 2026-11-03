import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RuntimeErrorBoundary from "./components/RuntimeErrorBoundary.jsx";
import { bootstrap } from "./runtime/bootstrap.js";
import "./index.css";

const root = createRoot(document.getElementById("root"));
void bootstrap({
  loadApp: () => import("./App.jsx"),
  render: (App) => root.render(
    <StrictMode>
      <RuntimeErrorBoundary stage="react.public-render">
        <App />
      </RuntimeErrorBoundary>
    </StrictMode>,
  ),
  showError: () => root.render(
    <main style={{ maxWidth: 640, margin: "10vh auto", padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>No se pudo iniciar la aplicación</h1>
      <p>No pudimos cargar el sitio. Intentá recargar la página.</p>
      <button type="button" onClick={() => window.location.reload()}>Reintentar</button>
    </main>,
  ),
});
