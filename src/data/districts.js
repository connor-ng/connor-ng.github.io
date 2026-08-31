/**
 * San Francisco district zones — geographic polygons (lng, lat).
 * Used for map overlays; grid bounds kept for legacy pixel mode.
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

/** @type {District[]} */
const districts = [
  {
    id: 'marina',
    name: 'Marina & Presidio',
    color: [218, 188, 138],
    polygon: [
      [-122.513, 37.808],
      [-122.472, 37.808],
      [-122.455, 37.798],
      [-122.448, 37.782],
      [-122.458, 37.768],
      [-122.488, 37.762],
      [-122.513, 37.778],
      [-122.513, 37.808],
    ],
    bounds: { x: 52, y: 14, w: 78, h: 50 },
    flavor: 'Cream row houses, yacht harbor, Golden Gate towers to the west.',
    pattern: 'wide-avenues',
    order: 1,
  },
  {
    id: 'northern-waterfront',
    name: 'Northern Waterfront',
    color: [228, 138, 88],
    polygon: [
      [-122.448, 37.808],
      [-122.368, 37.808],
      [-122.368, 37.778],
      [-122.395, 37.768],
      [-122.418, 37.772],
      [-122.438, 37.785],
      [-122.448, 37.798],
      [-122.448, 37.808],
    ],
    bounds: { x: 128, y: 12, w: 88, h: 42 },
    flavor: 'Fisherman’s Wharf, North Beach — warm stone, curved shoreline.',
    pattern: 'curved-shore',
    order: 2,
  },
  {
    id: 'fidi',
    name: 'FiDi & Downtown',
    color: [108, 128, 168],
    polygon: [
      [-122.418, 37.798],
      [-122.395, 37.792],
      [-122.388, 37.778],
      [-122.395, 37.758],
      [-122.412, 37.752],
      [-122.428, 37.758],
      [-122.432, 37.772],
      [-122.418, 37.798],
    ],
    bounds: { x: 148, y: 52, w: 72, h: 46 },
    flavor: 'Tight vertical grid, cool gray stone, window glow at dusk.',
    pattern: 'tight-grid',
    order: 3,
  },
  {
    id: 'embarcadero',
    name: 'Embarcadero',
    color: [72, 158, 198],
    polygon: [
      [-122.388, 37.798],
      [-122.368, 37.808],
      [-122.368, 37.728],
      [-122.382, 37.718],
      [-122.392, 37.728],
      [-122.395, 37.758],
      [-122.388, 37.778],
      [-122.388, 37.798],
    ],
    bounds: { x: 198, y: 48, w: 58, h: 88 },
    flavor: 'Piers into the bay, Ferry Building cupola.',
    pattern: 'piers',
    order: 4,
  },
  {
    id: 'western',
    name: 'Western Neighborhoods',
    color: [88, 178, 108],
    polygon: [
      [-122.513, 37.778],
      [-122.458, 37.768],
      [-122.448, 37.782],
      [-122.438, 37.785],
      [-122.428, 37.758],
      [-122.448, 37.738],
      [-122.488, 37.728],
      [-122.513, 37.738],
      [-122.513, 37.778],
    ],
    bounds: { x: 18, y: 42, w: 72, h: 78 },
    flavor: 'Richmond & Inner Sunset — fog-muted row houses, Golden Gate Park.',
    pattern: 'uniform-rows',
    order: 5,
  },
  {
    id: 'mission',
    name: 'Mission District',
    color: [228, 108, 68],
    polygon: [
      [-122.432, 37.772],
      [-122.412, 37.768],
      [-122.398, 37.752],
      [-122.405, 37.738],
      [-122.418, 37.728],
      [-122.438, 37.732],
      [-122.448, 37.748],
      [-122.432, 37.772],
    ],
    bounds: { x: 108, y: 88, w: 68, h: 54 },
    flavor: 'Terracotta roofs, diagonal grid, mural color accents.',
    pattern: 'diagonal-grid',
    order: 6,
  },
  {
    id: 'castro',
    name: 'Castro & Haight',
    color: [198, 128, 188],
    polygon: [
      [-122.448, 37.778],
      [-122.428, 37.772],
      [-122.418, 37.758],
      [-122.428, 37.748],
      [-122.448, 37.738],
      [-122.458, 37.748],
      [-122.458, 37.768],
      [-122.448, 37.778],
    ],
    bounds: { x: 72, y: 82, w: 48, h: 44 },
    flavor: 'Victorian peaks, pastel highlights.',
    pattern: 'hilly-grid',
    order: 7,
  },
  {
    id: 'sunset',
    name: 'Sunset & Ocean Beach',
    color: [118, 148, 208],
    polygon: [
      [-122.513, 37.738],
      [-122.488, 37.728],
      [-122.448, 37.738],
      [-122.458, 37.748],
      [-122.448, 37.768],
      [-122.458, 37.768],
      [-122.488, 37.762],
      [-122.513, 37.762],
      [-122.513, 37.708],
      [-122.513, 37.738],
    ],
    bounds: { x: 14, y: 112, w: 76, h: 68 },
    flavor: 'Regular grid dissolving into fog; Ocean Beach sand strip.',
    pattern: 'fog-gradient',
    order: 8,
  },
  {
    id: 'bayview',
    name: 'Bayview & Dogpatch',
    color: [178, 138, 88],
    polygon: [
      [-122.398, 37.752],
      [-122.382, 37.718],
      [-122.368, 37.728],
      [-122.368, 37.708],
      [-122.395, 37.708],
      [-122.418, 37.718],
      [-122.418, 37.728],
      [-122.405, 37.738],
      [-122.398, 37.752],
    ],
    bounds: { x: 152, y: 128, w: 78, h: 50 },
    flavor: 'Industrial waterfront, cranes, wider blocks.',
    pattern: 'industrial',
    order: 9,
  },
]

export default districts
