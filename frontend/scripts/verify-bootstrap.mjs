import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const chunks = JSON.parse(await read("dist/.vite/bootstrap-audit.json"));
const byFile = new Map(chunks.map((chunk) => [chunk.file, chunk]));
for (const chunk of chunks) {
  for (const file of [chunk.file, ...chunk.imports, ...chunk.dynamicImports]) {
    await access(new URL(`dist/${file}`, root));
  }
}
const findModule = (name) => chunks.find((chunk) => chunk.modules.includes(name));
const closure = (file, visited = new Set()) => {
  if (visited.has(file)) return visited;
  visited.add(file);
  for (const dependency of byFile.get(file)?.imports || []) closure(dependency, visited);
  return visited;
};
assert.ok(!findModule("src/providers/AdminSessionProvider.jsx"), "Legacy/mock provider must not be emitted");
for (const entry of ["src/main.jsx", "src/App.jsx"]) {
  const chunk = findModule(entry);
  assert.ok(chunk, entry);
  const modules = [...closure(chunk.file)].flatMap((file) => byFile.get(file)?.modules || []);
  assert.deepEqual(modules.filter((id) => /src\/(?:pages\/admin|components\/admin|context|providers)\/|src\/firebase\/(?:config|app|publicDb)\.js|node_modules\/@firebase\//.test(id)), [], entry);
}
const config = findModule("src/firebase/config.js");
const admin = findModule("src/components/admin/AdminArea.jsx");
assert.ok(config && admin, "Administrative services and provider are retained");
assert.ok(closure(admin.file).has(config.file), "Admin still initializes authenticated services");
const guard = findModule("src/components/admin/requireadminauth.jsx");
assert.ok(guard && closure(guard.file).has(config.file), "ProtectedRoute still depends on Auth");
const app = await read("src/App.jsx");
assert.equal((app.match(/<RequireAdminAuth>/g) || []).length, 6, "All six protected panels retain their guard");
console.log("Bootstrap verificado: React público sin Firebase ni Admin como dependencias estáticas; proveedor antiguo ausente; servicios y seis rutas protegidas conservados.");
