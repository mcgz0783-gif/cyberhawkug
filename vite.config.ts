import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";
import vitePrerender from "vite-plugin-prerender";

const PRERENDER_ROUTES = [
  "/",
  "/about",
  "/store",
  "/blog",
  "/contact",
  "/legal/terms",
  "/legal/privacy",
  "/legal/refund",
];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && vitePrerender({
      staticDir: path.join(__dirname, "dist"),
      routes: PRERENDER_ROUTES,
      renderer: {
        headless: true,
        renderAfterDocumentEvent: "render-event",
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-recharts': ['recharts'],
          'vendor-ui': ['framer-motion', 'sonner', 'cmdk'],
        },
      },
    },
  },
}));
