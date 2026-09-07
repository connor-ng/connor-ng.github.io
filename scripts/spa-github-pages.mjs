import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

/**
 * Post-build helpers for static hosts (Netlify / GitHub Pages):
 * 1. Copy MapLibre ESM worker + shared chunk (worker imports ./maplibre-gl-shared.mjs)
 * 2. Copy index.html → 404.html for GitHub Pages SPA routes
 */
const root = process.cwd()
const dist = resolve(root, 'dist')
const indexHtml = resolve(dist, 'index.html')
const notFoundHtml = resolve(dist, '404.html')
const assetsDir = resolve(dist, 'assets')

const maplibreFiles = [
  'maplibre-gl-worker.mjs',
  'maplibre-gl-shared.mjs',
]

if (!existsSync(indexHtml)) {
  console.error('dist/index.html missing — run vite build first')
  process.exit(1)
}

mkdirSync(assetsDir, { recursive: true })

for (const file of maplibreFiles) {
  const src = resolve(root, 'node_modules/maplibre-gl/dist', file)
  const dest = resolve(assetsDir, file)
  if (!existsSync(src)) {
    console.error(`Missing ${src} — run npm install`)
    process.exit(1)
  }
  copyFileSync(src, dest)
  console.log(`Copied MapLibre ${file} → dist/assets/${file}`)
}

copyFileSync(indexHtml, notFoundHtml)
console.log('Copied dist/index.html → dist/404.html for GitHub Pages SPA routes')
