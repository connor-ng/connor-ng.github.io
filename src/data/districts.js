/**
 * San Francisco districts — used for project attribution, labels, and tools.
 * Live map shows quiet place-name labels only (no box overlays).
 * Grid bounds kept for legacy pixel mode.
 */

/** @typedef {[number, number]} LngLat */

/**
 * @typedef {Object} District
 * @property {string} id
 * @property {string} name
 * @property {[number, number, number]} color
 * @property {LngLat[]} polygon - closed ring [lng, lat] for hit-testing / tools
 * @property {{ x: number, y: number, w: number, h: number }} bounds
 * @property {string} flavor
 * @property {string} pattern
 * @property {number} order
 * @property {boolean} [popular] - show a place-name label on the map
 * @property {number} [labelLat]
 * @property {number} [labelLng]
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

const INK = [210, 204, 188]

/** @type {District[]} */
const districts = [
  {
    id: 'marina',
    name: 'Marina',
    color: INK,
    polygon: rect(-122.448, -122.425, 37.798, 37.808),
    bounds: { x: 52, y: 14, w: 78, h: 50 },
    flavor: 'Yacht harbor, cream row houses.',
    pattern: 'wide-avenues',
    order: 1,
    popular: true,
    labelLat: 37.803,
    labelLng: -122.436,
  },
  {
    id: 'presidio',
    name: 'Presidio',
    color: INK,
    polygon: rect(-122.51, -122.448, 37.788, 37.81),
    bounds: { x: 40, y: 10, w: 50, h: 40 },
    flavor: 'Golden Gate approaches, eucalyptus ridges.',
    pattern: 'wide-avenues',
    order: 2,
    popular: true,
    labelLat: 37.798,
    labelLng: -122.47,
  },
  {
    id: 'northern-waterfront',
    name: 'North Beach',
    color: INK,
    polygon: rect(-122.42, -122.395, 37.795, 37.81),
    bounds: { x: 128, y: 12, w: 88, h: 42 },
    flavor: 'Fisherman’s Wharf, North Beach.',
    pattern: 'curved-shore',
    order: 3,
    popular: true,
    labelLat: 37.802,
    labelLng: -122.41,
  },
  {
    id: 'richmond',
    name: 'Richmond District',
    color: INK,
    polygon: rect(-122.513, -122.455, 37.772, 37.788),
    bounds: { x: 18, y: 42, w: 72, h: 40 },
    flavor: 'Fog-muted avenues west of the park.',
    pattern: 'uniform-rows',
    order: 4,
    popular: true,
    labelLat: 37.78,
    labelLng: -122.48,
  },
  {
    id: 'western-addition',
    name: 'Western Addition',
    color: INK,
    polygon: rect(-122.445, -122.42, 37.775, 37.79),
    bounds: { x: 72, y: 52, w: 48, h: 40 },
    flavor: 'Fillmore corridor between the park and downtown.',
    pattern: 'hilly-grid',
    order: 5,
    popular: true,
    labelLat: 37.782,
    labelLng: -122.432,
  },
  {
    id: 'fidi',
    name: 'Downtown',
    color: INK,
    polygon: rect(-122.415, -122.39, 37.785, 37.798),
    bounds: { x: 148, y: 52, w: 72, h: 46 },
    flavor: 'Financial District and Union Square.',
    pattern: 'tight-grid',
    order: 6,
    popular: true,
    labelLat: 37.791,
    labelLng: -122.402,
  },
  {
    id: 'sunset',
    name: 'Sunset District',
    color: INK,
    polygon: rect(-122.513, -122.455, 37.73, 37.765),
    bounds: { x: 14, y: 112, w: 76, h: 68 },
    flavor: 'Ocean Beach grid dissolving into fog.',
    pattern: 'fog-gradient',
    order: 7,
    popular: true,
    labelLat: 37.748,
    labelLng: -122.485,
  },
  {
    id: 'castro',
    name: 'Castro',
    color: INK,
    polygon: rect(-122.445, -122.425, 37.755, 37.77),
    bounds: { x: 72, y: 82, w: 48, h: 44 },
    flavor: 'Victorian peaks, Twin Peaks ridge.',
    pattern: 'hilly-grid',
    order: 8,
    popular: true,
    labelLat: 37.762,
    labelLng: -122.435,
  },
  {
    id: 'mission',
    name: 'Mission',
    color: INK,
    polygon: rect(-122.425, -122.405, 37.748, 37.77),
    bounds: { x: 108, y: 88, w: 68, h: 54 },
    flavor: 'Valencia corridor, mural color accents.',
    pattern: 'diagonal-grid',
    order: 9,
    popular: true,
    labelLat: 37.754,
    labelLng: -122.419,
  },
  {
    id: 'bayview',
    name: 'Bayview District',
    color: INK,
    polygon: rect(-122.405, -122.375, 37.72, 37.745),
    bounds: { x: 152, y: 128, w: 78, h: 50 },
    flavor: 'Industrial waterfront, wider blocks.',
    pattern: 'industrial',
    order: 10,
    popular: true,
    labelLat: 37.732,
    labelLng: -122.39,
  },
]

export default districts
