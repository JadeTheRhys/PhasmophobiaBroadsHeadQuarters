import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Get the repository name for GitHub Pages base path
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repoName = process.env.REPO_NAME || 'PhasmophobiaBroadsHeadQuarters';

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  // Set base path for GitHub Pages deployment
  base: isGitHubPages ? `/${repoName}/` : '/',
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  envDir: path.resolve(import.meta.dirname),
  build: {
    // Output to /docs for GitHub Pages when GITHUB_PAGES env is set
    outDir: isGitHubPages 
      ? path.resolve(import.meta.dirname, "docs")
      : path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  // Serve assets folder in development
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
      // Allow access to assets folder
      allow: [
        path.resolve(import.meta.dirname, "client"),
        path.resolve(import.meta.dirname, "assets"),
        path.resolve(import.meta.dirname, "shared"),
      ],
    },
  },
});
