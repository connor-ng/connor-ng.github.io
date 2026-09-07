import {
  COLS,
  ROWS,
  TILE,
  generatePlaceholderMap,
} from './generatePlaceholderMap'
import { publicUrl } from './publicUrl'

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
    const worldUrl = publicUrl('/map/world.png')
    const response = await fetch(worldUrl, { method: 'HEAD' })
    if (response.ok) {
      return {
        ...base,
        mapImageUrl: worldUrl,
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
