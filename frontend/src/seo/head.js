import { SITE_NAME } from "./metadata.js";

export const serializeJsonLd = (value) => JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");

export function headEntries(metadata) {
  const entries = [{ tag: "title", text: metadata.title }];
  const meta = (key, value, property = false) => {
    if (value !== undefined && value !== null && value !== "") entries.push({ tag: "meta", attrs: { [property ? "property" : "name"]: key, content: String(value) } });
  };
  meta("description", metadata.description);
  meta("robots", metadata.robots);
  if (metadata.canonical) entries.push({ tag: "link", attrs: { rel: "canonical", href: metadata.canonical } });
  meta("og:title", metadata.title, true);
  meta("og:description", metadata.description, true);
  meta("og:url", metadata.canonical, true);
  meta("og:type", metadata.type, true);
  meta("og:site_name", SITE_NAME, true);
  meta("og:locale", "es_AR", true);
  meta("og:image", metadata.image, true);
  meta("og:image:alt", metadata.imageAlt, true);
  meta("og:image:width", metadata.imageWidth, true);
  meta("og:image:height", metadata.imageHeight, true);
  meta("twitter:card", metadata.twitterCard);
  meta("twitter:title", metadata.title);
  meta("twitter:description", metadata.description);
  meta("twitter:image", metadata.image);
  meta("twitter:image:alt", metadata.imageAlt);
  if (metadata.structuredData) entries.push({ tag: "script", attrs: { type: "application/ld+json" }, text: serializeJsonLd(metadata.structuredData) });
  return entries;
}

const escapeHtml = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export function renderHead(metadata) {
  return headEntries(metadata).map(({ tag, attrs = {}, text = "" }) => {
    const attributes = Object.entries(attrs).map(([key, value]) => ` ${key}="${escapeHtml(value)}"`).join("");
    const opening = `<${tag} data-dg-seo${attributes}>`;
    if (tag === "meta" || tag === "link") return opening;
    return `${opening}${tag === "script" ? text : escapeHtml(text)}</${tag}>`;
  }).join("\n    ");
}

export function replaceSeoHead(html, metadata) {
  const pattern = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/;
  if (!pattern.test(html)) throw new Error("Falta el bloque SEO en index.html");
  return html.replace(pattern, () => `<!-- seo:start -->\n    ${renderHead(metadata)}\n    <!-- seo:end -->`);
}

export function applyHead(document, metadata) {
  document.head.querySelectorAll("[data-dg-seo]").forEach((element) => element.remove());
  const elements = headEntries(metadata).map(({ tag, attrs = {}, text }) => {
    const element = document.createElement(tag);
    element.setAttribute("data-dg-seo", "");
    Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
    if (text) element.textContent = text;
    document.head.appendChild(element);
    return element;
  });
  // Remove only this render's nodes: an old route must not erase a newer route's SEO.
  return () => elements.forEach((element) => element.remove());
}
