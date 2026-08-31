import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
  server: {
    port: 43123,
    host: '0.0.0.0',
    strictPort: true,
  },
  preview: {
    port: 43123,
    host: '0.0.0.0',
    strictPort: true,
  },
})
