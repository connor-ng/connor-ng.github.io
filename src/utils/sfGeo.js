import { COLS, ROWS } from './generatePlaceholderMap'

/** Geographic bounds for the San Francisco city peninsula (not Bay Area). */
export const SF_BOUNDS = {
  north: 37.811,
  south: 37.707,
  west: -122.517,
  east: -122.356,
}

/** Initial viewport — frames the city proper (Golden Gate to Bayview). */
export const SF_VIEW_BOUNDS = [
  [37.707, -122.517],
  [37.811, -122.356],
]

export const SF_CENTER = { lat: 37.759, lng: -122.439 }
export const SF_DEFAULT_ZOOM = 12.5
export const SF_MIN_ZOOM = 12
export const SF_MAX_ZOOM = 18

/** Dark raster tiles (no API key). Esri uses {z}/{y}/{x} order. */
export const SF_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'

export const SF_LABEL_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}'

export const SF_TILE_MAX_ZOOM = 16

/** Zoom thresholds for layered map detail. */
export const ZOOM_DISTRICTS = 11
export const ZOOM_DISTRICT_LABELS = 13.75

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
