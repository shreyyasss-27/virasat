import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: import.meta.env.MODE === 'development' ? {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    } : undefined,
  },
  preview: {
    allowedHosts: ['virasat-frontend-production.up.railway.app', '.up.railway.app'],
    host: true,
    port: 3000
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
