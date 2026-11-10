
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  resolve: {
    alias: {
      // 🟢 Waxaan u beddelnay 'import.meta.dirname' mar haddii "type": "module" ay shidantahay
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    // 🟢 Waxay Render ku khasbaysaa in galka 'dist' si qasab ah loo dhalshon
    outDir: 'dist', 
    emptyOutDir: true
  }
})
