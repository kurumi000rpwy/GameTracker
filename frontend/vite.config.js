import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Puerto para React
    proxy: {
      '/api': 'http://localhost:8080' // Redirige las peticiones del frontend al backend
    }
  }
})
