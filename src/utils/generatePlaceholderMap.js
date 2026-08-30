import districts from '../data/districts'

export const TILE = 10
export const COLS = 256
export const ROWS = 192

const WATER = {
  pacific: [72, 108, 132],
  bay: [88, 128, 152],
}

const LAND_FILL = [108, 104, 98]

function hash(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}

function westShore(gy) {
  return (
    16 +
    Math.sin(gy * 0.09) * 9 +
    Math.cos(gy * 0.17) * 5 +
    (gy / ROWS) * 10
  )
}

function eastShore(gy) {
  return (
    246 -
    Math.sin(gy * 0.08) * 11 -
    Math.cos(gy * 0.12) * 7 -
    (gy / ROWS) * 6
  )
}

/** Stylized SF peninsula — Pacific west, bay east, bridge gap north. */
function getTerrain(gx, gy) {
  if (gx < 0 || gy < 0 || gx >= COLS || gy >= ROWS) {
    return { kind: 'pacific' }
  }

  const west = westShore(gy)
  const east = eastShore(gy)

  if (gx < west) return { kind: 'pacific' }
  if (gx > east) return { kind: 'bay' }

  // North bay opening (Marin / Golden Gate channel)
  if (gy < 20 && gx > 108) return { kind: 'bay' }
  if (gy < 14 && gx > 72) return { kind: 'bay' }

  // South bay / channel east of Dogpatch
  if (gy > 168 && gx > 198) return { kind: 'bay' }

  const district = getDistrictAt(gx, gy)
  if (district) return { kind: 'district', district }

  return { kind: 'land' }
}

function getDistrictAt(gx, gy) {
  const matches = districts.filter(
    (district) =>
      gx >= district.bounds.x &&
      gx < district.bounds.x + district.bounds.w &&
      gy >= district.bounds.y &&
      gy < district.bounds.y + district.bounds.h,
  )

  if (matches.length === 0) return null

  matches.sort(
    (a, b) => a.bounds.w * a.bounds.h - b.bounds.w * b.bounds.h,
  )

  return matches[0]
}

function touchesWater(gx, gy) {
  const here = getTerrain(gx, gy)
  if (here.kind === 'pacific' || here.kind === 'bay') return false

  const neighbors = [
    getTerrain(gx + 1, gy),
    getTerrain(gx - 1, gy),
    getTerrain(gx, gy + 1),
    getTerrain(gx, gy - 1),
  ]

  return neighbors.some((tile) => tile.kind === 'pacific' || tile.kind === 'bay')
}

function isGoldenGate(gx, gy) {
  return gy >= 24 && gy <= 30 && gx >= 58 && gx <= 98 && (gy === 27 || gx === 58 || gx === 98)
}

function isGoldenGatePark(gx, gy) {
  return gy >= 88 && gy <= 108 && gx >= 38 && gx <= 118
}

function streetOverlay(gx, gy, terrain) {
  if (terrain.kind === 'pacific' || terrain.kind === 'bay') return false

  const district = terrain.district
  if (district?.pattern === 'diagonal-grid') {
    return (gx + gy) % 7 === 0 || (gx - gy + ROWS) % 9 === 0
  }
  if (district?.pattern === 'piers') {
    return gx % 5 === 0 || gy % 6 === 0
  }
  if (district?.pattern === 'wide-avenues') {
    return gx % 9 === 0 || gy % 11 === 0
  }

  return gx % 6 === 0 || gy % 6 === 0
}

export function generatePlaceholderMap() {
  const width = COLS * TILE
  const height = ROWS * TILE
  const districtTileCounts = {}

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  for (let gy = 0; gy < ROWS; gy++) {
    for (let gx = 0; gx < COLS; gx++) {
      const terrain = getTerrain(gx, gy)
      let r
      let g
      let b

      if (terrain.kind === 'pacific') {
        ;[r, g, b] = WATER.pacific
      } else if (terrain.kind === 'bay') {
        ;[r, g, b] = WATER.bay
      } else if (terrain.kind === 'district') {
        const { district } = terrain
        districtTileCounts[district.id] = (districtTileCounts[district.id] || 0) + 1
        ;[r, g, b] = district.color
      } else {
        ;[r, g, b] = LAND_FILL
      }

      const n = (hash(gx, gy) - 0.5) * 18
      ctx.fillStyle = `rgb(${r + n | 0}, ${g + n | 0}, ${b + n | 0})`
      ctx.fillRect(gx * TILE, gy * TILE, TILE, TILE)

      if (isGoldenGatePark(gx, gy) && terrain.kind !== 'pacific' && terrain.kind !== 'bay') {
        ctx.fillStyle = 'rgba(70, 110, 62, 0.55)'
        ctx.fillRect(gx * TILE, gy * TILE, TILE, TILE)
      }

      if (streetOverlay(gx, gy, terrain)) {
        ctx.fillStyle = 'rgba(20, 24, 30, 0.12)'
        ctx.fillRect(gx * TILE, gy * TILE, TILE, TILE)
      }

      if (touchesWater(gx, gy)) {
        ctx.fillStyle = 'rgba(12, 20, 32, 0.28)'
        ctx.fillRect(gx * TILE, gy * TILE, TILE, TILE)
      }

      if (isGoldenGate(gx, gy)) {
        ctx.fillStyle = '#c45c3a'
        ctx.fillRect(gx * TILE, gy * TILE, TILE, TILE)
      }
    }
  }

  return {
    mapImageUrl: canvas.toDataURL(),
    districtTileCounts,
    width,
    height,
    tileSize: TILE,
    cols: COLS,
    rows: ROWS,
  }
}
