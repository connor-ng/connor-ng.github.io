/**
 * Prefix a public/ asset path with Vite's base (needed on GitHub Pages project sites).
 * @param {string} path - absolute or relative path, e.g. '/projects/cft.png'
 */
export function publicUrl(path = '') {
  const base = import.meta.env.BASE_URL || '/'
  const clean = String(path).replace(/^\//, '')
  return `${base}${clean}`
}
