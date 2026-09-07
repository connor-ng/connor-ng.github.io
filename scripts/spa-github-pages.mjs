import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

/**
 * Post-build helpers for static hosts (Netlify / GitHub Pages):
 * 1. Copy MapLibre worker next to the bundle path MapLibre requests
 * 2. Copy index.html → 404.html for GitHub Pages SPA routes
 */
const root = process.cwd()
const dist = resolve(root, 'dist')
const indexHtml = resolve(dist, 'index.html')
const notFoundHtml = resolve(dist, '404.html')
const workerSrc = resolve(
  root,
  'node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs',
)
const workerDest = resolve(dist, 'assets/maplibre-gl-worker.mjs')

if (!existsSync(indexHtml)) {
  console.error('dist/index.html missing — run vite build first')
  process.exit(1)
}

if (!existsSync(workerSrc)) {
  console.error('maplibre-gl worker missing — run npm install')
  process.exit(1)
}

mkdirSync(dirname(workerDest), { recursive: true })
copyFileSync(workerSrc, workerDest)
console.log('Copied MapLibre worker → dist/assets/maplibre-gl-worker.mjs')

copyFileSync(indexHtml, notFoundHtml)
console.log('Copied dist/index.html → dist/404.html for GitHub Pages SPA routes')
