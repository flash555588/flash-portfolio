import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: resolve(import.meta.dirname, "github-pages"),
  base: process.env.GITHUB_PAGES === "true" ? "/flash-portfolio/" : "/",
  publicDir: resolve(import.meta.dirname, "public"),
  build: {
    outDir: resolve(import.meta.dirname, "pages-dist"),
    emptyOutDir: true,
    assetsDir: "assets",
  },
});
