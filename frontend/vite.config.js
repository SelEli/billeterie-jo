import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/auth': { target: 'https://auth-production-89f5.up.railway.app', changeOrigin: true },
      '/ticket': { target: 'https://ticketing-production-af26.up.railway.app', changeOrigin: true },
      '/payment': { target: 'https://payment-production-8baf.up.railway.app', changeOrigin: true },
      '/verification': { target: 'https://verification-production.up.railway.app', changeOrigin: true },
    },
  },
})
