import { ADMIN_PATHS, PUBLIC_PAGES, getPageMetadata, isAdminPath, productShellMetadata } from "../src/seo/metadata.js";
import { replaceSeoHead } from "../src/seo/head.js";
import { CONTACT_EMAIL } from "../src/config/contact.js";

// Build-time HTML heads, not server rendering: every document loads the same React SPA.
export default function seoPlugin() {
  let config;
  const options = () => ({ contactEmail: config.env.VITE_CONTACT_EMAIL?.trim() || CONTACT_EMAIL });
  return {
    name: "del-giorgio-seo",
    enforce: "post",
    configResolved(resolved) { config = resolved; },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (isAdminPath(request.url)) response.setHeader("X-Robots-Tag", "noindex, nofollow");
        next();
      });
    },
    transformIndexHtml: {
      order: "post",
      handler(html, context) {
        const path = config.command === "build" ? "/" : context.originalUrl || context.path;
        return replaceSeoHead(html, getPageMetadata(path, options()));
      },
    },
    generateBundle: {
      order: "post",
      handler(_options, bundle) {
        const index = bundle["index.html"];
        if (!index || index.type !== "asset") throw new Error("No se generó index.html para preparar el SEO.");
        const html = String(index.source);
        for (const path of [...Object.keys(PUBLIC_PAGES).filter((path) => path !== "/"), "/faq", ...ADMIN_PATHS]) {
          this.emitFile({ type: "asset", fileName: `${path.slice(1)}.html`, source: replaceSeoHead(html, getPageMetadata(path, options())) });
        }
        this.emitFile({ type: "asset", fileName: "__seo/product.html", source: replaceSeoHead(html, productShellMetadata()) });
        this.emitFile({ type: "asset", fileName: "__seo/admin.html", source: replaceSeoHead(html, getPageMetadata("/admin")) });
      },
    },
  };
}
