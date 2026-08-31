/**
 * San Francisco district zones — non-overlapping geographic polygons (lng, lat).
 * Rectilinear partition of the peninsula; shared edges only, no interior overlap.
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

/** @type {District[]} */
const districts = [
  {
    id: 'marina',
    name: 'Marina & Presidio',
    color: [232, 198, 142],
    polygon: rect(-122.513, -122.445, 37.775, 37.808),
    bounds: { x: 52, y: 14, w: 78, h: 50 },
    flavor: 'Cream row houses, yacht harbor, Golden Gate towers to the west.',
    pattern: 'wide-avenues',
    order: 1,
  },
  {
    id: 'northern-waterfront',
    name: 'Northern Waterfront',
    color: [238, 148, 92],
    polygon: rect(-122.445, -122.385, 37.775, 37.808),
    bounds: { x: 128, y: 12, w: 88, h: 42 },
    flavor: 'Fisherman’s Wharf, North Beach — warm stone, curved shoreline.',
    pattern: 'curved-shore',
    order: 2,
  },
  {
    id: 'embarcadero',
    name: 'Embarcadero',
    color: [82, 178, 228],
    polygon: rect(-122.385, -122.368, 37.718, 37.808),
    bounds: { x: 198, y: 48, w: 58, h: 88 },
    flavor: 'Piers into the bay, Ferry Building cupola.',
    pattern: 'piers',
    order: 3,
  },
  {
    id: 'western',
    name: 'Western Neighborhoods',
    color: [98, 198, 118],
    polygon: rect(-122.513, -122.435, 37.728, 37.775),
    bounds: { x: 18, y: 42, w: 72, h: 78 },
    flavor: 'Richmond & Inner Sunset — fog-muted row houses, Golden Gate Park.',
    pattern: 'uniform-rows',
    order: 4,
  },
  {
    id: 'castro',
    name: 'Castro & Haight',
    color: [212, 138, 202],
    polygon: rect(-122.435, -122.418, 37.728, 37.775),
    bounds: { x: 72, y: 82, w: 48, h: 44 },
    flavor: 'Victorian peaks, pastel highlights.',
    pattern: 'hilly-grid',
    order: 5,
  },
  {
    id: 'fidi',
    name: 'FiDi & Downtown',
    color: [108, 128, 168],
    polygon: rect(-122.418, -122.385, 37.728, 37.775),
    bounds: { x: 148, y: 52, w: 72, h: 46 },
    flavor: 'Tight vertical grid, cool gray stone, window glow at dusk.',
    pattern: 'tight-grid',
    order: 6,
  },
  {
    id: 'mission',
    name: 'Mission District',
    color: [238, 118, 72],
    polygon: rect(-122.418, -122.385, 37.708, 37.728),
    bounds: { x: 108, y: 88, w: 68, h: 54 },
    flavor: 'Terracotta roofs, diagonal grid, mural color accents.',
    pattern: 'diagonal-grid',
    order: 7,
  },
  {
    id: 'sunset',
    name: 'Sunset & Ocean Beach',
    color: [128, 162, 228],
    polygon: rect(-122.513, -122.435, 37.708, 37.728),
    bounds: { x: 14, y: 112, w: 76, h: 68 },
    flavor: 'Regular grid dissolving into fog; Ocean Beach sand strip.',
    pattern: 'fog-gradient',
    order: 8,
  },
  {
    id: 'bayview',
    name: 'Bayview & Dogpatch',
    color: [192, 152, 98],
    polygon: rect(-122.385, -122.368, 37.708, 37.718),
    bounds: { x: 152, y: 128, w: 78, h: 50 },
    flavor: 'Industrial waterfront, cranes, wider blocks.',
    pattern: 'industrial',
    order: 9,
  },
]

export default districts
