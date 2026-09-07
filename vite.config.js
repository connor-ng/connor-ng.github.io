import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub user site (username.github.io) → base '/'
// GitHub project site (username.github.io/repo) → base '/repo/'
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  base,
  plugins: [react()],
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
