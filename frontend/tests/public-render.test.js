import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { createServer } from "vite";

// Component-render test, not a browser/WRS substitute and not production SSR.
test("las ocho páginas públicas producen contenido con APIs de almacenamiento bloqueadas", async (t) => {
  const server = await createServer({ server: { middlewareMode: true, watch: null }, appType: "custom", optimizeDeps: { noDiscovery: true, include: [] } });
  t.after(() => server.close());
  for (const name of ["localStorage", "sessionStorage", "indexedDB", "navigator", "crypto", "Notification"]) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, name);
    Object.defineProperty(globalThis, name, { configurable: true, get() { throw new Error(`Unavailable API: ${name}`); } });
    t.after(() => {
      if (previous) Object.defineProperty(globalThis, name, previous);
      else delete globalThis[name];
    });
  }
  const { AppRoutes } = await server.ssrLoadModule("/src/App.jsx");
  const routes = {
    "/": "DEL GIORGIO MAQUINARIAS", "/catalogo": "Catálogo de maquinaria", "/marcas": "Nuestras marcas",
    "/nosotros": "Nosotros", "/contacto": "Contacto", "/preguntas-frecuentes": "Preguntas frecuentes",
    "/privacidad": "Política de privacidad", "/terminos": "Términos",
  };
  for (const [path, text] of Object.entries(routes)) {
    const html = renderToString(createElement(StaticRouter, { location: path }, createElement(AppRoutes)));
    assert.ok(html.includes(text), path);
    assert.doesNotMatch(html, /No se pudo iniciar la aplicación|Clave de Firebase inválida/, path);
    assert.match(html, /<h1/, path);
  }
});
