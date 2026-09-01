import { COLS, ROWS } from './generatePlaceholderMap'

/** Geographic bounds for the San Francisco peninsula (city-focused). */
export const SF_BOUNDS = {
  north: 37.808,
  south: 37.708,
  west: -122.513,
  east: -122.368,
}

/** Initial viewport — frames the city, not the whole bay area. */
export const SF_VIEW_BOUNDS = [
  [37.708, -122.513],
  [37.808, -122.368],
]

export const SF_CENTER = { lat: 37.756, lng: -122.435 }
export const SF_DEFAULT_ZOOM = 13
export const SF_MIN_ZOOM = 12
export const SF_MAX_ZOOM = 18

/** Zoom thresholds for layered map detail. */
export const ZOOM_DISTRICTS = 11
export const ZOOM_DISTRICT_LABELS = 13.75

export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/dark'

/** @returns {[number, number]} Leaflet [lat, lng] */
export function gridToLatLng(gx, gy) {
  const lng =
    SF_BOUNDS.west + (gx / COLS) * (SF_BOUNDS.east - SF_BOUNDS.west)
  const lat =
    SF_BOUNDS.north - (gy / ROWS) * (SF_BOUNDS.north - SF_BOUNDS.south)
  return [lat, lng]
}

export function latLngToGrid(lat, lng) {
  const gx = Math.round(
    ((lng - SF_BOUNDS.west) / (SF_BOUNDS.east - SF_BOUNDS.west)) * COLS,
  )
  const gy = Math.round(
    ((SF_BOUNDS.north - lat) / (SF_BOUNDS.north - SF_BOUNDS.south)) * ROWS,
  )
  return { gx, gy }
}

/** @returns {[number, number]} GeoJSON [lng, lat] */
export function gridToLngLat(gx, gy) {
  const [lat, lng] = gridToLatLng(gx, gy)
  return [lng, lat]
}

/**
 * @param {{ gx: number, gy: number, lat?: number, lng?: number }} point
 * @returns {[number, number]}
 */
export function getPointLatLng(point) {
  if (point.lat != null && point.lng != null) {
    return [point.lat, point.lng]
  }
  return gridToLatLng(point.gx, point.gy)
}

export function formatGeoCoords(lat, lng, gx, gy) {
  return `{ lat: ${lat.toFixed(4)}, lng: ${lng.toFixed(4)}, gx: ${gx}, gy: ${gy} }`
}

export function getSfMaxBounds() {
  return [
    [SF_BOUNDS.south, SF_BOUNDS.west],
    [SF_BOUNDS.north, SF_BOUNDS.east],
  ]
}
