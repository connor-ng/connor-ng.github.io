import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * GitHub Pages has no SPA fallback. Copying index.html → 404.html means
 * /about and /contact still load the app instead of a hard 404.
 */
const dist = resolve(process.cwd(), 'dist')
const indexHtml = resolve(dist, 'index.html')
const notFoundHtml = resolve(dist, '404.html')

if (!existsSync(indexHtml)) {
  console.error('dist/index.html missing — run vite build first')
  process.exit(1)
}

copyFileSync(indexHtml, notFoundHtml)
console.log('Copied dist/index.html → dist/404.html for GitHub Pages SPA routes')
