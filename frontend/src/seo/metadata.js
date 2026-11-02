import { CONTACT_LOCATION, FACEBOOK_URL, INSTAGRAM_URL, MAPS_PROFILE_URL, WHATSAPP_NUMBER } from "../config/contact.js";

export const SITE_URL = "https://www.delgiorgiomaquinarias.com.ar";
export const SITE_NAME = "Del Giorgio Maquinarias";
export const SITE_IMAGE = `${SITE_URL}/brand/dg-logo.png`;
export const INDEX = "index, follow";
export const NOINDEX = "noindex, nofollow";

// Only canonical routes implemented in App.jsx. Catalog filters share /catalogo.
export const PUBLIC_PAGES = {
  "/": {
    title: "Del Giorgio Maquinarias | Maquinaria agrícola nueva y usada",
    description: "Venta de maquinaria agrícola nueva y usada, repuestos y servicio postventa en Benito Juárez, Buenos Aires. Conocé nuestro catálogo y consultanos.",
    label: "Inicio",
  },
  "/catalogo": {
    title: "Catálogo de maquinaria agrícola nueva y usada | Del Giorgio Maquinarias",
    description: "Explorá nuestro catálogo de maquinaria agrícola nueva y usada. Filtrá por marca, categoría y condición, y consultá disponibilidad por WhatsApp.",
    label: "Catálogo",
  },
  "/marcas": {
    title: "Marcas de maquinaria agrícola | Del Giorgio Maquinarias",
    description: "Conocé las marcas del catálogo de Del Giorgio Maquinarias. Consultanos por equipos y repuestos en Benito Juárez, Buenos Aires.",
    label: "Marcas",
  },
  "/nosotros": {
    title: "Nosotros | Del Giorgio Maquinarias en Benito Juárez",
    description: "Conocé Del Giorgio Maquinarias en Benito Juárez: venta de maquinaria agrícola nueva y usada, repuestos y acompañamiento postventa.",
    label: "Nosotros",
  },
  "/contacto": {
    title: "Contacto y ubicación | Del Giorgio Maquinarias",
    description: "Contactá a Del Giorgio Maquinarias por WhatsApp o visitanos en Constitución 345, Benito Juárez. Consultas por maquinaria, repuestos y servicio postventa.",
    label: "Contacto",
  },
  "/preguntas-frecuentes": {
    title: "Preguntas frecuentes | Del Giorgio Maquinarias",
    description: "Respuestas sobre maquinaria nueva y usada, disponibilidad, repuestos, postventa y ubicación. Conocé cómo consultar a Del Giorgio Maquinarias.",
    label: "Preguntas frecuentes",
  },
  "/privacidad": {
    title: "Política de privacidad | Del Giorgio Maquinarias",
    description: "Conocé cómo Del Giorgio Maquinarias utiliza los datos de navegación, las métricas del sitio y los servicios externos, y cómo realizar consultas de privacidad.",
    label: "Política de privacidad",
  },
  "/terminos": {
    title: "Términos de uso | Del Giorgio Maquinarias",
    description: "Información sobre el uso del catálogo de Del Giorgio Maquinarias, las publicaciones de equipos y las condiciones que se confirman al consultar a la empresa.",
    label: "Términos de uso",
  },
};

export const ADMIN_PATHS = [
  "/admin", "/admin/login", "/admin/reset-password", "/admin/panel",
  "/admin/panel/inicio", "/admin/panel/productos", "/admin/panel/personal",
  "/admin/panel/categorias", "/admin/panel/marcas", "/admin/panel/cuenta",
  "/admin/personal", "/admin/categorias", "/admin/marcas",
];

export function normalizePath(value = "/") {
  const pathname = new URL(value, SITE_URL).pathname.replace(/\/+$/, "") || "/";
  // React Router matches static segments without case sensitivity; product IDs retain case.
  if (/^\/maquinaria\//i.test(pathname)) return pathname.replace(/^\/maquinaria\//i, "/maquinaria/");
  return pathname.toLowerCase();
}

export const canonicalUrl = (path) => `${SITE_URL}${normalizePath(path)}`;
export const isAdminPath = (path) => /^\/admin(?:\/|$)/i.test(normalizePath(path));
export const isProductPath = (path) => /^\/maquinaria\/[^/]+$/i.test(normalizePath(path));

export function businessSchema(contactEmail) {
  const schema = {
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#negocio`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: SITE_IMAGE,
    image: SITE_IMAGE,
    telephone: `+${WHATSAPP_NUMBER}`,
    address: { "@type": "PostalAddress", ...CONTACT_LOCATION },
    hasMap: MAPS_PROFILE_URL,
    sameAs: [new URL(INSTAGRAM_URL).origin + new URL(INSTAGRAM_URL).pathname, FACEBOOK_URL],
  };
  // Never publish the provisional address as structured business contact data.
  if (contactEmail?.trim() && !/@example\.com$/i.test(contactEmail.trim())) schema.email = contactEmail.trim();
  return schema;
}

function breadcrumbs(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], index) => ({
      "@type": "ListItem", position: index + 1, name, item: canonicalUrl(path),
    })),
  };
}

function baseMetadata(title, description, path = null, robots = INDEX) {
  return {
    title, description, robots,
    canonical: path ? canonicalUrl(path) : null,
    image: SITE_IMAGE,
    imageAlt: SITE_NAME,
    imageWidth: 1254,
    imageHeight: 1254,
    type: "website",
    twitterCard: "summary", // The existing institutional image is a square logo.
    structuredData: null,
  };
}

export function getPageMetadata(path, { contactEmail } = {}) {
  const normalized = normalizePath(path);
  if (isAdminPath(normalized)) {
    return baseMetadata(`Administración | ${SITE_NAME}`, "Acceso del personal autorizado de Del Giorgio Maquinarias.", null, NOINDEX);
  }
  if (isProductPath(normalized)) return productShellMetadata();
  const canonicalPath = normalized === "/faq" ? "/preguntas-frecuentes" : normalized;
  const page = PUBLIC_PAGES[canonicalPath];
  if (!page) return notFoundMetadata();
  const metadata = baseMetadata(page.title, page.description, canonicalPath);
  const graph = [];
  if (canonicalPath === "/" || canonicalPath === "/contacto") graph.push(businessSchema(contactEmail));
  if (canonicalPath === "/") {
    graph.push({ "@type": "WebSite", "@id": `${SITE_URL}/#sitio`, url: `${SITE_URL}/`, name: SITE_NAME, inLanguage: "es-AR", publisher: { "@id": `${SITE_URL}/#negocio` } });
  } else {
    graph.push(breadcrumbs([["Inicio", "/"], [page.label, canonicalPath]]));
  }
  metadata.structuredData = { "@context": "https://schema.org", "@graph": graph };
  return metadata;
}

export function productShellMetadata() {
  // No home canonical on the shared HTML served for dynamic Firestore products.
  // Do not emit initial noindex: crawlers must be able to render and load the product.
  return baseMetadata(`Maquinaria agrícola | ${SITE_NAME}`, "Conocé la ficha de maquinaria de Del Giorgio Maquinarias y consultá sus características y disponibilidad directamente con la empresa.");
}

export function notFoundMetadata() {
  return baseMetadata(`Página no encontrada | ${SITE_NAME}`, "La página solicitada no está disponible. Visitá el catálogo o los canales de contacto de Del Giorgio Maquinarias.", null, NOINDEX);
}

const cleanText = (value) => typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
const shorten = (value) => value.length > 165 ? `${value.slice(0, 162).trimEnd()}…` : value;

function publicImage(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  if (!value.startsWith("/") && !/^https:\/\//i.test(value)) return null;
  try {
    const url = new URL(value, SITE_URL);
    if (url.protocol !== "https:" || /^(localhost|127\.0\.0\.1|\[::1\]|del-giorgio-maquinarias\.web\.app)$/i.test(url.hostname)) return null;
    // Only normalize our own redirected host; preserve external Storage URLs and tokens.
    const site = new URL(SITE_URL);
    if (url.hostname === site.hostname.replace(/^www\./, "")) url.host = site.host;
    return url.href;
  } catch { return null; }
}

export function getProductMetadata({ id, product, loading = false, notFound = false }) {
  if (notFound) return notFoundMetadata();
  if (loading || !product || product.id !== id) return productShellMetadata();
  if (product.status !== "Publicado") {
    return baseMetadata(`Maquinaria no publicada | ${SITE_NAME}`, "Consultá nuestro catálogo público de maquinaria y los medios de contacto de Del Giorgio Maquinarias.", null, NOINDEX);
  }
  const name = cleanText(product.name);
  if (!name) return baseMetadata(`Maquinaria | ${SITE_NAME}`, "Consultá a Del Giorgio Maquinarias por los equipos de su catálogo.", null, NOINDEX);
  const brand = cleanText(product.brand);
  const titleName = brand && !name.toLocaleLowerCase("es").includes(brand.toLocaleLowerCase("es")) ? `${name} ${brand}` : name;
  const detail = Array.isArray(product.detail) ? product.detail.map(cleanText).filter(Boolean).join(" ") : "";
  const facts = [name, brand && `Marca: ${brand}`, cleanText(product.condition), product.year && `Año ${product.year}`].filter(Boolean).join(". ");
  const description = shorten(detail ? `${name}. ${detail}` : `${facts}. Consultá características y disponibilidad en ${SITE_NAME}.`);
  const path = `/maquinaria/${encodeURIComponent(id)}`;
  const metadata = baseMetadata(`${titleName} | ${SITE_NAME}`, description, path);
  const image = Array.isArray(product.images) ? product.images.map(publicImage).find(Boolean) : null;
  if (image) {
    metadata.image = image;
    metadata.imageAlt = name;
    // Dimensions aren't stored in Firestore; don't invent them or a landscape crop.
    delete metadata.imageWidth;
    delete metadata.imageHeight;
  }
  metadata.structuredData = {
    "@context": "https://schema.org",
    "@graph": [breadcrumbs([["Inicio", "/"], ["Catálogo", "/catalogo"], [name, path]])],
  };
  return metadata;
}
