/**
 * San Francisco district zones for the project atlas.
 *
 * Coordinates use the map grid (256×192 tiles, 10px each).
 * Bounds are painting guides for the hand-drawn `public/map/world.png`
 * asset — adjust as the art takes shape.
 *
 * @typedef {Object} DistrictBounds
 * @property {number} x - left edge (grid x)
 * @property {number} y - top edge (grid y, north)
 * @property {number} w - width in tiles
 * @property {number} h - height in tiles
 *
 * @typedef {Object} District
 * @property {string} id
 * @property {string} name
 * @property {[number, number, number]} color - RGB base fill for sidebar swatch
 * @property {DistrictBounds} bounds
 * @property {string} flavor - short art-direction note
 * @property {string} pattern - street pattern cue for painting
 * @property {number} order - sidebar sort order (north → south)
 */

/** @type {District[]} */
const districts = [
  {
    id: 'marina',
    name: 'Marina & Presidio',
    color: [200, 192, 168],
    bounds: { x: 52, y: 14, w: 78, h: 50 },
    flavor: 'Cream row houses, yacht harbor, Golden Gate towers to the west.',
    pattern: 'wide-avenues',
    order: 1,
  },
  {
    id: 'northern-waterfront',
    name: 'Northern Waterfront',
    color: [184, 148, 120],
    bounds: { x: 128, y: 12, w: 88, h: 42 },
    flavor: 'Fisherman’s Wharf, North Beach — warm stone, curved shoreline, pier fingers.',
    pattern: 'curved-shore',
    order: 2,
  },
  {
    id: 'fidi',
    name: 'FiDi & Downtown',
    color: [106, 112, 122],
    bounds: { x: 148, y: 52, w: 72, h: 46 },
    flavor: 'Tight vertical grid, cool gray stone, window glow at dusk.',
    pattern: 'tight-grid',
    order: 3,
  },
  {
    id: 'embarcadero',
    name: 'Embarcadero',
    color: [92, 108, 118],
    bounds: { x: 198, y: 48, w: 58, h: 88 },
    flavor: 'Long piers into the bay, Ferry Building cupola, horizontal waterfront rhythm.',
    pattern: 'piers',
    order: 4,
  },
  {
    id: 'western',
    name: 'Western Neighborhoods',
    color: [138, 148, 132],
    bounds: { x: 18, y: 42, w: 72, h: 78 },
    flavor: 'Richmond & Inner Sunset — fog-muted row houses, Golden Gate Park green strip.',
    pattern: 'uniform-rows',
    order: 5,
  },
  {
    id: 'mission',
    name: 'Mission District',
    color: [168, 108, 72],
    bounds: { x: 108, y: 88, w: 68, h: 54 },
    flavor: 'Terracotta roofs, diagonal grid, mural color accents.',
    pattern: 'diagonal-grid',
    order: 6,
  },
  {
    id: 'castro',
    name: 'Castro & Haight',
    color: [148, 118, 138],
    bounds: { x: 72, y: 82, w: 48, h: 44 },
    flavor: 'Victorian peaks, pastel highlights, hillier blocks west of downtown.',
    pattern: 'hilly-grid',
    order: 7,
  },
  {
    id: 'sunset',
    name: 'Sunset & Ocean Beach',
    color: [128, 136, 148],
    bounds: { x: 14, y: 112, w: 76, h: 68 },
    flavor: 'Regular grid dissolving into fog; pale sand strip along the ocean.',
    pattern: 'fog-gradient',
    order: 8,
  },
  {
    id: 'bayview',
    name: 'Bayview & Dogpatch',
    color: [118, 102, 88],
    bounds: { x: 152, y: 128, w: 78, h: 50 },
    flavor: 'Industrial waterfront, cranes, wider blocks — good home for WIP markers.',
    pattern: 'industrial',
    order: 9,
  },
]

export default districts
