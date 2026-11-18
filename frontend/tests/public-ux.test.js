import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { createServer } from "vite";
import { nextImageIndex, swipeDirection } from "../src/utils/galleryNavigation.js";
import { shouldScrollToTop } from "../src/utils/publicNavigation.js";
import { parseFiltersFromParams, applyFilters } from "../src/utils/catalogFilters.js";

test("galería: navegación circular con 0, 1, 2 y 7 imágenes", () => {
  assert.equal(nextImageIndex(0, -1, 0), 0);
  for (const count of [1, 2, 7]) {
    assert.equal(nextImageIndex(0, -1, count), count - 1);
    assert.equal(nextImageIndex(count - 1, 1, count), 0);
    for (let index = 0; index < count; index++) {
      assert.equal(nextImageIndex(nextImageIndex(index, 1, count), -1, count), index);
    }
  }
});

test("swipe: distingue dirección horizontal, gestos verticales, taps y cancelaciones", () => {
  const start = { clientX: 100, clientY: 100 };
  assert.equal(swipeDirection(start, { clientX: 30, clientY: 110 }), 1);
  assert.equal(swipeDirection(start, { clientX: 170, clientY: 110 }), -1);
  assert.equal(swipeDirection(start, { clientX: 120, clientY: 100 }), 0);
  assert.equal(swipeDirection(start, { clientX: 150, clientY: 200 }), 0);
  assert.equal(swipeDirection(null, start), 0);
});

test("scroll: páginas nuevas suben; filtros, anclas, admin y back/forward se conservan", () => {
  for (const category of ["Tractores", "Sembradoras", "Rastrillos"]) {
    const location = { pathname: "/catalogo", search: `?categoria=${category}`, hash: "" };
    assert.equal(shouldScrollToTop("/", location, "PUSH"), true);
    assert.equal(shouldScrollToTop("/catalogo", location, "PUSH"), false);
    assert.equal(shouldScrollToTop("/maquinaria/123", location, "POP"), false);
  }
  assert.equal(shouldScrollToTop("/nosotros", { pathname: "/contacto" }, "PUSH"), true);
  assert.equal(shouldScrollToTop("/", { pathname: "/catalogo", hash: "#resultados" }, "PUSH"), false);
  assert.equal(shouldScrollToTop("/", { pathname: "/admin/login" }, "PUSH"), false);
  assert.equal(shouldScrollToTop("/", { pathname: "/catalogo" }, "POP"), false);
});

test("galería compartida y enlaces reales de Inicio mantienen controles y filtros", async (t) => {
  // Separate cache from the concurrent public-render suite's Vite server.
  const server = await createServer({ cacheDir: "node_modules/.vite-public-ux-tests", server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: "custom", optimizeDeps: { noDiscovery: true, include: [] } });
  t.after(() => server.close());
  const { default: Gallery } = await server.ssrLoadModule("/src/components/common/ProductGallery.jsx");
  const { default: AdminGallery } = await server.ssrLoadModule("/src/components/admin/ProductGallery.jsx");
  assert.equal(Gallery, AdminGallery, "Admin and public use the same gallery");
  for (const count of [1, 2, 7]) {
    const html = renderToString(createElement(Gallery, {
      productName: "Equipo de prueba", variant: "public",
      images: Array.from({ length: count }, (_, index) => `/fixture-${index}.webp`),
    }));
    assert.match(html, /aria-haspopup="dialog"/);
    assert.match(html, new RegExp(`alt="Equipo de prueba, imagen 1 de ${count}"`));
    assert.equal(html.includes('aria-label="Ver imagen anterior"'), count > 1);
    assert.equal(html.includes('aria-label="Ver imagen siguiente"'), count > 1);
    assert.equal((html.match(/aria-current="true"/g) || []).length, count > 1 ? 1 : 0);
    assert.equal((html.match(/aria-label="Ver imagen \d+"/g) || []).length, count > 1 ? count : 0);
    assert.ok(!html.includes("<dialog"), "Lightbox is initially closed");
  }
  assert.match(renderToString(createElement(Gallery, { variant: "public", images: [] })), /Sin imágenes disponibles/);
  const adminHtml = renderToString(createElement(AdminGallery, { productName: "Equipo", images: ["/1.jpg", "/2.jpg"] }));
  assert.match(adminHtml, /dg-product-gallery__stage/);
  assert.doesNotMatch(adminHtml, /aria-haspopup="dialog"/);

  const { default: QuickFilters } = await server.ssrLoadModule("/src/components/quickfilters.jsx");
  const homeHtml = renderToString(createElement(StaticRouter, { location: "/" }, createElement(QuickFilters)));
  const urls = [...homeHtml.matchAll(/href="([^"]+)"/g)].map((match) => new URL(match[1].replaceAll("&amp;", "&"), "https://example.test"));
  const products = [
    { name: "Tractor", category: "Tractores", condition: "Nuevo", brand: "Marca A" },
    { name: "Sembradora", category: "Sembradoras", condition: "Usado", brand: "Marca B" },
    { name: "Rastrillo", category: "Rastrillos", condition: "Nuevo", brand: "Marca A" },
  ];
  for (const product of products) {
    const url = urls.find((url) => url.searchParams.get("categoria") === product.category);
    assert.ok(url, product.category);
    assert.equal(url.pathname, "/catalogo");
    assert.deepEqual(applyFilters(products, parseFiltersFromParams(url.searchParams)), [product]);
  }
  for (const condition of ["nuevo", "usado"]) {
    const url = urls.find((url) => url.searchParams.get("condicion") === condition);
    assert.ok(url);
    assert.ok(applyFilters(products, parseFiltersFromParams(url.searchParams)).every((p) => p.condition.toLowerCase() === condition));
  }
  const filters = parseFiltersFromParams(new URLSearchParams("categoria=Tractores&marca=Marca+A&condicion=nuevo&q=Tractor"));
  assert.deepEqual(applyFilters(products, filters), [products[0]]);
});
