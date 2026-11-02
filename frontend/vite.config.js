import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import seoPlugin from "./build/seoPlugin.js";

export default defineConfig({
  plugins: [react(), seoPlugin()],
});
