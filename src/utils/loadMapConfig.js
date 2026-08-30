import {
  COLS,
  ROWS,
  TILE,
  generatePlaceholderMap,
} from './generatePlaceholderMap'

/**
 * @returns {Promise<{
 *   mapImageUrl: string
 *   width: number
 *   height: number
 *   tileSize: number
 *   cols: number
 *   rows: number
 *   source: 'painted' | 'scaffold'
 * }>}
 */
export async function loadMapConfig() {
  const base = {
    width: COLS * TILE,
    height: ROWS * TILE,
    tileSize: TILE,
    cols: COLS,
    rows: ROWS,
  }

  try {
    const response = await fetch('/map/world.png', { method: 'HEAD' })
    if (response.ok) {
      return {
        ...base,
        mapImageUrl: '/map/world.png',
        source: 'painted',
      }
    }
  } catch {
    // Fall back to the procedural scaffold.
  }

  return {
    ...generatePlaceholderMap(),
    source: 'scaffold',
  }
}
