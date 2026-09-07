/**
 * San Francisco district zones — non-overlapping geographic boxes (lng, lat).
 * Rectilinear partition of the peninsula; shared edges only, no interior overlap.
 * Colors are kept for legacy pixel/sidebar accents; the live map draws monochrome boxes.
 * Grid bounds kept for legacy pixel mode.
 */

/** @typedef {[number, number]} LngLat */

/**
 * @typedef {Object} District
 * @property {string} id
 * @property {string} name
 * @property {[number, number, number]} color
 * @property {LngLat[]} polygon - closed ring [lng, lat]
 * @property {{ x: number, y: number, w: number, h: number }} bounds
 * @property {string} flavor
 * @property {string} pattern
 * @property {number} order
 * @property {boolean} [popular] - stronger box outline for well-known neighborhoods
 */

/** @param {number} lngMin @param {number} lngMax @param {number} latMin @param {number} latMax */
function rect(lngMin, lngMax, latMin, latMax) {
  return [
    [lngMin, latMax],
    [lngMax, latMax],
    [lngMax, latMin],
    [lngMin, latMin],
    [lngMin, latMax],
  ]
}

/** Shared monochrome accent for sidebar/pixel mode (map boxes ignore this). */
const INK = [210, 204, 188]

/** @type {District[]} */
const districts = [
  {
    id: 'marina',
    name: 'Marina & Presidio',
    color: INK,
    polygon: rect(-122.513, -122.445, 37.788, 37.811),
    bounds: { x: 52, y: 14, w: 78, h: 50 },
    flavor: 'Cream row houses, yacht harbor, Golden Gate towers to the west.',
    pattern: 'wide-avenues',
    order: 1,
    popular: true,
  },
  {
    id: 'northern-waterfront',
    name: 'Northern Waterfront',
    color: INK,
    polygon: rect(-122.445, -122.385, 37.788, 37.811),
    bounds: { x: 128, y: 12, w: 88, h: 42 },
    flavor: 'Fisherman’s Wharf, North Beach — warm stone, curved shoreline.',
    pattern: 'curved-shore',
    order: 2,
    popular: true,
  },
  {
    id: 'richmond',
    name: 'Richmond District',
    color: INK,
    polygon: rect(-122.513, -122.445, 37.768, 37.788),
    bounds: { x: 18, y: 42, w: 72, h: 40 },
    flavor: 'Fog-muted avenues west of the park.',
    pattern: 'uniform-rows',
    order: 3,
    popular: true,
  },
  {
    id: 'western-addition',
    name: 'Western Addition',
    color: INK,
    polygon: rect(-122.445, -122.418, 37.768, 37.788),
    bounds: { x: 72, y: 52, w: 48, h: 40 },
    flavor: 'Fillmore corridor between the park and downtown.',
    pattern: 'hilly-grid',
    order: 4,
  },
  {
    id: 'fidi',
    name: 'FiDi & Downtown',
    color: INK,
    polygon: rect(-122.418, -122.385, 37.768, 37.788),
    bounds: { x: 148, y: 52, w: 72, h: 46 },
    flavor: 'Tight vertical grid, cool gray stone, window glow at dusk.',
    pattern: 'tight-grid',
    order: 5,
    popular: true,
  },
  {
    id: 'sunset',
    name: 'Sunset District',
    color: INK,
    polygon: rect(-122.513, -122.445, 37.735, 37.768),
    bounds: { x: 14, y: 112, w: 76, h: 68 },
    flavor: 'Regular grid dissolving into fog; Ocean Beach sand strip.',
    pattern: 'fog-gradient',
    order: 6,
    popular: true,
  },
  {
    id: 'castro',
    name: 'Castro & Haight',
    color: INK,
    polygon: rect(-122.445, -122.418, 37.752, 37.768),
    bounds: { x: 72, y: 82, w: 48, h: 44 },
    flavor: 'Victorian peaks, pastel highlights.',
    pattern: 'hilly-grid',
    order: 7,
    popular: true,
  },
  {
    id: 'mission',
    name: 'Mission District',
    color: INK,
    polygon: rect(-122.418, -122.385, 37.735, 37.768),
    bounds: { x: 108, y: 88, w: 68, h: 54 },
    flavor: 'Terracotta roofs, diagonal grid, mural color accents.',
    pattern: 'diagonal-grid',
    order: 8,
    popular: true,
  },
  {
    id: 'excelsior',
    name: 'Excelsior & Outer Mission',
    color: INK,
    polygon: rect(-122.445, -122.405, 37.708, 37.735),
    bounds: { x: 90, y: 130, w: 60, h: 40 },
    flavor: 'Southern corridors toward the county line.',
    pattern: 'uniform-rows',
    order: 9,
  },
  {
    id: 'bayview',
    name: 'Bayview District',
    color: INK,
    polygon: rect(-122.405, -122.368, 37.708, 37.735),
    bounds: { x: 152, y: 128, w: 78, h: 50 },
    flavor: 'Industrial waterfront, cranes, wider blocks.',
    pattern: 'industrial',
    order: 10,
    popular: true,
  },
]

export default districts
