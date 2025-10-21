import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/app/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/auth': { target: 'https://auth-fake.com', changeOrigin: true },
      '/ticket': { target: 'https://ticketing-fake.com', changeOrigin: true },
      '/payment': { target: 'https://payment-fake.com', changeOrigin: true },
      '/verification': { target: 'https://verification-fake.com', changeOrigin: true },
    },
  },
})
