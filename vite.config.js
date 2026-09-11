import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'https://edigitalbackend-4twu.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: 'https://edigitalbackend-4twu.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
