/**
 * Tag convention for every project (lock this; don’t invent new lanes).
 *
 * Always use up to 3 tags, in this order:
 *   1. Domain   — industry / subject area strangers recognize
 *   2. Use case — what people do with it (job-to-be-done)
 *   3. Format   — how it’s delivered (pick from FORMAT_TAGS)
 *
 * Do NOT put these in tags (they already have fields):
 *   - personal / school / work  → use `type`
 *   - “Product”, role, dates    → use `roleAndTimeframe`
 *   - stack jargon / methodology → keep in description / popupBlurb
 *
 * Examples:
 *   Consistency → ['Fitness', 'Habit tracking', 'Mobile / web app']
 *   Campus tool → ['Education', 'Scheduling', 'Web app']
 *   Internship  → ['Marketplace', 'Operations', 'Web app']
 */

/** Controlled format lane — reuse these strings when possible. */
export const FORMAT_TAGS = [
  'Mobile / web app',
  'Web app',
  'Mobile app',
  'Desktop app',
  'API',
  'Prototype',
  'Research',
]

/**
 * @param {string[]} tags
 * @returns {string[]}
 */
export function normalizeProjectTags(tags = []) {
  return tags.filter(Boolean).slice(0, 3)
}
