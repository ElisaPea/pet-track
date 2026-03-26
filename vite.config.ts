/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true, // Permite usar 'describe' y 'it' sin importarlos
    environment: "jsdom", // Simula un navegador para probar componentes
    setupFiles: "./src/setupTests.ts", // Archivo para configurar extensiones
  },
});
