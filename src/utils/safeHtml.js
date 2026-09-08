/** Escape text for safe insertion into HTML templates. */
export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

/**
 * Allow only http(s) or site-relative paths in href/src attributes.
 * Rejects javascript:, data:, etc.
 */
export function safeUrl(value) {
  if (value == null) return ''
  const raw = String(value).trim()
  if (!raw) return ''
  if (raw.startsWith('/') && !raw.startsWith('//')) return raw
  try {
    const url = new URL(raw, 'https://example.invalid')
    if (url.protocol === 'http:' || url.protocol === 'https:') return raw
  } catch {
    return ''
  }
  return ''
}
