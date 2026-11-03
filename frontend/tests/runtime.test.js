import test from "node:test";
import assert from "node:assert/strict";
import { bootstrap } from "../src/runtime/bootstrap.js";
import { redactDiagnostic, runOptionalTask } from "../src/runtime/errors.js";
import { getOrCreateSessionId } from "../src/runtime/session.js";
import { trackVisit } from "../src/runtime/visitorTracking.js";
import { withTimeout } from "../src/runtime/timeout.js";

const browserFixture = () => {
  const values = new Map();
  return {
    location: { pathname: "/catalogo", search: "" },
    document: { referrer: "" },
    navigator: { userAgent: "test desktop" },
    crypto: { randomUUID: () => "test-session" },
    sessionStorage: { getItem: (key) => values.get(key), setItem: (key, value) => values.set(key, value) },
    AbortController,
    fetch: async () => { throw new Error("Optional geolocation unavailable"); },
  };
};

test("bootstrap renderiza la aplicación sin cargar un proveedor administrativo", async () => {
  const App = () => null;
  const renders = [];
  assert.equal(await bootstrap({ loadApp: async () => ({ default: App }), render: (value) => renders.push(value), showError: () => assert.fail("Unexpected fallback") }), true);
  assert.deepEqual(renders, [App]);
});

test("un módulo crítico rechazado identifica la etapa y conserva el fallback real", async (t) => {
  const log = t.mock.method(console, "error", () => {});
  let failed = false;
  const error = new TypeError("Failed to fetch dynamically imported module: https://example.test/App.js?token=private");
  assert.equal(await bootstrap({ loadApp: async () => { throw error; }, render: () => assert.fail("No app loaded"), showError: () => { failed = true; } }), false);
  assert.equal(failed, true);
  const diagnostic = log.mock.calls[0].arguments[1];
  assert.equal(diagnostic.stage, "bootstrap.import-app");
  assert.equal(diagnostic.name, "TypeError");
  assert.match(diagnostic.stack, /runtime.test.js/);
  assert.doesNotMatch(JSON.stringify(diagnostic), /private/);
});

test("una funcionalidad opcional rechazada no propaga errores al consumidor", async (t) => {
  const log = t.mock.method(console, "error", () => {});
  assert.equal(await runOptionalTask("tracking.test", () => { throw new Error("Storage disabled"); }), null);
  assert.equal(await runOptionalTask("tracking.test", async () => { throw new Error("Service unavailable"); }), null);
  assert.equal(log.mock.calls.length, 2);
});

test("storage inaccesible o UUID ausente desactiva métricas sin lanzar excepciones", async () => {
  const browser = browserFixture();
  Object.defineProperty(browser, "sessionStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } });
  assert.equal(getOrCreateSessionId(browser), null);
  await trackVisit(browser, () => assert.fail("No backend without a session"));
  const noCrypto = browserFixture();
  noCrypto.crypto = undefined;
  assert.equal(getOrCreateSessionId(noCrypto), null);
  const quota = browserFixture();
  quota.sessionStorage.setItem = () => { throw new Error("Quota exceeded"); };
  assert.equal(getOrCreateSessionId(quota), null);
});

test("tracking mantiene sesiones normales, evita duplicados y tolera geolocalización caída", async () => {
  const browser = browserFixture();
  const writes = [];
  const writer = async () => ({ writeMetric: async (...args) => writes.push(args) });
  await Promise.all([trackVisit(browser, writer), trackVisit(browser, writer)]);
  await trackVisit(browser, writer);
  assert.equal(writes.length, 1);
  assert.equal(writes[0][0], "sessions");
  assert.equal(writes[0][1].city, null);
  assert.equal(writes[0][1].sessionId, "test-session");
  assert.equal(browser.sessionStorage.getItem("dg_session_created"), "true");
});

test("fallo de carga/escritura del tracking queda contenido y no marca la sesión como enviada", async (t) => {
  t.mock.method(console, "error", () => {});
  const browser = browserFixture();
  await trackVisit(browser, async () => { throw new TypeError("Failed to fetch dynamically imported module"); });
  await trackVisit(browser, async () => ({ writeMetric: async () => { throw new Error("permission-denied"); } }));
  assert.equal(browser.sessionStorage.getItem("dg_session_created"), undefined);
  browser.location.pathname = "/admin/panel/inicio";
  await trackVisit(browser, () => assert.fail("Admin is not tracked"));
});

test("una lectura rechazada o que no responde permite salir del estado de carga", async () => {
  await assert.rejects(withTimeout(() => Promise.reject(new Error("permission-denied"))), /permission-denied/);
  await assert.rejects(withTimeout(() => new Promise(() => {}), 5), /tiempo de espera/);
  assert.equal(await withTimeout(() => Promise.resolve("ready")), "ready");
});

test("diagnósticos omiten credenciales, tokens, emails y parámetros de URLs", () => {
  const text = redactDiagnostic('token=private password="pass phrase" user@example.test Bearer jwt https://user:pass@example.test/App.js?key=secret#private');
  assert.doesNotMatch(text, /private|user@example|\bpass\b|phrase|Bearer jwt|user:pass|key=secret/);
  assert.match(text, /App.js/);
});
