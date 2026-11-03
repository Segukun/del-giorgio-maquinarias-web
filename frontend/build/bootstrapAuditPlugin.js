// Diagnostic build artifact only; Firebase's existing **/.* ignore excludes .vite.
export default function bootstrapAuditPlugin() {
  return {
    name: "bootstrap-dependency-audit",
    enforce: "post",
    generateBundle: { order: "post", handler(_options, bundle) {
      const chunks = Object.values(bundle).filter((item) => item.type === "chunk");
      this.emitFile({
        type: "asset", fileName: ".vite/bootstrap-audit.json",
        source: JSON.stringify(chunks.map((chunk) => ({
          file: chunk.fileName,
          imports: chunk.imports,
          dynamicImports: chunk.dynamicImports,
          modules: Object.keys(chunk.modules).map((id) => id.replaceAll("\\", "/").replace(/^.*\/(src|node_modules)\//, "$1/")),
        })), null, 2),
      });
    } },
  };
}
