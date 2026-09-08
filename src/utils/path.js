/** Strip trailing slashes so `/about/` and `/about` match the same route checks. */
export function normalizePath(pathname) {
  if (!pathname) return '/'
  const trimmed = pathname.replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}
