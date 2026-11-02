import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { PUBLIC_PAGES, ADMIN_PATHS, canonicalUrl } from "../src/seo/metadata.js";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const header = (html) => html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] || "";
const scripts = (html) => [...html.matchAll(/<script[^>]+type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

for (const path of Object.keys(PUBLIC_PAGES)) {
  const html = await read(`dist/${path === "/" ? "index" : path.slice(1)}.html`);
  const head = header(html);
  assert.equal((head.match(/<title\b/g) || []).length, 1, path);
  assert.equal((head.match(/name="description"/g) || []).length, 1, path);
  assert.equal((head.match(/rel="canonical"/g) || []).length, 1, path);
  assert.ok(head.includes(`href="${canonicalUrl(path)}"`), path);
  assert.ok(head.includes('name="robots" content="index, follow"'), path);
  assert.doesNotMatch(head, /localhost|127\.0\.0\.1|web\.app|noindex/, path);
  for (const match of scripts(head)) JSON.parse(match[1]);
  assert.equal(scripts(head).length, 1, path);
  for (const image of head.matchAll(/(?:property="og:image"|name="twitter:image") content="https:\/\/delgiorgiomaquinarias\.com\.ar([^"?]+)"/g)) {
    await access(new URL(`dist${image[1]}`, root));
  }
  const icon = head.match(/<link\b[^>]*rel="icon"[^>]*href="([^"]+)"/)[1];
  await access(new URL(`dist${icon}`, root));
}
for (const path of ADMIN_PATHS) {
  const head = header(await read(`dist/${path.slice(1)}.html`));
  assert.ok(head.includes('name="robots" content="noindex, nofollow"'), path);
  assert.doesNotMatch(head, /rel="canonical"|application\/ld\+json/, path);
}
const shell = header(await read("dist/__seo/product.html"));
assert.doesNotMatch(shell, /rel="canonical"|noindex|property="og:url"/);
assert.ok(shell.includes('name="robots" content="index, follow"'));
for (const file of ["robots.txt", "sitemap.xml"]) assert.equal(await read(`public/${file}`), await read(`dist/${file}`));
const firebase = JSON.parse(await read("../firebase.json"));
assert.equal(firebase.hosting.public, "frontend/dist");
assert.equal(firebase.hosting.cleanUrls, true);
assert.ok(firebase.hosting.rewrites.some((rule) => rule.source === "**" && rule.destination === "/index.html"));
for (const path of ADMIN_PATHS) {
  assert.ok(firebase.hosting.headers.some((rule) => rule.regex && new RegExp(rule.regex).test(path) && rule.headers.some((item) => item.key === "X-Robots-Tag" && item.value.includes("noindex"))), path);
}
for (const path of Object.keys(PUBLIC_PAGES)) {
  assert.ok(!firebase.hosting.headers.some((rule) => rule.regex && new RegExp(rule.regex).test(path) && rule.headers.some((item) => item.key === "X-Robots-Tag")), path);
}
console.log(`SEO de dist verificado: ${Object.keys(PUBLIC_PAGES).length} páginas públicas, ${ADMIN_PATHS.length} rutas admin, imágenes, favicon, JSON-LD, robots, sitemap y configuración Hosting.`);
