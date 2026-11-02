import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ADMIN_PATHS, PUBLIC_PAGES, SITE_URL, SITE_IMAGE, businessSchema, canonicalUrl, getPageMetadata, getProductMetadata, productShellMetadata } from "../src/seo/metadata.js";
import { headEntries, renderHead } from "../src/seo/head.js";

test("el sitemap coincide con las rutas públicas reales y excluye filtros, alias y administración", () => {
  const router = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
  const routes = [...router.matchAll(/<Route\s+path="([^"]+)"/g)].map((match) => match[1]);
  const publicRoutes = routes.filter((route) => !route.startsWith("/admin") && !route.includes(":") && route !== "/faq" && route !== "*");
  assert.deepEqual(publicRoutes.sort(), Object.keys(PUBLIC_PAGES).sort());
  assert.deepEqual(routes.filter((route) => route.startsWith("/admin")).sort(), [...ADMIN_PATHS].sort());
  const sitemap = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(urls.sort(), publicRoutes.map(canonicalUrl).sort());
  assert.doesNotMatch(sitemap, /lastmod|localhost|web\.app/);
  urls.forEach((url) => assert.equal(new URL(url).search, ""));
});

test("canonical siempre usa el dominio oficial y elimina filtros, fragmentos y barras finales", () => {
  for (const url of ["/catalogo?q=tractor&marca=ERCA", "https://www.delgiorgiomaquinarias.com.ar/catalogo/", "https://del-giorgio-maquinarias.web.app/catalogo#filtros", "http://localhost:5173/catalogo?condicion=nuevo"]) {
    assert.equal(canonicalUrl(url), `${SITE_URL}/catalogo`);
    assert.equal(getPageMetadata(url).canonical, `${SITE_URL}/catalogo`);
  }
  assert.equal(getPageMetadata("/FAQ/").canonical, `${SITE_URL}/preguntas-frecuentes`);
});

test("páginas públicas tienen títulos y descripciones propios, sin metadata duplicada", () => {
  const metadata = Object.keys(PUBLIC_PAGES).map((path) => getPageMetadata(path));
  assert.equal(new Set(metadata.map((page) => page.title)).size, metadata.length);
  assert.equal(new Set(metadata.map((page) => page.description)).size, metadata.length);
  for (const page of metadata) {
    assert.equal(page.robots, "index, follow");
    const entries = headEntries(page);
    const keys = entries.map(({ tag, attrs }) => `${tag}:${attrs?.name || attrs?.property || attrs?.rel || ""}`);
    assert.equal(new Set(keys).size, keys.length);
    assert.equal(entries.filter(({ tag }) => tag === "title").length, 1);
  }
});

test("admin y rutas inexistentes son noindex sin canonical público ni datos estructurados", () => {
  for (const route of [...ADMIN_PATHS, "/ADMIN/panel/futura", "/no-existe"]) {
    const metadata = getPageMetadata(route);
    assert.equal(metadata.robots, "noindex, nofollow");
    assert.equal(metadata.canonical, null);
    assert.equal(metadata.structuredData, null);
  }
});

// Synthetic fixtures only; these IDs never enter sitemap.xml or production HTML.
const product = { id: "fixture-id", status: "Publicado", name: "Equipo de prueba", brand: "Marca de prueba", condition: "Usado", year: 2020, detail: ["Descripción de prueba."], images: ["https://firebasestorage.googleapis.com/example.jpg?alt=media&token=test"] };

test("ficha publicada usa datos e imagen reales del documento, sin ofertas ni precios inventados", () => {
  const metadata = getProductMetadata({ id: product.id, product });
  assert.equal(metadata.canonical, `${SITE_URL}/maquinaria/fixture-id`);
  assert.equal(metadata.image, product.images[0]);
  assert.match(metadata.title, /Equipo de prueba Marca de prueba/);
  assert.match(metadata.description, /Descripción de prueba/);
  assert.equal(metadata.robots, "index, follow");
  assert.equal(metadata.imageWidth, undefined);
  assert.doesNotMatch(JSON.stringify(metadata.structuredData), /offers|price|rating|availability/);
});

test("carga y cambio de ID no filtran metadata vieja; errores y pendientes quedan fuera del índice", () => {
  assert.equal(productShellMetadata().canonical, null);
  assert.equal(productShellMetadata().robots, "index, follow");
  const changing = getProductMetadata({ id: "another-fixture", product });
  assert.equal(changing.canonical, null);
  assert.doesNotMatch(changing.title, /Equipo de prueba/);
  for (const state of [{ id: product.id, product, notFound: true }, { id: product.id, product: { ...product, status: "Pendiente" } }]) {
    assert.equal(getProductMetadata(state).robots, "noindex, nofollow");
  }
  const metadata = getProductMetadata({ id: product.id, product: { ...product, images: ["javascript:alert(1)", "http://localhost/test.jpg", "https://del-giorgio-maquinarias.web.app/test.jpg", "invalid-relative-image"] } });
  assert.equal(metadata.image, SITE_IMAGE);
});

test("escape de HTML y JSON-LD impide cerrar etiquetas con contenido de Firestore", () => {
  const malicious = '</script><script>alert("x")</script>';
  const metadata = getProductMetadata({ id: product.id, product: { ...product, name: malicious, detail: [malicious] } });
  const html = renderHead(metadata);
  assert.doesNotMatch(html, /<script>alert/);
  assert.match(html, /&lt;\/script&gt;/);
  const json = html.match(/<script[^>]+type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
  assert.equal(JSON.parse(json)["@graph"][0].itemListElement[2].name, malicious);
});

test("negocio reutiliza datos confirmados y omite email provisional y afirmaciones no verificadas", () => {
  const business = businessSchema("contacto@example.com");
  assert.equal(business.email, undefined);
  assert.equal(business.telephone, "+542281301249");
  assert.equal(business.address.streetAddress, "Constitución 345");
  assert.equal(business.sameAs.length, 2);
  assert.equal(business.sameAs[0], "https://www.instagram.com/delgiorgiomaquinarias");
  assert.doesNotMatch(JSON.stringify(business), /openingHours|aggregateRating|geo|priceRange|payment/);
});
