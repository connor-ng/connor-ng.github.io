export const TILE = 10
export const COLS = 256
export const ROWS = 192

export const BIOMES = {
  ocean: { color: [145, 175, 195] },
  forest: { color: [58, 92, 48] },
  snow: { color: [206, 222, 224] },
  desert: { color: [196, 172, 122] },
  swamp: { color: [98, 118, 66] },
  volcanic: { color: [74, 58, 78] },
  plains: { color: [138, 158, 88] },
  tundra: { color: [150, 170, 168] },
  jungle: { color: [36, 74, 40] },
}

const SEEDS = [
  { x: 128, y: 28, b: 'snow' },
  { x: 98, y: 38, b: 'snow' },
  { x: 158, y: 34, b: 'snow' },
  { x: 108, y: 52, b: 'plains' },
  { x: 198, y: 44, b: 'desert' },
  { x: 88, y: 82, b: 'forest' },
  { x: 128, y: 96, b: 'swamp' },
  { x: 176, y: 88, b: 'forest' },
  { x: 72, y: 118, b: 'forest' },
  { x: 104, y: 132, b: 'plains' },
  { x: 148, y: 138, b: 'swamp' },
  { x: 192, y: 124, b: 'desert' },
  { x: 56, y: 158, b: 'volcanic' },
  { x: 118, y: 164, b: 'plains' },
  { x: 172, y: 168, b: 'forest' },
  { x: 214, y: 36, b: 'tundra' },
  { x: 42, y: 96, b: 'jungle' },
  { x: 208, y: 172, b: 'jungle' },
]

function hash(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}

function isLand(gx, gy) {
  const cx = COLS / 2
  const cy = ROWS / 2
  const dx = (gx - cx) / (COLS / 2)
  const dy = (gy - cy) / (ROWS / 2)
  const dist = Math.sqrt(dx * dx + dy * dy)
  const wobble = Math.sin(gx * 0.12) * 0.06 + Math.cos(gy * 0.14) * 0.06
  return dist < 0.9 + wobble
}

function nearestBiome(gx, gy) {
  let best = null
  let bestD = Infinity
  for (const s of SEEDS) {
    const d = (s.x - gx) ** 2 + (s.y - gy) ** 2
    if (d < bestD) {
      bestD = d
      best = s.b
    }
  }
  return best
}

function tileBiome(gx, gy) {
  if (gx < 0 || gy < 0 || gx >= COLS || gy >= ROWS || !isLand(gx, gy)) {
    return 'ocean'
  }
  return nearestBiome(gx, gy)
}

function touchesOcean(gx, gy) {
  return (
    tileBiome(gx + 1, gy) === 'ocean' ||
    tileBiome(gx - 1, gy) === 'ocean' ||
    tileBiome(gx, gy + 1) === 'ocean' ||
    tileBiome(gx, gy - 1) === 'ocean'
  )
}

export function generatePlaceholderMap() {
  const width = COLS * TILE
  const height = ROWS * TILE
  const biomeTileCounts = {}

  const grid = Array.from({ length: ROWS }, (_, gy) =>
    Array.from({ length: COLS }, (_, gx) => {
      const biome = tileBiome(gx, gy)
      biomeTileCounts[biome] = (biomeTileCounts[biome] || 0) + 1
      return biome
    }),
  )

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  for (let gy = 0; gy < ROWS; gy++) {
    for (let gx = 0; gx < COLS; gx++) {
      const biome = grid[gy][gx]
      const [r, g, b] = BIOMES[biome].color
      const n = (hash(gx, gy) - 0.5) * 26
      ctx.fillStyle = `rgb(${r + n | 0}, ${g + n | 0}, ${b + n | 0})`
      ctx.fillRect(gx * TILE, gy * TILE, TILE, TILE)

      if (biome !== 'ocean' && touchesOcean(gx, gy)) {
        ctx.fillStyle = 'rgba(20, 30, 20, 0.35)'
        ctx.fillRect(gx * TILE, gy * TILE, TILE, TILE)
      }
    }
  }

  return {
    mapImageUrl: canvas.toDataURL(),
    biomeTileCounts,
    width,
    height,
    tileSize: TILE,
    cols: COLS,
    rows: ROWS,
  }
}
